"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkLogin, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { attribute, syncStripe } from "@/lib/sync";
import { MIN_PW, hashPassword } from "@/lib/partnerAuth";
import { commissionCents, normalizeEmail, saleStatus } from "@/lib/commission";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const pw = String(formData.get("password") ?? "");
  if (!checkLogin(email, pw)) redirect("/admin/login?err=1");
  createSession();
  redirect("/admin");
}

export async function logout() {
  destroySession();
  redirect("/admin/login");
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

export async function createPartner(formData: FormData) {
  requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const pct = Number(String(formData.get("pct") ?? "10").replace(",", "."));
  const pw = String(formData.get("password") ?? "");
  if (!name) redirect("/admin/partners?err=nome");
  if (pw.length < MIN_PW) redirect("/admin/partners?err=" + encodeURIComponent(`La password deve avere almeno ${MIN_PW} caratteri`));
  const base = slug(name) || "partner";
  const supa = db();
  let code = base;
  for (let i = 2; i < 50; i++) {
    const { data } = await supa.from("partners").select("id").eq("code", code).maybeSingle();
    if (!data) break;
    code = `${base}-${i}`;
  }
  const { error } = await supa.from("partners").insert({
    name,
    email,
    code,
    token: randomBytes(18).toString("hex"),
    pw_hash: hashPassword(pw),
    pw_set_at: new Date().toISOString(),
    commission_pct: Number.isFinite(pct) && pct >= 0 && pct <= 100 ? pct : 10,
  });
  if (error) redirect(`/admin/partners?err=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/partners");
  redirect("/admin/partners?ok=1");
}

/** Imposta o cambia la password di un partner (tutte le volte che vuoi). Le sessioni già aperte decadono. */
export async function setPartnerPassword(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const pw = String(formData.get("password") ?? "");
  if (pw.length < MIN_PW) redirect("/admin/partners?err=" + encodeURIComponent(`La password deve avere almeno ${MIN_PW} caratteri`));
  const { error } = await db().from("partners").update({
    pw_hash: hashPassword(pw), pw_set_at: new Date().toISOString(), pw_fails: 0, pw_locked_until: null,
  }).eq("id", id);
  if (error) redirect("/admin/partners?err=" + encodeURIComponent(error.message));
  revalidatePath("/admin/partners");
  redirect("/admin/partners?pwok=1");
}

export async function togglePartner(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id"));
  const active = formData.get("active") === "1";
  await db().from("partners").update({ active: !active }).eq("id", id);
  revalidatePath("/admin/partners");
}

export async function deletePartner(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const typed = String(formData.get("confirm") ?? "").trim().toLowerCase();
  const supa = db();
  const { data: partner } = await supa.from("partners").select("id, name").eq("id", id).maybeSingle();
  if (!partner) redirect("/admin/partners?err=" + encodeURIComponent("Partner non trovato"));
  if (typed !== partner.name.trim().toLowerCase()) {
    redirect("/admin/partners?err=" + encodeURIComponent("Il nome scritto non coincide: partner non eliminato"));
  }
  const { count: paid } = await supa
    .from("payouts")
    .select("id", { count: "exact", head: true })
    .eq("partner_id", id)
    .eq("status", "pagato");
  if ((paid ?? 0) > 0) {
    redirect(
      "/admin/partners?err=" +
        encodeURIComponent(`${partner.name} ha già ricevuto pagamenti: per tenere lo storico disattivalo invece di eliminarlo`)
    );
  }
  // Le vendite restano, ma tornano senza partner.
  await supa
    .from("sales")
    .update({ partner_id: null, lead_id: null, payout_id: null, commission_pct: null, attribution: "nessuna" })
    .eq("partner_id", id);
  const { error } = await supa.from("partners").delete().eq("id", id);
  if (error) redirect("/admin/partners?err=" + encodeURIComponent(error.message));
  revalidatePath("/admin");
  revalidatePath("/admin/partners");
  revalidatePath("/admin/sales");
  redirect("/admin/partners?deleted=" + encodeURIComponent(partner.name));
}

export async function syncNow(formData: FormData) {
  requireAdmin();
  const days = Number(formData.get("days") ?? 45);
  const r = await syncStripe(Number.isFinite(days) && days > 0 ? Math.min(days, 730) : 45);
  const msg = `Sincronizzate ${r.charges} vendite, ${r.attributed} attribuite${r.errors.length ? ` - errori: ${r.errors.join("; ")}` : ""}`;
  revalidatePath("/admin");
  revalidatePath("/admin/sales");
  redirect(`/admin?msg=${encodeURIComponent(msg)}`);
}

export async function addManualSale(formData: FormData) {
  requireAdmin();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const gross = Math.round(Number(String(formData.get("amount") ?? "0").replace(",", ".")) * 100);
  const netRaw = String(formData.get("net") ?? "").trim();
  const net = netRaw ? Math.round(Number(netRaw.replace(",", ".")) * 100) : gross;
  const date = String(formData.get("date") ?? "") || new Date().toISOString().slice(0, 10);
  const description = String(formData.get("description") ?? "").trim() || "Vendita manuale";
  if (!(gross > 0) || !(net >= 0)) redirect("/admin/sales?err=importo");
  const paidAt = new Date(`${date}T12:00:00Z`).toISOString();
  const found = await attribute(email, paidAt);
  const { error } = await db().from("sales").insert({
    external_id: `manual_${randomBytes(8).toString("hex")}`,
    source: "manuale",
    email,
    description,
    amount_cents: gross,
    net_cents: net,
    paid_at: paidAt,
    partner_id: found?.partnerId ?? null,
    lead_id: found?.leadId ?? null,
    commission_pct: found?.pct ?? null,
    attribution: found ? "auto" : "nessuna",
  });
  if (error) redirect(`/admin/sales?err=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/sales");
  redirect("/admin/sales?ok=1");
}

/** Assegna a mano una vendita a un partner (es. email diversa) oppure la lascia senza partner. */
export async function assignSale(formData: FormData) {
  requireAdmin();
  const saleId = String(formData.get("sale_id"));
  const partnerId = String(formData.get("partner_id") ?? "");
  const supa = db();
  const { data: sale } = await supa.from("sales").select("payout_id").eq("id", saleId).maybeSingle();
  if (!sale || sale.payout_id) redirect("/admin/sales?err=gia-pagata");
  if (!partnerId) {
    await supa.from("sales").update({ partner_id: null, lead_id: null, commission_pct: null, attribution: "manuale" }).eq("id", saleId);
  } else {
    const { data: p } = await supa.from("partners").select("commission_pct").eq("id", partnerId).maybeSingle();
    await supa
      .from("sales")
      .update({ partner_id: partnerId, lead_id: null, commission_pct: p?.commission_pct ?? 10, attribution: "manuale" })
      .eq("id", saleId);
  }
  revalidatePath("/admin/sales");
}

/** Raggruppa i compensi maturati e non ancora pagati in un pagamento per partner. */
export async function createPayouts() {
  requireAdmin();
  const supa = db();
  const { data: sales } = await supa
    .from("sales")
    .select("id, partner_id, amount_cents, net_cents, refunded_cents, paid_at, commission_pct, payout_id, currency")
    .not("partner_id", "is", null)
    .is("payout_id", null);
  const byPartner = new Map<string, { ids: string[]; total: number; currency: string }>();
  for (const s of sales ?? []) {
    if (saleStatus(s) !== "maturata") continue;
    const cur = byPartner.get(s.partner_id) ?? { ids: [] as string[], total: 0, currency: s.currency as string };
    cur.ids.push(s.id);
    cur.total += commissionCents(s);
    byPartner.set(s.partner_id, cur);
  }
  const min = Math.round(Number(process.env.MIN_PAYOUT_EUR ?? "50") * 100);
  const period = new Date().toISOString().slice(0, 7);
  let created = 0;
  for (const [partnerId, v] of byPartner) {
    if (v.total < min) continue; // sotto soglia: resta accumulato per il mese dopo
    const { data: payout } = await supa
      .from("payouts")
      .insert({ partner_id: partnerId, period, amount_cents: v.total, currency: v.currency })
      .select("id")
      .single();
    if (payout) {
      await supa.from("sales").update({ payout_id: payout.id }).in("id", v.ids);
      created++;
    }
  }
  revalidatePath("/admin/payouts");
  redirect(`/admin/payouts?msg=${encodeURIComponent(`Creati ${created} pagamenti (soglia minima ${min / 100} €)`)}`);
}

export async function markPaid(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id"));
  const note = String(formData.get("note") ?? "").trim() || null;
  await db().from("payouts").update({ status: "pagato", paid_at: new Date().toISOString(), note }).eq("id", id);
  revalidatePath("/admin/payouts");
}

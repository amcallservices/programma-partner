"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/supabase";
import { isPartnerUnlocked, normalizeIban, openPartnerSession, verifyPassword } from "@/lib/partnerAuth";

const MAX_FAILS = 5;
const LOCK_MIN = 15;

function back(token: string, next: string, lang: string, q = ""): string {
  const path = next === "profilo" ? `/p/${token}/profilo` : `/p/${token}`;
  const params = new URLSearchParams();
  if (lang === "en") params.set("lang", "en");
  if (q) params.set(q.split("=")[0], q.split("=")[1] ?? "1");
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export async function unlock(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const next = String(formData.get("next") ?? "");
  const lang = String(formData.get("lang") ?? "it");
  const pw = String(formData.get("password") ?? "");
  const supa = db();
  const { data: p } = await supa.from("partners").select("id, token, pw_hash, pw_fails, pw_locked_until").eq("token", token).maybeSingle();
  if (!p || !p.pw_hash) redirect(back(token, next, lang));
  if (p.pw_locked_until && new Date(p.pw_locked_until).getTime() > Date.now()) redirect(back(token, next, lang, "err=locked"));
  if (!verifyPassword(pw, p.pw_hash)) {
    const fails = (p.pw_fails ?? 0) + 1;
    const lock = fails >= MAX_FAILS;
    await supa.from("partners").update({
      pw_fails: lock ? 0 : fails,
      pw_locked_until: lock ? new Date(Date.now() + LOCK_MIN * 60000).toISOString() : null,
    }).eq("id", p.id);
    redirect(back(token, next, lang, lock ? "err=locked" : "err=pw"));
  }
  await supa.from("partners").update({ pw_fails: 0, pw_locked_until: null }).eq("id", p.id);
  openPartnerSession(p);
  redirect(back(token, next, lang));
}

export async function saveProfile(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const lang = String(formData.get("lang") ?? "it");
  const supa = db();
  const { data: p } = await supa.from("partners").select("id, token, pw_hash").eq("token", token).maybeSingle();
  if (!p || !isPartnerUnlocked(p)) redirect(back(token, "profilo", lang));
  const f = (k: string, max: number) => String(formData.get(k) ?? "").trim().replace(/\s+/g, " ").slice(0, max);
  const first = f("first_name", 60), last = f("last_name", 60), bank = f("bank", 80), address = f("address", 200);
  const phone = f("phone", 25);
  const iban = normalizeIban(String(formData.get("iban") ?? ""));
  const err = (e: string) => redirect(back(token, "profilo", lang, `err=${e}`));
  if (!first || !last || !bank || !address || !phone) err("missing");
  if (!iban) err("iban");
  if (!/^\+?[0-9 ().-]{6,25}$/.test(phone)) err("phone");
  const { error } = await supa.from("partner_profiles").upsert({
    partner_id: p.id, first_name: first, last_name: last, iban, bank, phone, address, updated_at: new Date().toISOString(),
  });
  if (error) err("save");
  revalidatePath("/admin/profiles");
  redirect(back(token, "profilo", lang, "saved=1"));
}

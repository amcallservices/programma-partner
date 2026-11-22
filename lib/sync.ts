import Stripe from "stripe";
import { db } from "./supabase";
import { guessSite, normalizeEmail, pickLead } from "./commission";

export type SyncResult = { accounts: number; charges: number; attributed: number; errors: string[] };

type Partner = { id: string; email: string | null; commission_pct: number };

/**
 * Legge gli addebiti da Stripe (SOLA LETTURA) e li registra come vendite.
 * Se l'email del cliente coincide con quella di un lead, la vendita va al partner del lead.
 * Le chiavi sono in STRIPE_READ_KEYS (separate da virgola): usare chiavi riservate "rk_live_..."
 * con il solo permesso di lettura su Charges.
 */
export async function syncStripe(days = 45): Promise<SyncResult> {
  const raw = process.env.STRIPE_READ_KEYS || process.env.STRIPE_READ_KEY || "";
  const keys = raw.split(",").map((k) => k.trim()).filter(Boolean);
  const result: SyncResult = { accounts: keys.length, charges: 0, attributed: 0, errors: [] };
  if (keys.length === 0) {
    result.errors.push("Nessuna chiave Stripe configurata (STRIPE_READ_KEYS)");
    return result;
  }

  const since = Math.floor((Date.now() - days * 86400000) / 1000);

  for (const key of keys) {
    const stripe = new Stripe(key);
    try {
      const batch: Stripe.Charge[] = [];
      for await (const ch of stripe.charges.list({
        created: { gte: since },
        limit: 100,
        expand: ["data.balance_transaction", "data.customer"],
      })) {
        if (ch.status !== "succeeded" || !ch.paid) continue;
        batch.push(ch);
        if (batch.length >= 100) {
          await processBatch(batch.splice(0), result);
        }
      }
      if (batch.length) await processBatch(batch, result);
    } catch (e) {
      result.errors.push(`Account ...${key.slice(-4)}: ${(e as Error).message}`);
    }
  }
  return result;
}

function chargeEmail(ch: Stripe.Charge): string | null {
  const customer = typeof ch.customer === "object" && ch.customer && !("deleted" in ch.customer) ? ch.customer : null;
  return normalizeEmail(ch.billing_details?.email || ch.receipt_email || customer?.email || null);
}

async function processBatch(charges: Stripe.Charge[], result: SyncResult) {
  const supa = db();
  const ids = charges.map((c) => c.id);
  const { data: existing } = await supa
    .from("sales")
    .select("external_id, payout_id, attribution, partner_id, lead_id, commission_pct")
    .in("external_id", ids);
  const existingMap = new Map((existing ?? []).map((e) => [e.external_id as string, e]));

  for (const ch of charges) {
    const prev = existingMap.get(ch.id);
    // Vendite già incluse in un pagamento ai partner: non si toccano.
    if (prev?.payout_id) continue;

    const bt = typeof ch.balance_transaction === "object" ? ch.balance_transaction : null;
    const net = bt ? bt.net : ch.amount;
    const email = chargeEmail(ch);
    const paidAtIso = new Date(ch.created * 1000).toISOString();

    let partnerId: string | null = prev?.partner_id ?? null;
    let leadId: string | null = prev?.lead_id ?? null;
    let pct: number | null = prev?.commission_pct ?? null;
    let attribution: "auto" | "manuale" | "nessuna" = (prev?.attribution as "auto" | "manuale" | "nessuna") ?? "nessuna";

    if (attribution !== "manuale") {
      const found = await attribute(email, paidAtIso);
      partnerId = found?.partnerId ?? null;
      leadId = found?.leadId ?? null;
      pct = found?.pct ?? null;
      attribution = found ? "auto" : "nessuna";
    }

    const description = ch.description || (ch.metadata && Object.values(ch.metadata).join(" ")) || null;
    const { error } = await supa.from("sales").upsert(
      {
        external_id: ch.id,
        source: "stripe",
        email,
        description,
        site_guess: guessSite(description),
        amount_cents: ch.amount,
        net_cents: net,
        refunded_cents: ch.amount_refunded,
        currency: ch.currency,
        paid_at: paidAtIso,
        partner_id: partnerId,
        lead_id: leadId,
        commission_pct: pct,
        attribution,
      },
      { onConflict: "external_id" }
    );
    if (error) result.errors.push(`${ch.id}: ${error.message}`);
    else {
      result.charges++;
      if (partnerId) result.attributed++;
    }
  }
}

/** Cerca il lead giusto per email e data, evitando l'autoacquisto del partner. */
export async function attribute(
  email: string | null,
  paidAt: string
): Promise<{ partnerId: string; leadId: string; pct: number } | null> {
  if (!email) return null;
  const supa = db();
  const { data: leads } = await supa
    .from("leads")
    .select("id, partner_id, created_at")
    .eq("email", email)
    .order("created_at", { ascending: true });
  const lead = pickLead(leads ?? [], paidAt);
  if (!lead) return null;
  const { data: partner } = await supa
    .from("partners")
    .select("id, email, commission_pct")
    .eq("id", lead.partner_id)
    .maybeSingle<Partner>();
  if (!partner) return null;
  if (normalizeEmail(partner.email) === email) return null; // niente autoacquisti
  return { partnerId: partner.id, leadId: lead.id, pct: Number(partner.commission_pct) };
}

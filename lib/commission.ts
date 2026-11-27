// Logica pura (senza database): normalizzazione email, commissioni e stati.

export const VESTING_DAYS = 30;       // il compenso matura 30 giorni dopo la vendita
export const ATTRIBUTION_DAYS = 365;  // il cliente è del partner per 12 mesi dalla prima iscrizione

export function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const e = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
}

export function maskEmail(email: string | null | undefined): string {
  if (!email) return "—";
  const [user, domain] = email.split("@");
  if (!domain) return "—";
  return `${user.slice(0, 2)}***@${domain}`;
}

export type SaleLike = {
  amount_cents: number;
  net_cents: number;
  refunded_cents: number;
  paid_at: string;
  commission_pct: number | null;
  partner_id: string | null;
  payout_id: string | null;
};

export type SaleStatus = "annullata" | "pagata" | "in attesa" | "maturata" | "non attribuita";

/** Netto effettivo dopo un eventuale rimborso (anche parziale). */
export function effectiveNet(s: Pick<SaleLike, "amount_cents" | "net_cents" | "refunded_cents">): number {
  if (s.amount_cents <= 0) return 0;
  const keep = Math.max(0, s.amount_cents - Math.max(0, s.refunded_cents)) / s.amount_cents;
  return Math.round(s.net_cents * keep);
}

/** Compenso in centesimi: percentuale sul netto effettivo, arrotondata per difetto. */
export function commissionCents(s: SaleLike): number {
  if (!s.partner_id || s.commission_pct == null) return 0;
  return Math.floor((effectiveNet(s) * Number(s.commission_pct)) / 100);
}

export function saleStatus(s: SaleLike, now: Date = new Date()): SaleStatus {
  if (!s.partner_id) return "non attribuita";
  if (s.refunded_cents >= s.amount_cents) return "annullata";
  if (s.payout_id) return "pagata";
  const matures = new Date(s.paid_at).getTime() + VESTING_DAYS * 86400000;
  return now.getTime() < matures ? "in attesa" : "maturata";
}

/** Dato l'elenco dei lead con la stessa email, sceglie il primo contatto utile (first touch). */
export function pickLead<T extends { created_at: string; partner_id: string }>(
  leads: T[],
  paidAt: string,
  windowDays = ATTRIBUTION_DAYS
): T | null {
  const paid = new Date(paidAt).getTime();
  const from = paid - windowDays * 86400000;
  const valid = leads
    .filter((l) => {
      const t = new Date(l.created_at).getTime();
      return t <= paid && t >= from;
    })
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  return valid[0] ?? null;
}

/** Indovina il sito dalla descrizione del pagamento (solo a scopo informativo). */
export function guessSite(text: string | null | undefined): string | null {
  const t = (text ?? "").toLowerCase();
  if (!t) return null;
  if (t.includes("boost")) return "boost";
  if (t.includes("consulenza")) return "com";
  if (t.includes("liberamente")) return "lib";
  if (t.includes("compagnia") || t.includes("ghostwriting") || t.includes("solo ebook") || t.includes("libro completo") || t.includes("ebook + copertina")) return "cds";
  if (t.includes("scrittore")) return "soft";
  return null;
}

export function eur(cents: number, currency = "eur"): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

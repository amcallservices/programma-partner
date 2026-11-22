import assert from "node:assert/strict";
import { commissionCents, effectiveNet, guessSite, maskEmail, normalizeEmail, pickLead, saleStatus } from "../lib/commission.ts";

const day = 86400000;
const iso = (d: number) => new Date(Date.UTC(2026, 10, 1) + d * day).toISOString();
const base = { amount_cents: 2500, net_cents: 2438, refunded_cents: 0, paid_at: iso(0), commission_pct: 10, partner_id: "p1", payout_id: null };

// 10% sul netto, arrotondato per difetto
assert.equal(commissionCents(base), 243);
// rimborso totale: compenso zero e stato annullata
assert.equal(commissionCents({ ...base, refunded_cents: 2500 }), 0);
assert.equal(saleStatus({ ...base, refunded_cents: 2500 }, new Date(iso(40))), "annullata");
// rimborso parziale del 50%
assert.equal(effectiveNet({ ...base, refunded_cents: 1250 }), 1219);
// senza partner: nessun compenso
assert.equal(commissionCents({ ...base, partner_id: null }), 0);
assert.equal(saleStatus({ ...base, partner_id: null }), "non attribuita");
// maturazione a 30 giorni
assert.equal(saleStatus(base, new Date(iso(29))), "in attesa");
assert.equal(saleStatus(base, new Date(iso(31))), "maturata");
assert.equal(saleStatus({ ...base, payout_id: "x" }, new Date(iso(31))), "pagata");
// email
assert.equal(normalizeEmail("  Giulia@Gmail.COM "), "giulia@gmail.com");
assert.equal(normalizeEmail("non-email"), null);
assert.equal(maskEmail("giulia@gmail.com"), "gi***@gmail.com");
// first touch entro 12 mesi, mai dopo la vendita
const leads = [
  { created_at: iso(-10), partner_id: "A" },
  { created_at: iso(-30), partner_id: "B" },
  { created_at: iso(5), partner_id: "C" },
];
assert.equal(pickLead(leads, iso(0))?.partner_id, "B");
assert.equal(pickLead([{ created_at: iso(-400), partner_id: "Z" }], iso(0)), null);
assert.equal(pickLead([], iso(0)), null);
// indizio sul sito
assert.equal(guessSite("Scrittore Site — Pacchetto Base — 150 crediti"), "soft");
assert.equal(guessSite("BOOST AI crediti"), "boost");
console.log("tutti i test superati");

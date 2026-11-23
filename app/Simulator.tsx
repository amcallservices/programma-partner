"use client";

import { useState } from "react";

const PCT = 15;

const SCENARI = [
  { id: "inizio", nome: "Si parte", sales: 5, price: 29 },
  { id: "crescita", nome: "In crescita", sales: 20, price: 39 },
  { id: "regime", nome: "A regime", sales: 60, price: 49 },
];

/** Stima indicativa: il compenso reale è calcolato sul netto incassato, dopo le commissioni di pagamento. */
export default function Simulator() {
  const [sales, setSales] = useState(20);
  const [price, setPrice] = useState(39);
  const fee = price * 0.015 + 0.25;
  const net = Math.max(price - fee, 0);
  const perSale = (net * PCT) / 100;
  const month = sales * perSale;
  const fmt = (n: number) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
  const active = SCENARI.find((s) => s.sales === sales && s.price === price)?.id;
  return (
    <div className="sim">
      <div>
        <div className="scen" role="group" aria-label="Scenari di esempio">
          {SCENARI.map((s) => (
            <button key={s.id} type="button" className={`ghost small${active === s.id ? " on" : ""}`} aria-pressed={active === s.id} onClick={() => { setSales(s.sales); setPrice(s.price); }}>
              {s.nome}: {s.sales} vendite
            </button>
          ))}
        </div>
        <label htmlFor="sales">Vendite al mese dai tuoi clienti <span className="rangeval">{sales}</span></label>
        <input id="sales" type="range" min={1} max={200} value={sales} onChange={(e) => setSales(Number(e.target.value))} />
        <label htmlFor="price">Prezzo medio di una vendita <span className="rangeval">{fmt(price)}</span></label>
        <input id="price" type="range" min={5} max={200} step={1} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        <p className="muted" style={{ marginTop: 14 }}>
          Stima indicativa, non una promessa di guadagno. Il compenso reale è il {PCT}% di quanto incassiamo davvero, dopo le
          commissioni di pagamento, e viene pagato per le vendite non rimborsate dopo 30 giorni.
        </p>
      </div>
      <div className="out" role="status">
        <span>Compenso stimato al mese</span>
        <b>{fmt(month)}</b>
        <small>{fmt(month * 12)} in un anno, con questo ritmo</small>
        <dl className="split">
          <div><dt>Prezzo della vendita</dt><dd>{fmt(price)}</dd></div>
          <div><dt>Commissioni di pagamento</dt><dd>− {fmt(Math.min(fee, price))}</dd></div>
          <div><dt>Netto incassato</dt><dd>{fmt(net)}</dd></div>
          <div className="mine"><dt>Il tuo {PCT}%, per ogni vendita</dt><dd>{fmt(perSale)}</dd></div>
        </dl>
      </div>
    </div>
  );
}

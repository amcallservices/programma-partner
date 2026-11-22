"use client";

import { useState } from "react";

const PCT = 10;

/** Stima indicativa: il compenso reale è calcolato sul netto incassato, dopo le commissioni di pagamento. */
export default function Simulator() {
  const [sales, setSales] = useState(20);
  const [price, setPrice] = useState(29);
  const net = Math.max(price - (price * 0.015 + 0.25), 0);
  const month = (sales * net * PCT) / 100;
  const fmt = (n: number) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
  return (
    <div className="sim">
      <div>
        <label htmlFor="sales">Vendite al mese dai tuoi clienti <span className="rangeval">{sales}</span></label>
        <input id="sales" type="range" min={1} max={200} value={sales} onChange={(e) => setSales(Number(e.target.value))} />
        <label htmlFor="price">Prezzo medio di una vendita <span className="rangeval">{fmt(price)}</span></label>
        <input id="price" type="range" min={5} max={200} step={1} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        <p className="muted" style={{ marginTop: 14 }}>
          Stima indicativa. Il compenso reale è il {PCT}% di quanto incassiamo davvero, dopo le commissioni di pagamento, e
          viene pagato per le vendite non rimborsate dopo 30 giorni.
        </p>
      </div>
      <div className="out" role="status">
        <span>Compenso stimato al mese</span>
        <b>{fmt(month)}</b>
        <small>{fmt(month * 12)} in un anno, con questo ritmo</small>
      </div>
    </div>
  );
}

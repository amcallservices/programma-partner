"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

type Step = { target: string; title: string; text: string };

const STEPS: Step[] = [
  { target: "", title: "Benvenuto nel tuo pannello", text: "In due minuti ti mostro dove vedere i tuoi guadagni e dove trovare i link da condividere. Puoi rivedere questa visita quando vuoi dal pulsante in alto." },
  { target: "stats", title: "I tuoi compensi", text: "«In attesa» è il compenso delle vendite recenti: matura dopo 30 giorni senza rimborso. «Maturato» è quello che ti dobbiamo pagare. «Già pagato» è quello che hai ricevuto." },
  { target: "links", title: "I tuoi link personali", text: "Uno per ogni sito. Copiali con un clic e usali nei tuoi video, post e messaggi. Chi li apre viene riconosciuto come una tua segnalazione." },
  { target: "how", title: "Come colleghiamo le vendite a te", text: "Chi apre il tuo link lascia la sua email, poi viene portato sul sito. Quando acquista con la stessa email, la vendita compare qui. Vale il primo partner che ha segnalato la persona, per 12 mesi." },
  { target: "sales", title: "Le vendite attribuite", text: "Ogni riga è una vendita arrivata da te, con il compenso e lo stato. Le email dei clienti sono mascherate per la loro privacy." },
  { target: "payouts", title: "I pagamenti", text: "Una volta al mese chiudiamo i conti e paghiamo il maturato, dai 50 € in su. Qui trovi ogni pagamento con la data." },
  { target: "", title: "Hai finito", text: "Se un cliente compra con un'email diversa da quella lasciata nel link, scrivici: controlliamo e assegniamo la vendita a mano. Buon lavoro!" },
];

const KEY = "pp-tour-done";

export default function Tour() {
  const [i, setI] = useState<number | null>(null);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setI(0);
    } catch {
      setI(0);
    }
  }, []);

  const close = useCallback(() => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setI(null);
  }, []);

  const measure = useCallback(() => {
    if (i === null) return;
    const t = STEPS[i].target;
    const el = t ? document.querySelector<HTMLElement>(`[data-tour="${t}"]`) : null;
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - 8, left: r.left - 8, width: r.width + 16, height: r.height + 16 });
  }, [i]);

  useLayoutEffect(() => {
    if (i === null) return;
    const t = STEPS[i].target;
    const el = t ? document.querySelector<HTMLElement>(`[data-tour="${t}"]`) : null;
    if (el) el.scrollIntoView({ block: "center", behavior: "auto" });
    measure();
    const onChange = () => measure();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
    };
  }, [i, measure]);

  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setI((v) => (v === null ? v : Math.min(v + 1, STEPS.length - 1)));
      if (e.key === "ArrowLeft") setI((v) => (v === null ? v : Math.max(v - 1, 0)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, close]);

  const start = () => setI(0);

  const step = i === null ? null : STEPS[i];
  let popStyle: React.CSSProperties = { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  if (rect) {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1000;
    const vh = typeof window !== "undefined" ? window.innerHeight : 700;
    const w = Math.min(360, vw - 24);
    const left = Math.max(12, Math.min(rect.left, vw - w - 12));
    const below = rect.top + rect.height + 12;
    const top = below + 200 < vh ? below : Math.max(12, rect.top - 200);
    popStyle = { top, left };
  }

  return (
    <>
      <button type="button" className="ghost small" onClick={start}>Visita guidata</button>
      {step && i !== null && (
        <>
          <div className="tour-shade" onClick={close} aria-hidden="true" />
          {rect ? (
            <div className="tour-spot" style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }} />
          ) : (
            <div className="tour-spot" style={{ top: "50%", left: "50%", width: 0, height: 0 }} />
          )}
          <div className="tour-pop" style={popStyle} role="dialog" aria-modal="true" aria-label={step.title}>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <div className="bar">
              <span className="prog">{i + 1} di {STEPS.length}</span>
              <span className="sp" />
              {i < STEPS.length - 1 && <button type="button" className="ghost small" onClick={close}>Salta</button>}
              {i > 0 && <button type="button" className="ghost small" onClick={() => setI(i - 1)}>Indietro</button>}
              {i < STEPS.length - 1 ? (
                <button type="button" className="small" onClick={() => setI(i + 1)} autoFocus>Avanti</button>
              ) : (
                <button type="button" className="small" onClick={close} autoFocus>Chiudi</button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

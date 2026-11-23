"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DETAIL, ESEMPI, SITES } from "@/lib/sites";

const LIGHT: Record<string, string> = { seo: "#2dd4bf", soft: "#60a5fa", lib: "#fb923c", com: "#a5a0ff", boost: "#c4b5fd" };
const GRAD: Record<string, string> = {
  seo: "linear-gradient(135deg,#0f766e,#134e4a)", soft: "linear-gradient(135deg,#2563eb,#1e3a8a)", lib: "linear-gradient(135deg,#ea580c,#9a3412)",
  com: "linear-gradient(135deg,#4f46c8,#1b1464)", boost: "linear-gradient(135deg,#7c3aed,#4c1d95)",
};
const PCT = 15;
const eur = (n: number) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
/** Compenso stimato: 15% sul netto, cioè dopo circa 1,5% + 0,25 € di commissioni di pagamento; arrotondato per difetto al centesimo. */
const gain = (price: number) => Math.floor(Math.max(price - (price * 0.015 + 0.25), 0) * PCT) / 100;
const W = 1280, H = 800, MS = 6500;

/** Slide scorrevoli: ogni sito è mostrato dal vivo in una finestra di browser (non cliccabile), con descrizione sotto. */
export default function SiteSlider() {
  const track = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState<number[]>([0, 1]);
  const [hold, setHold] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [k, setK] = useState(0.4);

  useEffect(() => { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);

  useEffect(() => {
    const el = track.current; if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / W));
    ro.observe(el); setK(el.clientWidth / W);
    return () => ro.disconnect();
  }, []);

  const select = useCallback((n: number, scroll = true) => {
    const idx = (n + SITES.length) % SITES.length;
    setI(idx);
    setLoaded((l) => Array.from(new Set([...l, idx, (idx + 1) % SITES.length])));
    root.current?.closest<HTMLElement>(".hero-home")?.style.setProperty("--glow", LIGHT[SITES[idx].key] ?? "#7c7cff");
    const el = track.current;
    if (scroll && el) el.scrollTo({ left: idx * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  // aggiorna il sito attivo quando l'utente scorre col dito o col mouse
  function onScroll() {
    const el = track.current; if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== i && idx >= 0 && idx < SITES.length) select(idx, false);
  }

  useEffect(() => {
    if (hold || reduced) return;
    const t = setTimeout(() => select(i + 1), MS);
    return () => clearTimeout(t);
  }, [i, hold, reduced, select]);

  const s = SITES[i];
  const d = DETAIL[s.key];
  return (
    <div ref={root} className="ss" aria-roledescription="carousel" aria-label="I cinque siti da promuovere"
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") select(i + 1); if (e.key === "ArrowLeft") select(i - 1); }}>
      <div className="ss-main">
        <div className="ss-showcase">
          <div className="ss-track" ref={track} onScroll={onScroll}>
            {SITES.map((x, n) => (
              <div className="ss-slide" key={x.key} role="group" aria-roledescription="slide" aria-label={`${n + 1} di ${SITES.length}: ${x.name}`} aria-hidden={n !== i}>
                <div className="ss-win">
                  <div className="ss-bar"><i /><i /><i /><span>{x.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span></div>
                  <div className="ss-view" style={{ background: GRAD[x.key] }}>
                    <b className="ss-name">{x.name}</b>
                    {loaded.includes(n) && (
                      <iframe title={`Anteprima di ${x.name}`} src={x.key === "soft" ? `${x.url}?embed=true` : x.url} loading="lazy" tabIndex={-1}
                        sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer"
                        style={{ width: W, height: H, transform: `scale(${k})` }} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="ss-ctl">
            <button type="button" className="ghost small" onClick={() => select(i - 1)} aria-label="Sito precedente">←</button>
            <div className="ss-dots" role="tablist" aria-label="Siti">
              {SITES.map((x, n) => (
                <button key={x.key} type="button" role="tab" aria-selected={n === i} aria-label={x.name} className={n === i ? "on" : ""} style={{ ["--c" as string]: LIGHT[x.key] }} onClick={() => select(n)} />
              ))}
            </div>
            <button type="button" className="ghost small" onClick={() => select(i + 1)} aria-label="Sito successivo">→</button>
          </div>
        </div>

        <div className="ss-about" aria-live="polite">
          <h3 style={{ color: LIGHT[s.key] }}>{s.name}</h3>
          <h4>A cosa serve</h4>
          <p>{d.serve}</p>
          <h4>Cosa puoi fare</h4>
          <ul>{d.fare.map((b) => <li key={b}>{b}</li>)}</ul>
          <h4>Per chi è</h4>
          <p>{d.per}</p>
        </div>
      </div>

      <div className="ss-earn">
        <section className="ss-card">
          <h4>Come può guadagnare un utente</h4>
          <p>{d.utente}</p>
        </section>
        <section className="ss-card ss-partner">
          <h4>Come puoi guadagnare tu, partner</h4>
          <p>Porti le persone con il tuo link personale: ricevi il {PCT}% sul netto di ogni acquisto che fanno su {s.name}. Il compenso matura dopo 30 giorni e viene pagato ogni mese, dai 50 €.</p>
          <p className="ss-exh">Esempi con i pacchetti del sito</p>
          <ul className="ss-ex">
            {ESEMPI[s.key].map((e) => (
              <li key={e.nome}>
                <span className="n">{e.nome}{e.dettaglio ? <small>{e.dettaglio}</small> : null}</span>
                <span className="p">{eur(e.prezzo)}</span>
                <span className="g">tu guadagni circa <b>{eur(gain(e.prezzo))}</b></span>
              </li>
            ))}
          </ul>
          <p className="ss-small">Il {PCT}% è calcolato sul netto, cioè dopo le commissioni di pagamento: per questo l&apos;importo è un po&apos; sotto il {PCT}% del prezzo. Per 12 mesi vale ogni acquisto fatto da chi hai portato tu.</p>
          <p className="ss-small">Stime e possibilità non sono una promessa di guadagno: i risultati dipendono dal tuo impegno.</p>
        </section>
      </div>
    </div>
  );
}

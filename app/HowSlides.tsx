"use client";

import { useEffect, useRef, useState } from "react";

const SLIDES = [
  { t: "Entri nel tuo pannello", d: "Ricevi un indirizzo privato e una password. Dentro trovi i tuoi link, i media e i compensi, con una visita guidata che spiega ogni numero." },
  { t: "Copi i link e i post", d: "Per ogni sito ci sono immagini, video e testi già pronti. Un clic e copi il testo con il tuo link personale già inserito." },
  { t: "Pubblichi sui social", d: "Incolli il testo nella descrizione, aggiungi l'immagine o il video e pubblichi dove hai già il tuo pubblico." },
  { t: "Arrivano i primi guadagni", d: "Chi apre il tuo link e compra viene collegato a te. Vedi click, email e compensi in tempo reale, e il 15% matura dopo 30 giorni." },
];
const MS = 7000;

function useCount(to: number, run: boolean, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) { setV(0); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (n: number) => { const p = Math.min((n - t0) / ms, 1); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run, ms]);
  return v;
}

function Login() {
  return (
    <div className="hs-scene hs-login" aria-hidden="true">
      <div className="hs-win">
        <div className="hs-bar"><i /><i /><i /><span>programma-partner.vercel.app/p/…</span></div>
        <div className="hs-body">
          <div className="hs-lock">
            <b>Area riservata</b>
            <div className="hs-field"><span className="hs-dots"><u /><u /><u /><u /><u /><u /><u /><u /></span></div>
            <div className="hs-btn">Entra</div>
          </div>
          <div className="hs-panel-in">
            <b>Ciao Marta 👋</b>
            <div className="hs-chips"><span style={{ ["--c" as string]: "#0f766e" }}>Scrittore Site</span><span style={{ ["--c" as string]: "#ea580c" }}>Liberamente</span><span style={{ ["--c" as string]: "#7c3aed" }}>BOOST AI</span></div>
            <div className="hs-lines"><u /><u /><u /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Copy() {
  return (
    <div className="hs-scene hs-copy" aria-hidden="true">
      <div className="hs-card">
        <div className="hs-thumb"><span>Immagine</span></div>
        <div className="hs-text">
          <p>📚 Hai un&apos;idea per un libro? Scrivilo con l&apos;AI, passo dopo passo.</p>
          <p className="hs-link">programma-partner…/go/<b>marta</b>/seo</p>
        </div>
        <div className="hs-row">
          <span className="hs-btn ghost">Scarica</span>
          <span className="hs-btn press"><em className="a">Copia testo con il mio link</em><em className="b">✓ Copiato</em></span>
        </div>
      </div>
      <div className="hs-cursor" />
    </div>
  );
}

function Post() {
  return (
    <div className="hs-scene hs-post" aria-hidden="true">
      <div className="hs-phone">
        <div className="hs-compose">
          <div className="hs-caption"><span>Hai un&apos;idea per un libro? Scrivilo con l&apos;AI.</span><span className="l"> programma-partner…/go/marta/seo</span></div>
          <div className="hs-thumb sm" />
          <div className="hs-btn pub">Pubblica</div>
        </div>
        <div className="hs-posted">
          <div className="hs-who"><i /> <b>marta.scrive</b></div>
          <div className="hs-thumb big" />
          <div className="hs-react"><span>♥ 128</span><span>💬 14</span><span className="n">+3 nuovi click</span></div>
        </div>
      </div>
      <div className="hs-nets"><span>Facebook</span><span>Instagram</span><span>YouTube</span><span>TikTok</span></div>
    </div>
  );
}

function Earn({ on }: { on: boolean }) {
  const clicks = useCount(48, on), mails = useCount(19, on), sales = useCount(4, on), eur = useCount(22.88, on);
  const bars = [18, 26, 22, 38, 34, 52, 64];
  return (
    <div className="hs-scene hs-earn" aria-hidden="true">
      <div className="hs-stats">
        <div><span>Click</span><b>{Math.round(clicks)}</b></div>
        <div><span>Email</span><b>{Math.round(mails)}</b></div>
        <div><span>Vendite</span><b>{Math.round(sales)}</b></div>
        <div className="gain"><span>Compenso</span><b>{eur.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</b></div>
      </div>
      <div className="hs-chart">{bars.map((h, i) => <i key={i} style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }} />)}</div>
      <p className="hs-note">Esempio illustrativo: 4 vendite da 39 €, 15% sul netto.</p>
    </div>
  );
}

export default function HowSlides() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  useEffect(() => {
    if (!playing || hold || reduced) return;
    timer.current = setTimeout(() => setI((x) => (x + 1) % SLIDES.length), MS);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [i, playing, hold, reduced]);

  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);
  const running = playing && !hold && !reduced;

  return (
    <section className="hs" aria-roledescription="carousel" aria-label="Come funziona, passo passo"
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); }}>
      <div className="hs-stage" key={i}>
        {i === 0 && <Login />}
        {i === 1 && <Copy />}
        {i === 2 && <Post />}
        {i === 3 && <Earn on />}
      </div>
      <div className="hs-info">
        <p className="hs-step">Passo {i + 1} di {SLIDES.length}</p>
        <h3>{SLIDES[i].t}</h3>
        <p aria-live={running ? "off" : "polite"}>{SLIDES[i].d}</p>
        <div className="hs-ctl">
          <button type="button" className="ghost small" onClick={() => go(i - 1)} aria-label="Passo precedente">←</button>
          <div className="hs-dotsnav" role="tablist" aria-label="Passi">
            {SLIDES.map((s, n) => (
              <button key={s.t} type="button" role="tab" aria-selected={n === i} aria-label={`Passo ${n + 1}: ${s.t}`} className={n === i ? "on" : ""} onClick={() => go(n)}>
                {n === i && <i key={`${i}-${running}`} className={running ? "run" : ""} />}
              </button>
            ))}
          </div>
          <button type="button" className="ghost small" onClick={() => go(i + 1)} aria-label="Passo successivo">→</button>
          {!reduced && <button type="button" className="ghost small" onClick={() => setPlaying((p) => !p)}>{playing ? "Pausa" : "Riprendi"}</button>}
        </div>
      </div>
    </section>
  );
}

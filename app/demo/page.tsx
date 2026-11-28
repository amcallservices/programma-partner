import { SITES, TIPS } from "@/lib/sites";
import { PANEL, SIMPLE } from "@/lib/i18n";
import { SITE_URL } from "@/lib/siteUrl";
import ShareCards from "../ShareCards";
import ThreeSteps from "../ThreeSteps";
import Brand from "../Brand";

export const metadata = {
  title: "Pagina partner di prova",
  description: "Guarda com'è fatta la pagina personale di un partner, con dati di esempio.",
  robots: { index: false, follow: true },
};

const gain = (price: number) => Math.floor(Math.max(price - (price * 0.015 + 0.25), 0) * 15) / 100;
const eur = (n: number) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });

const SALES = [
  { d: "18/11/2026", mail: "g***@gmail.com", what: "Scrittore Site, pacchetto Creator", price: 25, st: "in attesa" },
  { d: "09/11/2026", mail: "m***@libero.it", what: "Compagnia di Scrittura, Libro Completo", price: 39.99, st: "maturata" },
  { d: "27/10/2026", mail: "a***@gmail.com", what: "BOOST AI, 380 crediti", price: 24.9, st: "pagata" },
  { d: "12/10/2026", mail: "s***@outlook.it", what: "Self Publishing Italia, consulenza 30 minuti", price: 20, st: "pagata" },
] as const;

export default function Demo() {
  const T = PANEL.it;
  const S = SIMPLE.it;
  const items = SITES.map((s) => ({ key: s.key, name: s.name, color: s.color, url: `${SITE_URL}/go/tuo-nome/${s.key}`, note: "Esempio: il tuo link vero avrà il tuo nome" }));
  const cents = (st: string) => Math.round(SALES.filter((x) => x.st === st).reduce((a, x) => a + gain(x.price), 0) * 100);

  return (
    <div className="wrap">
      <div className="demo-bar" role="note">
        <b>Pagina di prova.</b> Questi sono dati di esempio: serve solo per vedere com&apos;è fatta la pagina personale di un partner.
        <a className="btn small" href="/">Torna alla home</a>
      </div>

      <div className="helpbar">
        <h1>Ciao Maria, ecco la tua pagina</h1>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <Brand />
        </div>
      </div>

      <section className="welcome-hl">
        <b>{T.welcomeSlogan}</b>
        <p>{T.welcomeText}</p>
      </section>

      <ThreeSteps title={S.stepsTitle} steps={S.steps} />
      <ShareCards
        items={items}
        labels={{ title: S.linksTitle, sub: S.linksSub, warn: S.warn, copy: S.copy, copied: S.copied, share: S.share, shareOn: S.shareOn, msg: S.msg }}
        tour={false}
      />

      <div className="grid" style={{ marginTop: 18 }}>
        <div className="card stat" style={{ ["--stat" as string]: "var(--lib)", margin: 0 }}><span>{T.stats.pending}</span><b>{eur(cents("in attesa") / 100)}</b><small>{T.stats.pendingNote}</small></div>
        <div className="card stat" style={{ ["--stat" as string]: "var(--seo)", margin: 0 }}><span>{T.stats.vested}</span><b>{eur(cents("maturata") / 100)}</b><small>{T.stats.vestedNote}</small></div>
        <div className="card stat" style={{ ["--stat" as string]: "var(--soft)", margin: 0 }}><span>{T.stats.paid}</span><b>{eur(cents("pagata") / 100)}</b></div>
        <div className="card stat" style={{ ["--stat" as string]: "var(--boost)", margin: 0 }}><span>{T.stats.sales}</span><b>{SALES.length}</b></div>
      </div>

      <h2 className="sections-title">{S.sectionsTitle}</h2>
      <details className="psec">
        <summary>{T.mediaTitle}</summary>
        <p className="muted" style={{ margin: "0 20px 12px" }}>{T.mediaIntro}</p>
      </details>
      <details className="psec" open>
        <summary>{T.tipsTitle}</summary>
        <p className="muted" style={{ margin: "0 0 12px" }}>{T.tipsIntro}</p>
        <div className="tips">
          {SITES.slice(0, 3).map((s) => (
            <details className="tip" key={s.key} style={{ ["--c" as string]: s.color }}>
              <summary><i />{s.name}</summary>
              <div className="tip-body">
                <p><b>{T.tipsFor}:</b> {TIPS.it[s.key].who}</p>
                <ul>{TIPS.it[s.key].ideas.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            </details>
          ))}
        </div>
      </details>
      <details className="psec">
        <summary>{T.salesTitle}</summary>
        <div className="scroll">
          <table>
            <thead><tr>{T.salesCols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {SALES.map((x) => (
                <tr key={x.d + x.mail}>
                  <td>{x.d}</td><td>{x.mail}</td><td>{x.what}</td><td>{eur(gain(x.price))}</td>
                  <td><span className={`pill ${x.st === "in attesa" ? "attesa" : x.st}`}>{T.statusLabel[x.st]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p style={{ margin: "26px 0 6px", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a className="btn cta" href={`https://wa.me/393282693777?text=${encodeURIComponent("Ti scrivo dal sito partner, voglio collaborare.")}`} target="_blank" rel="noopener noreferrer">Scrivici per iniziare</a>
        <a className="btn ghost" href="/">Torna alla home</a>
      </p>
    </div>
  );
}

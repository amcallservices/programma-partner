import SiteSlider from "./SiteSlider";
import Simulator from "./Simulator";
import Glow from "./Glow";
import HowSlides from "./HowSlides";
import Brand from "./Brand";
import { SITE_URL } from "@/lib/siteUrl";
import { SITES } from "@/lib/sites";

const FAQ: [string, string][] = [
  ["Cosa devo fare per iniziare?", "Scrivici: fissiamo una call in cui ti spieghiamo come funziona tutto, rispondiamo alle tue domande e, se vuoi iniziare, ti diamo accesso al tuo pannello personale con i link da condividere."],
  ["Perché il compenso matura dopo 30 giorni?", "È il tempo in cui un cliente può chiedere il rimborso. Se non c'è rimborso, il compenso diventa pagabile; se c'è, viene ridotto o annullato in proporzione."],
  ["E se un cliente compra con un'email diversa?", "Scrivici: controlliamo a mano e, se è una tua segnalazione, assegniamo la vendita al tuo pannello."],
  ["Come mi pagate?", "Una volta al mese, con bonifico sull'IBAN che inserisci nel tuo profilo, quando il maturato raggiunge i 20 €. Sotto quella cifra l'importo si accumula."],
  ["Posso vedere cosa ho guadagnato?", "Sì. Nel tuo pannello vedi click, email raccolte, vendite e compensi in tempo reale, con gli stati in attesa, maturato e pagato."],
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "Programma partner - Ecosistema Self Publishing", url: SITE_URL, logo: `${SITE_URL}/logo-mark.svg` },
    { "@type": "WebSite", "@id": `${SITE_URL}/#site`, url: SITE_URL, name: "Programma partner", inLanguage: "it-IT", publisher: { "@id": `${SITE_URL}/#org` } },
    {
      "@type": "WebPage", "@id": `${SITE_URL}/#page`, url: SITE_URL, isPartOf: { "@id": `${SITE_URL}/#site` }, inLanguage: "it-IT",
      name: "Programma partner: guadagna il 15% portando utenti ai siti Self Publishing",
      about: SITES.map((x) => ({ "@type": "WebSite", name: x.name, url: x.url })),
    },
    {
      "@type": "Service", name: "Programma di affiliazione dell'ecosistema Self Publishing", serviceType: "Programma di affiliazione", provider: { "@id": `${SITE_URL}/#org` }, areaServed: "IT",
      description: "Il partner condivide un link personale per ciascuno dei sei siti e riceve il 15% sul netto di ogni acquisto. Il compenso matura dopo 30 giorni e viene pagato ogni mese con bonifico dai 20 €.",
    },
    { "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ],
};

const HERO: Record<string, { h: string; lead: string }> = {
  a: { h: "Condividi un link. Guadagni il 15% su ogni vendita.", lead: "Ricevi un link personale per ciascuno dei nostri 6 siti. Chi lo apre e poi acquista è una tua vendita, e il compenso è tuo." },
  b: { h: "Fai conoscere i nostri siti. Noi ti paghiamo ogni vendita.", lead: "Scrittura, self publishing e marketing con l'AI: 6 siti italiani da promuovere con il tuo link personale, sui social, nei forum e nei gruppi." },
  c: { h: "Diventa partner: il 15% di ogni vendita è tuo.", lead: "Promuovi i nostri 6 siti con il tuo link personale. Più lo pubblichi dove ci sono persone interessate, più vendite si collegano a te." },
};
const VANTAGGI = ["Nessun investimento e nessun acquisto obbligatorio", "Orari liberi: pubblichi quando vuoi", "Immagini, video e testi già pronti", "Pannello personale con link e guadagni in tempo reale", "Pagamento mensile con bonifico, da 20 €"];

export default function Home({ searchParams }: { searchParams?: { v?: string } }) {
  const hv = HERO[(searchParams?.v ?? "a").toLowerCase()] ?? HERO.a;
  return (
    <div className="wrap">
      <Glow />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <header className="hero-home" data-glow>
        <div>
          <Brand />
          <h1>{hv.h}</h1>
          <p className="lead" style={{ marginTop: 18 }}>{hv.lead}</p>
          <ul className="hero-ticks">
            {VANTAGGI.map((t) => (<li key={t}>{t}</li>))}
          </ul>
          <p style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn cta" href={`https://wa.me/393282693777?text=${encodeURIComponent("Ti scrivo dal sito partner, voglio collaborare.")}`} target="_blank" rel="noopener noreferrer">Scrivici per iniziare</a>
            <a className="btn ghost" href="/demo">Guarda una pagina partner di prova</a>
            <a className="btn ghost" href="#calcolo">Calcola quanto puoi guadagnare</a>
          </p>
        </div>
        <SiteSlider />
      </header>

      <section className="promo-hl" id="promuovi" aria-labelledby="promuovi-t">
        <h2 id="promuovi-t">Guadagni solo se promuovi il tuo link personale</h2>
        <p>
          Il link è tuo e lo diffondi tu, dove ci sono persone interessate. Più lo pubblichi, più persone arrivano e più acquisti si
          collegano a te.
        </p>
        <ul className="chips" aria-label="Dove pubblicare il tuo link">
          {["Facebook", "Instagram", "TikTok", "YouTube", "Gruppi e pagine", "Forum", "WhatsApp e Telegram", "Blog e newsletter", "Commenti e community"].map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="promo-sub">Ti diamo anche immagini, video e testi già pronti: li scarichi dal tuo pannello e li pubblichi con il tuo link.</p>
        <p style={{ margin: "16px 0 0", display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn cta" href="/demo">Guarda una pagina partner di prova</a>
        </p>
      </section>

      <h2 id="come">Come funziona</h2>
      <div className="steps">
        <div className="card" data-glow><h3>Ricevi il tuo pannello</h3><p className="muted" style={{ marginTop: 6 }}>Ti inviamo un indirizzo privato con i tuoi sei link e un tour guidato che spiega ogni numero.</p></div>
        <div className="card" data-glow><h3>Pubblica i link</h3><p className="muted" style={{ marginTop: 6 }}>Sui social, nei forum e nei gruppi. Chi li apre lascia la sua email e viene portato subito sul sito scelto.</p></div>
        <div className="card" data-glow><h3>Le vendite si collegano a te</h3><p className="muted" style={{ marginTop: 6 }}>Riconosciamo l&apos;acquisto dall&apos;email. Vale il primo partner che ha segnalato quella persona, per 12 mesi.</p></div>
        <div className="card" data-glow><h3>Ricevi il compenso</h3><p className="muted" style={{ marginTop: 6 }}>Il 15% sul netto incassato, maturato dopo 30 giorni e pagato ogni mese dai 20 €.</p></div>
      </div>

      <h2 id="guarda">Guarda come funziona, passo passo</h2>
      <HowSlides />

      <h2 id="calcolo">Quanto puoi guadagnare</h2>
      <div className="card" data-glow><Simulator /></div>

      <h2>Domande frequenti</h2>
      {FAQ.map(([q, a]) => (
        <details className="faq" key={q}><summary>{q}</summary><p>{a}</p></details>
      ))}

      <p className="foot">
        Programma partner dell&apos;ecosistema Self Publishing
      </p>
    </div>
  );
}

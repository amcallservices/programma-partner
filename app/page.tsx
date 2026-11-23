import Link from "next/link";
import Shelf from "./Shelf";
import Simulator from "./Simulator";
import Glow from "./Glow";
import HowSlides from "./HowSlides";

const MAIL = "amcall.services@gmail.com";

export default function Home() {
  return (
    <div className="wrap">
      <Glow />
      <header className="hero-home" data-glow>
        <div>
          <h1>Porta nuovi utenti ai nostri siti e guadagna.</h1>
          <p className="lead" style={{ marginTop: 18 }}>
            Ricevi un link personale per ciascun sito. Quando una persona arriva dal tuo link e acquista, il compenso è tuo. Non
            serve modificare nessun sito e non ci sono codici sconto da gestire.
          </p>
          <p style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn cta" href={`https://wa.me/393282693777?text=${encodeURIComponent("Ti scrivo dal sito partner, voglio collaborare.")}`} target="_blank" rel="noopener noreferrer">Scrivici per iniziare</a>
            <a className="btn ghost" href="#calcolo">Calcola quanto puoi guadagnare</a>
          </p>
        </div>
        <Shelf />
      </header>

      <h2 id="come">Come funziona</h2>
      <div className="steps">
        <div className="card" data-glow><h3>Ricevi il tuo pannello</h3><p className="muted" style={{ marginTop: 6 }}>Ti inviamo un indirizzo privato con i tuoi cinque link e un tour guidato che spiega ogni numero.</p></div>
        <div className="card" data-glow><h3>Condividi i link</h3><p className="muted" style={{ marginTop: 6 }}>Chi li apre lascia la sua email e viene portato subito sul sito scelto.</p></div>
        <div className="card" data-glow><h3>Le vendite si collegano a te</h3><p className="muted" style={{ marginTop: 6 }}>Riconosciamo l&apos;acquisto dall&apos;email. Vale il primo partner che ha segnalato quella persona, per 12 mesi.</p></div>
        <div className="card" data-glow><h3>Ricevi il compenso</h3><p className="muted" style={{ marginTop: 6 }}>Il 15% sul netto incassato, maturato dopo 30 giorni e pagato ogni mese dai 50 €.</p></div>
      </div>

      <h2 id="guarda">Guarda come funziona, passo passo</h2>
      <HowSlides />

      <h2 id="calcolo">Quanto puoi guadagnare</h2>
      <div className="card" data-glow><Simulator /></div>

      <h2>Domande frequenti</h2>
      <details className="faq"><summary>Cosa devo fare per iniziare?</summary><p>Scrivici: fissiamo una call in cui ti spieghiamo come funziona tutto, rispondiamo alle tue domande e, se vuoi iniziare, ti diamo accesso al tuo pannello personale con i link da condividere.</p></details>
      <details className="faq"><summary>Perché il compenso matura dopo 30 giorni?</summary><p>È il tempo in cui un cliente può chiedere il rimborso. Se non c&apos;è rimborso, il compenso diventa pagabile; se c&apos;è, viene ridotto o annullato in proporzione.</p></details>
      <details className="faq"><summary>E se un cliente compra con un&apos;email diversa?</summary><p>Scrivici: controlliamo a mano e, se è una tua segnalazione, assegniamo la vendita al tuo pannello.</p></details>
      <details className="faq"><summary>Come mi pagate?</summary><p>Una volta al mese, con bonifico sull&apos;IBAN che inserisci nel tuo profilo, quando il maturato raggiunge i 50 €. Sotto quella cifra l&apos;importo si accumula.</p></details>
      <details className="faq"><summary>Posso vedere cosa ho guadagnato?</summary><p>Sì. Nel tuo pannello vedi click, email raccolte, vendite e compensi in tempo reale, con gli stati in attesa, maturato e pagato.</p></details>

      <p className="foot">
        Programma partner dell&apos;ecosistema Self Publishing · <a href={`mailto:${MAIL}`}>{MAIL}</a> · <Link href="/privacy">Privacy</Link>
      </p>
    </div>
  );
}

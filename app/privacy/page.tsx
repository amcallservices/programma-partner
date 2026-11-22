import { cookies } from "next/headers";
import { pickLang } from "@/lib/i18n";
import LangSwitch from "../LangSwitch";

export default function Privacy({ searchParams }: { searchParams: { lang?: string } }) {
  const lang = pickLang(searchParams.lang, cookies().get("pp-lang")?.value);
  const owner = process.env.OWNER_NAME || "Antonino Stramera, via della Cooperazione 5, 52021 Bucine (AR)";
  const contact = process.env.OWNER_CONTACT || "amcall.services@gmail.com";
  if (lang === "en") {
    return (
      <div className="wrap narrow">
        <div style={{ textAlign: "right" }}><LangSwitch lang={lang} label="Language" /></div>
        <h1>Privacy notice</h1>
        <p className="muted">Draft: have it reviewed by an adviser before publication.</p>
        <h2>Controller</h2>
        <p>{owner} - contact: {contact}</p>
        <h2>What data and why</h2>
        <p>
          We collect the name (optional) and email you enter on the entry page. We use them only to know which partner
          recommended the site to you and, if you buy, to credit that partner with the agreed fee. We do not use this data
          to send you commercial communications.
        </p>
        <h2>Legal basis and retention</h2>
        <p>Consent (art. 6.1.a GDPR). We keep the data for 12 months from collection, the period in which a purchase can be attributed to the partner.</p>
        <h2>Who receives it</h2>
        <p>
          The partner who recommended the site sees your email only in partly hidden form (even if you have not bought) and sees whether a purchase is attributed to them.
          Data is processed on hosting and database services (Vercel, Supabase) and compared with payments recorded on Stripe.
        </p>
        <h2>Your rights</h2>
        <p>You can ask for access, correction, deletion or withdrawal of consent by writing to the contact above.</p>
      </div>
    );
  }
  return (
    <div className="wrap narrow">
      <div style={{ textAlign: "right" }}><LangSwitch lang={lang} label="Lingua" /></div>
      <h1>Informativa privacy</h1>
      <p className="muted">Bozza da far verificare da un consulente prima della pubblicazione.</p>
      <h2>Titolare</h2>
      <p>{owner} - contatto: {contact}</p>
      <h2>Quali dati e perché</h2>
      <p>
        Raccogliamo nome (facoltativo) ed email che inserisci nella pagina d'ingresso. Li usiamo solo per sapere quale
        partner ti ha segnalato il sito e, se acquisti, per riconoscere a quel partner il compenso previsto. Non usiamo questi
        dati per inviarti comunicazioni commerciali.
      </p>
      <h2>Base giuridica e conservazione</h2>
      <p>Consenso (art. 6.1.a GDPR). Conserviamo i dati per 12 mesi dalla raccolta, il periodo in cui un acquisto può essere attribuito al partner.</p>
      <h2>A chi sono comunicati</h2>
      <p>
        Il partner che ti ha segnalato vede la tua email solo in forma parziale (anche se non hai acquistato) e vede se un acquisto gli è attribuito. I dati sono
        trattati su servizi di hosting e database (Vercel, Supabase) e confrontati con i pagamenti registrati su Stripe.
      </p>
      <h2>I tuoi diritti</h2>
      <p>Puoi chiedere accesso, rettifica, cancellazione o revoca del consenso scrivendo al contatto indicato sopra.</p>
    </div>
  );
}

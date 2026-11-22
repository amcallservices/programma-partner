export default function Privacy() {
  const owner = process.env.OWNER_NAME || "[Titolare del trattamento - da completare]";
  const contact = process.env.OWNER_CONTACT || "[email di contatto - da completare]";
  return (
    <div className="wrap narrow">
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
        Il partner che ti ha segnalato vede solo che un acquisto è attribuito a lui, con l'email in forma parziale. I dati sono
        trattati su servizi di hosting e database (Vercel, Supabase) e confrontati con i pagamenti registrati su Stripe.
      </p>
      <h2>I tuoi diritti</h2>
      <p>Puoi chiedere accesso, rettifica, cancellazione o revoca del consenso scrivendo al contatto indicato sopra.</p>
    </div>
  );
}

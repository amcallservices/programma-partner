export type Lang = "it" | "en";

export function pickLang(param?: string, cookie?: string): Lang {
  const v = (param || cookie || "").toLowerCase();
  return v === "en" ? "en" : "it";
}

export function money(cents: number, currency = "eur", lang: Lang = "it"): string {
  return new Intl.NumberFormat(lang === "en" ? "en-GB" : "it-IT", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function dateFmt(d: string | Date, lang: Lang): string {
  return new Date(d).toLocaleDateString(lang === "en" ? "en-GB" : "it-IT");
}

export type TourStep = { target: string; title: string; text: string };

export type PanelText = {
  hello: (name: string) => string;
  intro: (pct: number) => string;
  tour: string;
  stats: { pending: string; pendingNote: string; vested: string; vestedNote: string; paid: string; sales: string };
  links: string;
  clicksEmails: (c: number, e: number) => string;
  copy: string;
  copied: string;
  howTitle: string;
  howText: string;
  contactsTitle: string;
  contactsIntro: string;
  contactsCols: string[];
  contactsEmpty: string;
  contactsBought: { yes: string; no: string };
  salesTitle: string;
  salesCols: string[];
  salesEmpty: string;
  payoutsTitle: string;
  payoutsCols: string[];
  payoutsEmpty: string;
  payoutStatus: (status: string, date: string | null) => string;
  statusLabel: Record<string, string>;
  langLabel: string;
  tourUi: { next: string; back: string; skip: string; close: string; of: string };
  steps: TourStep[];
};

export const PANEL: Record<Lang, PanelText> = {
  it: {
    hello: (n) => `Ciao ${n}`,
    intro: (p) =>
      `Il tuo compenso è del ${p}% su ogni vendita generata dai clienti che arrivano dai tuoi link. Matura 30 giorni dopo la vendita, se non c'è rimborso.`,
    tour: "Visita guidata",
    stats: { pending: "In attesa", pendingNote: "maturano entro 30 giorni", vested: "Maturato da pagare", vestedNote: "lo paghiamo a fine mese", paid: "Già pagato", sales: "Vendite" },
    links: "I tuoi link",
    clicksEmails: (c, e) => `${c} click · ${e} email`,
    copy: "Copia",
    copied: "Copiato",
    howTitle: "Come colleghiamo le vendite a te",
    howText:
      "Chi apre il tuo link lascia la sua email e viene portato sul sito. Quando acquista con quella email, la vendita compare qui sotto. Se un cliente usa un'email diversa, scrivici e controlliamo a mano.",
    contactsTitle: "Contatti registrati",
    contactsIntro: "Tutte le persone che hanno lasciato l'email dai tuoi link, anche se non hanno ancora acquistato. Usale solo per questo programma: non inviare comunicazioni commerciali non richieste.",
    contactsCols: ["Data", "Sito", "Email", "Ha acquistato"],
    contactsEmpty: "Ancora nessuna email registrata.",
    contactsBought: { yes: "sì", no: "non ancora" },
    salesTitle: "Vendite attribuite",
    salesCols: ["Data", "Cliente", "Descrizione", "Compenso", "Stato"],
    salesEmpty: "Ancora nessuna vendita.",
    payoutsTitle: "Pagamenti ricevuti",
    payoutsCols: ["Periodo", "Importo", "Stato"],
    payoutsEmpty: "Nessun pagamento ancora.",
    payoutStatus: (s, d) => `${s === "pagato" ? "pagato" : "da pagare"}${d ? ` il ${d}` : ""}`,
    statusLabel: { "in attesa": "in attesa", maturata: "maturata", pagata: "pagata", annullata: "annullata", "non attribuita": "non attribuita" },
    langLabel: "Lingua",
    tourUi: { next: "Avanti", back: "Indietro", skip: "Salta", close: "Chiudi", of: "{a} di {b}" },
    steps: [
      { target: "", title: "Benvenuto nel tuo pannello", text: "In due minuti ti mostro dove vedere i tuoi guadagni e dove trovare i link da condividere. Puoi rivedere questa visita quando vuoi dal pulsante in alto." },
      { target: "stats", title: "I tuoi compensi", text: "«In attesa» è il compenso delle vendite recenti: matura dopo 30 giorni senza rimborso. «Maturato» è quello che ti dobbiamo pagare. «Già pagato» è quello che hai ricevuto." },
      { target: "links", title: "I tuoi link personali", text: "Uno per ogni sito. Copiali con un clic e usali nei tuoi video, post e messaggi. Chi li apre viene riconosciuto come una tua segnalazione." },
      { target: "how", title: "Come colleghiamo le vendite a te", text: "Chi apre il tuo link lascia la sua email, poi viene portato sul sito. Quando acquista con la stessa email, la vendita compare qui. Vale il primo partner che ha segnalato la persona, per 12 mesi." },
      { target: "contacts", title: "Le email registrate", text: "Qui vedi chi ha lasciato l'email dai tuoi link, anche se non ha ancora acquistato. Se poi acquista con la stessa email, la vendita compare tra le vendite attribuite." },
      { target: "sales", title: "Le vendite attribuite", text: "Ogni riga è una vendita arrivata da te, con il compenso e lo stato. Le email dei clienti vanno usate solo per questo programma." },
      { target: "payouts", title: "I pagamenti", text: "Una volta al mese chiudiamo i conti e paghiamo il maturato, dai 50 € in su. Qui trovi ogni pagamento con la data." },
      { target: "", title: "Hai finito", text: "Se un cliente compra con un'email diversa da quella lasciata nel link, scrivici: controlliamo e assegniamo la vendita a mano. Buon lavoro!" },
    ],
  },
  en: {
    hello: (n) => `Hello ${n}`,
    intro: (p) =>
      `You earn ${p}% on every sale generated by customers who arrive through your links. The fee vests 30 days after the sale, if there is no refund.`,
    tour: "Guided tour",
    stats: { pending: "Pending", pendingNote: "vests within 30 days", vested: "Vested, to be paid", vestedNote: "we pay it at month end", paid: "Already paid", sales: "Sales" },
    links: "Your links",
    clicksEmails: (c, e) => `${c} clicks · ${e} emails`,
    copy: "Copy",
    copied: "Copied",
    howTitle: "How sales are linked to you",
    howText:
      "Anyone who opens your link leaves their email and is taken to the website. When they buy with that email, the sale appears below. If a customer uses a different email, write to us and we will check it by hand.",
    contactsTitle: "Registered contacts",
    contactsIntro: "Everyone who left their email through your links, even if they have not bought yet. Use them only for this programme: do not send unsolicited commercial messages.",
    contactsCols: ["Date", "Site", "Email", "Has bought"],
    contactsEmpty: "No emails registered yet.",
    contactsBought: { yes: "yes", no: "not yet" },
    salesTitle: "Attributed sales",
    salesCols: ["Date", "Customer", "Description", "Fee", "Status"],
    salesEmpty: "No sales yet.",
    payoutsTitle: "Payments received",
    payoutsCols: ["Period", "Amount", "Status"],
    payoutsEmpty: "No payments yet.",
    payoutStatus: (s, d) => `${s === "pagato" ? "paid" : "to be paid"}${d ? ` on ${d}` : ""}`,
    statusLabel: { "in attesa": "pending", maturata: "vested", pagata: "paid", annullata: "cancelled", "non attribuita": "not attributed" },
    langLabel: "Language",
    tourUi: { next: "Next", back: "Back", skip: "Skip", close: "Close", of: "{a} of {b}" },
    steps: [
      { target: "", title: "Welcome to your dashboard", text: "In two minutes I'll show you where to see your earnings and where to find the links to share. You can replay this tour any time from the button at the top." },
      { target: "stats", title: "Your earnings", text: "\"Pending\" is the fee on recent sales: it vests after 30 days without a refund. \"Vested\" is what we owe you. \"Already paid\" is what you have received." },
      { target: "links", title: "Your personal links", text: "One for each website. Copy them with one click and use them in your videos, posts and messages. Anyone who opens them is recognised as your referral." },
      { target: "how", title: "How sales are linked to you", text: "Anyone who opens your link leaves their email, then is taken to the website. When they buy with the same email, the sale shows up here. The first partner who referred the person wins, for 12 months." },
      { target: "contacts", title: "Registered emails", text: "Here you see who left their email through your links, even if they have not bought yet. If they later buy with the same email, the sale appears in your attributed sales." },
      { target: "sales", title: "Attributed sales", text: "Each row is a sale that came through you, with its fee and status. Customer emails must be used only for this programme." },
      { target: "payouts", title: "Payments", text: "Once a month we close the accounts and pay what has vested, from €50 upwards. Here you find every payment with its date." },
      { target: "", title: "You're all set", text: "If a customer buys with a different email from the one left on the link, write to us: we'll check and assign the sale by hand. Good luck!" },
    ],
  },
};

export const LANDING = {
  it: {
    langLabel: "Lingua",
    continueTo: (n: string) => `Continua verso ${n}`,
    intro: "Inserisci la tua email: ci serve solo per riconoscere chi ti ha segnalato il sito. Poi ti portiamo subito sul sito. Usa la stessa email quando ti iscrivi o acquisti.",
    name: "Nome (facoltativo)",
    email: "Email",
    consent: "Acconsento al trattamento di nome ed email per attribuire la segnalazione a chi mi ha inviato il sito, che potrà vedere la mia email. Leggi l'",
    privacy: "informativa privacy",
    errEmail: "Inserisci un indirizzo email valido.",
    errConsent: "Per continuare serve il consenso.",
    go: (n: string) => `Vai a ${n}`,
    flowLabel: "Cosa succede ora",
    flow: ["Lasci la tua email", "Arrivi sul sito"],
    note: "In questo passaggio non paghi nulla.",
  },
  en: {
    langLabel: "Language",
    continueTo: (n: string) => `Continue to ${n}`,
    intro: "Enter your email: we only need it to know who recommended the site to you. Then we take you straight to the site. Use the same email when you sign up or buy.",
    name: "Name (optional)",
    email: "Email",
    consent: "I agree to the processing of my name and email to credit the referral to the person who sent me the site, who will be able to see my email. Read the ",
    privacy: "privacy notice",
    errEmail: "Enter a valid email address.",
    errConsent: "Your consent is required to continue.",
    go: (n: string) => `Go to ${n}`,
    flowLabel: "What happens next",
    flow: ["You leave your email", "You reach the site"],
    note: "There is nothing to pay at this step.",
  },
};

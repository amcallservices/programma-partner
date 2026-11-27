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
  mediaTitle: string;
  mediaIntro: string;
  mediaEmpty: string;
  mediaDownload: string;
  mediaCopyText: string;
  mediaCopyLink: string;
  mediaTextOnly: string;
  mediaRead: string;
  mediaClose: string;
  mediaShare: string;
  mediaSharing: string;
  mediaShareCopied: string;
  mediaShareDesktop: string;
  mediaShareOn: string;
  tipsTitle: string;
  tipsIntro: string;
  linksNote: string;
  tipsFor: string;
  tipsLink: string;
  tipsOpen: string;
  tipsWarn: string;
  welcomeSlogan: string;
  welcomeText: string;
  waLabel: string;
  waMsg: (name: string) => string;
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
    mediaTitle: "I media per la promozione",
    mediaIntro: "Immagini, video e testi pronti per promuovere ogni sito. Scarica il file e copia il testo: il tuo link personale è già dentro. Nelle immagini e nei video il link non può stare: incollalo nella descrizione del post.",
    mediaEmpty: "Ancora nessun contenuto per questo sito.",
    mediaDownload: "Scarica",
    mediaCopyText: "Copia testo con il mio link",
    mediaCopyLink: "Copia il mio link",
    mediaTextOnly: "Testo",
    mediaRead: "Descrizione del post",
    mediaClose: "Chiudi",
    mediaShare: "Condividi",
    mediaSharing: "Preparo il file…",
    mediaShareCopied: "Ho copiato il testo con il tuo link: incollalo come didascalia.",
    mediaShareDesktop: "File scaricato e testo copiato: ora aprilo sul social e incolla il testo come didascalia.",
    mediaShareOn: "Oppure condividi su",
    tipsTitle: "Come attirare nuovi utenti",
    tipsIntro: "Qualche idea pratica per ogni sito: a chi parlare e cosa dire. Scegli quelle che senti tue e usa sempre il tuo link.",
    linksNote: "Guadagni solo con questi link, non usarne altri (salvo quelli dei post creati da noi, in quanto sono già incorporati).",
    tipsFor: "Per chi",
    tipsLink: "Sito ufficiale",
    tipsOpen: "Visita",
    tipsWarn: "⚠️ Serve solo per visitare il sito e capire cosa promuovi. Non copiarlo e non condividerlo: non possiamo tracciarlo e non guadagneresti nulla. Condividi sempre i tuoi link personali.",
    welcomeSlogan: "Dalla prima pagina al primo cliente: porta chi scrive e chi fa impresa, e cresciamo insieme.",
    welcomeText: "Fai parte della nostra squadra. Con Scrittore Site, Liberamente e la community aiuti chi vuole scrivere e pubblicare un libro; con BOOST AI porti il marketing automatizzato a professionisti e attività imprenditoriali. Puoi promuovere tutto: noi siamo qui per aiutarti in ogni passo.",
    waLabel: "Scrivimi su WhatsApp",
    waMsg: (n) => `Sono un partner, mi chiamo ${n}.`,
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
      { target: "profile", title: "Il tuo profilo e i dati per i pagamenti", text: "Qui sopra trovi il pulsante «Profilo». Compilalo con nome, cognome, IBAN, banca di riferimento, cellulare e indirizzo: servono solo per pagarti i compensi.\n🔒 Sono dati sensibili: li vede solo l'amministratore del programma e la tua pagina è protetta dalla password che ti abbiamo dato. Non darla a nessuno.\n✅ L'IBAN deve essere intestato a te. Senza il profilo completo non possiamo effettuare i pagamenti." },
      { target: "wa", title: "Scrivimi su WhatsApp", text: "Per qualsiasi dubbio o chiarimento puoi scrivermi da qui: il pulsante apre la chat WhatsApp con un messaggio già pronto, con il tuo nome. Rispondo io di persona." },
      { target: "links", title: "I tuoi link personali: qui copi e condividi", text: "✅ Questi sono gli UNICI link con cui guadagni: uno per ogni sito. Copiali con un clic e usali nei tuoi video, post e messaggi. Chi li apre viene riconosciuto come una tua segnalazione.\n✅ Vanno bene anche i link dentro ai post che creiamo noi: sono già incorporati.\n⚠️ Non usare nessun altro link, nemmeno l'indirizzo diretto del sito: senza il tuo link non possiamo tracciare la vendita e non guadagni." },
      { target: "stats", title: "I tuoi compensi", text: "«In attesa» è il compenso delle vendite recenti: matura dopo 30 giorni senza rimborso. «Maturato» è quello che ti dobbiamo pagare. «Già pagato» è quello che hai ricevuto." },
      { target: "how", title: "Come colleghiamo le vendite a te", text: "Questo riquadro blu spiega la regola più importante: chi apre il tuo link lascia la sua email, poi viene portato sul sito. Quando acquista con la stessa email, la vendita compare qui sotto. Vale il primo partner che ha segnalato la persona, per 12 mesi. Se un cliente usa un'email diversa, scrivici e controlliamo a mano." },
      { target: "media", title: "I media per la promozione", text: "Immagini, video e testi pronti, divisi per sito e nella lingua che hai scelto. Clicca una miniatura per ingrandirla: da lì scarichi il file e copi la descrizione del post, con il tuo link già dentro. Nelle immagini e nei video il link non può stare: incollalo nella descrizione quando pubblichi. Con «Condividi» dal telefono apri direttamente Instagram, Facebook, TikTok o WhatsApp con file e testo già pronti." },
      { target: "tips", title: "Come attirare nuovi utenti", text: "Per ogni sito trovi a chi parlare e qualche idea pratica su cosa dire. Apri le tendine una alla volta. Per BOOST AI c'è anche l'idea di proporlo a chi vende prodotti, fisici o digitali come libri, ebook e corsi, oltre che alle attività imprenditoriali. Sono suggerimenti: scegli quelli più adatti a te.\n⚠️ Dentro le tendine trovi anche il link ufficiale di ogni sito: serve solo per visitarlo e capire cosa promuovi. NON copiarlo e NON condividerlo, perché non possiamo tracciarlo e non guadagneresti. Condividi sempre i tuoi link personali." },
      { target: "contacts", title: "Le email registrate", text: "Qui vedi chi ha lasciato l'email dai tuoi link, anche se non ha ancora acquistato. Se poi acquista con la stessa email, la vendita compare tra le vendite attribuite." },
      { target: "sales", title: "Le vendite attribuite", text: "Ogni riga è una vendita arrivata da te, con il compenso e lo stato. Le email dei clienti vanno usate solo per questo programma." },
      { target: "payouts", title: "I pagamenti", text: "Una volta al mese chiudiamo i conti e paghiamo il maturato, dai 20 € in su. Qui trovi ogni pagamento con la data." },
      { target: "", title: "Hai finito", text: "Se un cliente compra con un'email diversa da quella lasciata nel link, o hai qualsiasi altro dubbio, scrivimi su WhatsApp: controlliamo e ti rispondo. Buon lavoro!" },
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
    mediaTitle: "Promotional media",
    mediaIntro: "Images, videos and texts ready to promote each site. Download the file and copy the text: your personal link is already in it. A link cannot be placed inside images or videos: paste it in the post caption.",
    mediaEmpty: "No content for this site yet.",
    mediaDownload: "Download",
    mediaCopyText: "Copy text with my link",
    mediaCopyLink: "Copy my link",
    mediaTextOnly: "Text",
    mediaRead: "Post description",
    mediaClose: "Close",
    mediaShare: "Share",
    mediaSharing: "Preparing the file…",
    mediaShareCopied: "I copied the text with your link: paste it as the caption.",
    mediaShareDesktop: "File downloaded and text copied: now open it on the social network and paste the text as the caption.",
    mediaShareOn: "Or share on",
    tipsTitle: "How to attract new users",
    tipsIntro: "A few practical ideas for each site: who to talk to and what to say. Pick the ones that feel right and always use your link.",
    linksNote: "You earn only with these links, do not use any others (except those in the posts we created, since they are already built in).",
    tipsFor: "For whom",
    tipsLink: "Official site",
    tipsOpen: "Visit",
    tipsWarn: "⚠️ It is only for visiting the site and understanding what you promote. Do not copy or share it: we cannot track it and you would earn nothing. Always share your personal links.",
    welcomeSlogan: "From the first page to the first customer: bring those who write and those who run a business, and we grow together.",
    welcomeText: "You are part of our team. With Scrittore Site, Liberamente and the community you help people write and publish a book; with BOOST AI you bring automated marketing to professionals and businesses. You can promote it all: we are here to help you every step of the way.",
    waLabel: "Message me on WhatsApp",
    waMsg: (n) => `I am a partner, my name is ${n}.`,
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
      { target: "profile", title: "Your profile and payment details", text: "Above you find the «Profile» button. Fill it in with first name, last name, IBAN, bank, mobile phone and address: they are used only to pay your fees.\n🔒 These are sensitive details: only the programme administrator can see them, and your page is protected by the password we gave you. Do not share it.\n✅ The IBAN must be in your name. Without a complete profile we cannot make payments." },
      { target: "wa", title: "Message me on WhatsApp", text: "For any question or clarification you can write to me from here: the button opens a WhatsApp chat with a ready message that includes your name. I reply personally." },
      { target: "links", title: "Your personal links", text: "✅ These are the ONLY links you earn with: one for each website. Copy them with one click and use them in your videos, posts and messages. Anyone who opens them is recognised as your referral.\n✅ The links inside the posts we create are fine too: they are already built in.\n⚠️ Do not use any other link, not even the direct address of the site: without your link we cannot track the sale and you earn nothing." },
      { target: "stats", title: "Your earnings", text: "\"Pending\" is the fee on recent sales: it vests after 30 days without a refund. \"Vested\" is what we owe you. \"Already paid\" is what you have received." },
      { target: "how", title: "How sales are linked to you", text: "This blue box explains the key rule: anyone who opens your link leaves their email, then is taken to the website. When they buy with the same email, the sale shows up below. The first partner who referred the person wins, for 12 months. If a customer uses a different email, write to us and we check by hand." },
      { target: "media", title: "Promotional media", text: "Ready-made images, videos and texts, split by site and shown in the language you chose. Click a thumbnail to enlarge it: from there you download the file and copy the post description, with your link already inside. A link cannot sit inside images or videos: paste it in the caption when you publish. With “Share” on your phone you open Instagram, Facebook, TikTok or WhatsApp directly, with the file and text ready." },
      { target: "tips", title: "How to attract new users", text: "For each site you find who to talk to and a few practical ideas on what to say. Open the dropdowns one at a time. For BOOST AI there is also the idea of proposing it to anyone selling products, physical or digital such as books, ebooks and courses, besides businesses. They are suggestions: pick what suits you.\n⚠️ Inside the dropdowns you also find the official link of each site: it is only for visiting it and understanding what you promote. Do NOT copy it and do NOT share it, because we cannot track it and you would earn nothing. Always share your personal links." },
      { target: "contacts", title: "Registered emails", text: "Here you see who left their email through your links, even if they have not bought yet. If they later buy with the same email, the sale appears in your attributed sales." },
      { target: "sales", title: "Attributed sales", text: "Each row is a sale that came through you, with its fee and status. Customer emails must be used only for this programme." },
      { target: "payouts", title: "Payments", text: "Once a month we close the accounts and pay what has vested, from €20 upwards. Here you find every payment with its date." },
      { target: "", title: "You're all set", text: "If a customer buys with a different email from the one left on the link, or you have any other question, message me on WhatsApp: we'll check and reply. Good luck!" },
    ],
  },
};

export const LANDING = {
  it: {
    langLabel: "Lingua",
    continueTo: (n: string) => `Continua verso ${n}`,
    short: "Inserisci la tua email per continuare.",
    intro: "Inserisci la tua email: ci serve solo per riconoscere chi ti ha segnalato il sito. Poi ti portiamo subito sul sito. Usa la stessa email quando ti iscrivi o acquisti.",
    name: "Nome (facoltativo)",
    email: "Email",
    consent: "Acconsento al trattamento di nome ed email per attribuire la segnalazione a chi mi ha inviato il sito, che potrà vedere la mia email. Leggi l'",
    privacy: "informativa privacy",
    errEmail: "Inserisci un indirizzo email valido.",
    errConsent: "Per continuare serve il consenso.",
    errSave: "Non siamo riusciti a registrare la tua email. Riprova tra un momento.",
    why: "Ci vuole un attimo: serve solo per riconoscere chi ti ha segnalato il sito.",
    go: (n: string) => `Vai a ${n}`,
    flowLabel: "Cosa succede ora",
    flow: ["Lasci la tua email", "Arrivi sul sito"],
    note: "In questo passaggio non paghi nulla.",
  },
  en: {
    langLabel: "Language",
    continueTo: (n: string) => `Continue to ${n}`,
    short: "Enter your email to continue.",
    intro: "Enter your email: we only need it to know who recommended the site to you. Then we take you straight to the site. Use the same email when you sign up or buy.",
    name: "Name (optional)",
    email: "Email",
    consent: "I agree to the processing of my name and email to credit the referral to the person who sent me the site, who will be able to see my email. Read the ",
    privacy: "privacy notice",
    errEmail: "Enter a valid email address.",
    errConsent: "Your consent is required to continue.",
    errSave: "We could not save your email. Please try again in a moment.",
    why: "It only takes a moment: we use it just to know who recommended the site to you.",
    go: (n: string) => `Go to ${n}`,
    flowLabel: "What happens next",
    flow: ["You leave your email", "You reach the site"],
    note: "There is nothing to pay at this step.",
  },
};

export const LOCK = {
  it: {
    title: "Area riservata",
    intro: "Inserisci la password che ti abbiamo comunicato per aprire il tuo pannello.",
    label: "Password",
    go: "Entra",
    err: "Password non corretta.",
    locked: "Troppi tentativi. Riprova tra 5 minuti.",
    nopw: "Il tuo accesso non è ancora attivo: scrivici su WhatsApp e ti comunichiamo la password.",
    wa: "Scrivici su WhatsApp",
    waMsg: "Sono un partner e non riesco ad accedere al mio pannello.",
    home: "Vai alla home del programma partner",
  },
  en: {
    title: "Private area",
    intro: "Enter the password we gave you to open your dashboard.",
    label: "Password",
    go: "Enter",
    err: "Wrong password.",
    locked: "Too many attempts. Try again in 5 minutes.",
    nopw: "Your access is not active yet: message us on WhatsApp and we will send you the password.",
    wa: "Message us on WhatsApp",
    waMsg: "I am a partner and cannot access my dashboard.",
    home: "Go to the partner programme home",
  },
};

export const PROFILE = {
  it: {
    button: "Profilo",
    logout: "Esci",
    title: "Il tuo profilo",
    intro: "Questi dati servono solo per pagarti i compensi. Li vede solo l'amministratore del programma e sono dietro la tua password.",
    back: "← Torna al pannello",
    first: "Nome", last: "Cognome", iban: "IBAN", bank: "Banca di riferimento", phone: "Cellulare", address: "Indirizzo",
    ibanHelp: "Il conto deve essere intestato a te.",
    addressHelp: "Via, numero civico, CAP, città e provincia.",
    save: "Salva i dati",
    saved: "Dati salvati.",
    errors: { missing: "Compila tutti i campi.", iban: "L'IBAN non è valido: controllalo e riprova.", phone: "Il numero di cellulare non è valido.", save: "Salvataggio non riuscito, riprova." } as Record<string, string>,
    bannerTitle: "Completa il tuo profilo",
    bannerText: "Inserisci nome, cognome, IBAN, banca, cellulare e indirizzo: senza questi dati non possiamo pagarti i compensi.",
    bannerGo: "Compila il profilo",
    updated: "Ultimo aggiornamento",
  },
  en: {
    button: "Profile",
    logout: "Log out",
    title: "Your profile",
    intro: "This data is used only to pay your fees. Only the programme administrator can see it, and it sits behind your password.",
    back: "← Back to dashboard",
    first: "First name", last: "Last name", iban: "IBAN", bank: "Bank", phone: "Mobile phone", address: "Address",
    ibanHelp: "The account must be in your name.",
    addressHelp: "Street, number, postcode, city and province.",
    save: "Save details",
    saved: "Details saved.",
    errors: { missing: "Fill in all fields.", iban: "The IBAN is not valid: check it and try again.", phone: "The mobile number is not valid.", save: "Could not save, please try again." } as Record<string, string>,
    bannerTitle: "Complete your profile",
    bannerText: "Enter first name, last name, IBAN, bank, mobile phone and address: without them we cannot pay your fees.",
    bannerGo: "Fill in your profile",
    updated: "Last updated",
  },
};

/** Testi del pannello semplificato: 3 passi e link da condividere. */
export const SIMPLE = {
  it: {
    stepsTitle: "Come guadagnare, in 3 passi",
    steps: [
      { t: "Copia il tuo link", d: "Qui sotto c'è un link personale per ogni sito. Copialo con un clic." },
      { t: "Pubblicalo dove ti seguono", d: "Sui social (Facebook, Instagram, TikTok, YouTube), nei gruppi e nei forum, sul blog, in WhatsApp e Telegram. Sotto trovi immagini, video e testi già pronti." },
      { t: "Guadagni il 15%", d: "Su ogni acquisto di chi arriva dal tuo link. Pagamento ogni mese con bonifico, dai 20 €." },
    ],
    linksTitle: "I tuoi link personali: copiali e pubblicali",
    linksSub: "Sono questi i link che ti fanno guadagnare. Pubblicali sui social, nei forum, nei gruppi e nei tuoi contenuti: chi passa da qui viene collegato a te.",
    warn: "Non usare gli indirizzi ufficiali dei siti: senza il tuo link non possiamo sapere che l'acquisto arriva da te.",
    copy: "Copia il link",
    copied: "Link copiato",
    share: "Condividi",
    shareOn: "Condividi su",
    msg: "Dai un'occhiata a",
    sectionsTitle: "Altro che ti serve",
    open: "Apri",
  },
  en: {
    stepsTitle: "How to earn, in 3 steps",
    steps: [
      { t: "Copy your link", d: "Below you find a personal link for each site. Copy it with one click." },
      { t: "Publish it where people follow you", d: "On social media (Facebook, Instagram, TikTok, YouTube), in groups and forums, on your blog, in WhatsApp and Telegram. Below you find ready-made images, videos and texts." },
      { t: "You earn 15%", d: "On every purchase made by people who come from your link. Paid every month by bank transfer, from €20." },
    ],
    linksTitle: "Your personal links: copy and publish them",
    linksSub: "These are the links that make you earn. Publish them on social media, in forums, in groups and in your content: whoever comes through them is linked to you.",
    warn: "Do not use the official addresses of the sites: without your link we cannot know the purchase comes from you.",
    copy: "Copy link",
    copied: "Link copied",
    share: "Share",
    shareOn: "Share on",
    msg: "Have a look at",
    sectionsTitle: "More you may need",
    open: "Open",
  },
};

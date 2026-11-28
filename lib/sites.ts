export type Site = {
  key: string;
  name: string;
  url: string;
  color: string;
  headline: string;
  pitch: string;
  bullets: string[];
};

export const SITES: Site[] = [
  {
    key: "seo",
    name: "Scrittore Site",
    url: "https://scrittore.site",
    color: "#0f766e",
    headline: "Scrivi il tuo libro con l'AI",
    pitch: "Un ambiente guidato che ti accompagna dall'idea al manoscritto, fino all'esportazione in Word o PDF. Non servono prompt complessi.",
    bullets: ["50 crediti gratuiti per provare", "Indice, stesura e revisione guidate", "Pensato per chi pubblica su Amazon KDP"],
  },
  {
    key: "soft",
    name: "Scrittore Site Software",
    url: "https://scrittoresite.streamlit.app/",
    color: "#2563eb",
    headline: "Il software per scrivere libri con l'AI",
    pitch: "Chat guidata, indice, fonti, stesura e controlli di revisione: tutto in un unico posto, con un preventivo in crediti prima di ogni operazione.",
    bullets: ["Paghi solo i crediti che usi", "Esportazione in Word o PDF", "Controllo originalità e checklist KDP"],
  },
  {
    key: "lib",
    name: "Liberamente",
    url: "https://liberamente.site",
    color: "#ea580c",
    headline: "Lo store di ebook degli autori indipendenti",
    pitch: "Scopri, acquista e leggi ebook di autori italiani indipendenti, oppure pubblica e vendi il tuo libro con il 50% di royalty.",
    bullets: ["Compri una volta, resta nella tua libreria", "Royalty del 50% per gli autori", "Italiano e inglese"],
  },
  {
    key: "com",
    name: "Self Publishing Italia",
    url: "https://selfpublishingitalia.site",
    color: "#1b1464",
    headline: "La community degli scrittori italiani",
    pitch: "Impara l'autopubblicazione, confrontati con altri autori, segui video corsi e webinar e prenota consulenze con autori esperti.",
    bullets: ["Community, messaggi e Stories", "Video corsi ed eventi", "Consulenze in videochiamata"],
  },
  {
    key: "boost",
    name: "BOOST AI",
    url: "https://boost-ai-two.vercel.app",
    color: "#7c3aed",
    headline: "Marketing automatico con 10 agenti AI",
    pitch: "Crea immagini, caroselli e video e pubblicali sui social, senza abbonamento: paghi solo a crediti.",
    bullets: ["Facebook, Instagram, YouTube e TikTok", "Approvazione manuale o pilota automatico", "Crediti di prova gratuiti"],
  },
  {
    key: "cds",
    name: "Compagnia di Scrittura",
    url: "https://compagniadiscrittura.site",
    color: "#1f2937",
    headline: "Hai un libro dentro di te: lo scriviamo noi",
    pitch: "Un servizio di ghostwriting: racconti l'idea o la storia e ricevi il tuo ebook di 150 pagine, con copertina e revisione se li scegli.",
    bullets: ["Ebook di 150 pagine scritto per te", "Copertina e revisione facoltative", "Da 19,99 €, senza scrivere una riga"],
  },
];

export function getSite(key: string): Site | undefined {
  return SITES.find((s) => s.key === key);
}

export const SITE_EN: Record<string, { headline: string; pitch: string; bullets: string[] }> = {
  seo: {
    headline: "Write your book with AI",
    pitch: "A guided environment that takes you from the idea to the manuscript, up to export in Word or PDF. No complex prompts needed.",
    bullets: ["50 free credits to try it", "Guided outline, drafting and revision", "Made for people who publish on Amazon KDP"],
  },
  soft: {
    headline: "The software to write books with AI",
    pitch: "Guided chat, outline, sources, drafting and revision checks: everything in one place, with a credit quote before every operation.",
    bullets: ["Pay only for the credits you use", "Export to Word or PDF", "Originality check and KDP checklist"],
  },
  lib: {
    headline: "The ebook store of independent authors",
    pitch: "Discover, buy and read ebooks by independent Italian authors, or publish and sell your own book with a 50% royalty.",
    bullets: ["Buy once, it stays in your library", "50% royalty for authors", "Italian and English"],
  },
  com: {
    headline: "The community of Italian writers",
    pitch: "Learn self-publishing, talk with other authors, follow video courses and webinars and book consultations with expert authors.",
    bullets: ["Community, messages and Stories", "Video courses and events", "Video-call consultations"],
  },
  boost: {
    headline: "Automatic marketing with 10 AI agents",
    pitch: "Create images, carousels and videos and publish them on social media, with no subscription: you only pay with credits.",
    bullets: ["Facebook, Instagram, YouTube and TikTok", "Manual approval or autopilot", "Free trial credits"],
  },
  cds: {
    headline: "You have a book inside you: we write it for you",
    pitch: "A ghostwriting service: you tell us the idea or the story and you get your 150-page ebook, with cover and revision if you choose them.",
    bullets: ["150-page ebook written for you", "Cover and revision optional", "From €19.99, without writing a line"],
  },
};

/** Suggerimenti per i partner: come attirare nuovi utenti, sito per sito. */
export const TIPS: Record<"it" | "en", Record<string, { who: string; ideas: string[] }>> = {
  it: {
    seo: {
      who: "Chi sogna di scrivere un libro e non sa da dove cominciare.",
      ideas: [
        "Racconta il problema, non lo strumento: «Hai un'idea ma non riesci a metterla in pagina?» funziona meglio di una lista di funzioni.",
        "Fai un breve video mentre usi i 50 crediti gratuiti: indice, prima pagina, esportazione. Mostrare vale più che spiegare.",
        "Parlane nei gruppi Facebook e nelle community di scrittura e autopubblicazione, rispondendo a chi chiede come iniziare.",
      ],
    },
    soft: {
      who: "Autori che pubblicano già su Amazon KDP e vogliono scrivere più in fretta.",
      ideas: [
        "Punta sul risparmio di tempo: indice, stesura e revisione in un unico posto, con il preventivo in crediti prima di ogni operazione.",
        "Parla del controllo originalità e della checklist KDP a chi ha paura di errori in pubblicazione.",
        "Confronta il «prima e dopo»: quante settimane servivano per un manoscritto e quanto ci vuole adesso.",
      ],
    },
    lib: {
      who: "Lettori di autori indipendenti e autori che vogliono vendere il proprio ebook.",
      ideas: [
        "Agli autori parla della royalty del 50%: è il numero che attira di più. Mostra un esempio con il prezzo di un ebook.",
        "Ai lettori consiglia un ebook alla volta, con una breve recensione e il tuo link: una storia convince più di un catalogo.",
        "Condividi nelle pagine e nei gruppi dedicati ai libri italiani e agli autori emergenti.",
      ],
    },
    com: {
      who: "Scrittori che vogliono imparare l'autopubblicazione e confrontarsi con altri autori.",
      ideas: [
        "Invita a un evento o a un webinar: è un motivo concreto per iscriversi oggi e non «prima o poi».",
        "Presenta la community come un posto dove fare domande a chi ci è già passato, con consulenze in videochiamata.",
        "Condividi un consiglio utile di autopubblicazione e chiudi con il link: dai valore prima di chiedere un'iscrizione.",
      ],
    },
    boost: {
      who: "Professionisti, piccole imprese e attività che vogliono fare marketing sui social senza un'agenzia.",
      ideas: [
        "Parla a chi ha un'attività: un post al giorno senza dedicarci ore, con immagini, caroselli e video creati dall'AI.",
        "Sottolinea che non c'è abbonamento: si pagano solo i crediti usati, e quelli di prova sono gratuiti.",
        "Contatta direttamente negozi, studi professionali, ristoranti e artigiani che conosci: un messaggio personale vale più di un annuncio.",
        "Suggeriscilo anche a chi vende prodotti, fisici o digitali: libri, ebook, corsi, artigianato. BOOST AI crea le immagini, i caroselli e i video per promuoverli sui social.",
      ],
    },
  },
  en: {
    seo: {
      who: "People who dream of writing a book and don't know where to start.",
      ideas: [
        "Talk about the problem, not the tool: \"Got an idea but can't get it on the page?\" works better than a feature list.",
        "Record a short video while using the 50 free credits: outline, first page, export. Showing beats explaining.",
        "Mention it in Facebook groups and writing and self-publishing communities, answering people who ask how to begin.",
      ],
    },
    soft: {
      who: "Authors who already publish on Amazon KDP and want to write faster.",
      ideas: [
        "Focus on time saved: outline, drafting and revision in one place, with a credit quote before every operation.",
        "Mention the originality check and the KDP checklist to people worried about publishing mistakes.",
        "Show the before and after: how many weeks a manuscript used to take and how long it takes now.",
      ],
    },
    lib: {
      who: "Readers of independent authors and authors who want to sell their own ebook.",
      ideas: [
        "To authors, talk about the 50% royalty: it is the number that attracts most. Show an example with an ebook price.",
        "To readers, recommend one ebook at a time, with a short review and your link: one story convinces more than a catalogue.",
        "Share in pages and groups about Italian books and emerging authors.",
      ],
    },
    com: {
      who: "Writers who want to learn self-publishing and exchange with other authors.",
      ideas: [
        "Invite people to an event or webinar: it is a concrete reason to sign up today, not \"sometime\".",
        "Present the community as a place to ask questions to people who have been there, with video-call consultations.",
        "Share a useful self-publishing tip and end with the link: give value before asking for a sign-up.",
      ],
    },
    boost: {
      who: "Professionals, small businesses and shops that want social media marketing without an agency.",
      ideas: [
        "Speak to business owners: a post a day without spending hours, with images, carousels and videos made by AI.",
        "Stress that there is no subscription: you only pay for the credits you use, and trial credits are free.",
        "Contact shops, professional studios, restaurants and craftspeople you know directly: a personal message beats an ad.",
        "Suggest it also to anyone selling products, physical or digital: books, ebooks, courses, crafts. BOOST AI creates the images, carousels and videos to promote them on social media.",
      ],
    },
  },
};

/** Descrizione estesa per la home: a cosa serve, cosa si può fare, per chi è. */
export const DETAIL: Record<string, { serve: string; fare: string[]; per: string; utente: string }> = {
  seo: {
    serve: "Ti guida a scrivere un libro con l'aiuto dell'AI, dall'idea al manoscritto, senza bisogno di saper scrivere prompt.",
    fare: ["Sviluppare l'idea in una chat guidata", "Costruire l'indice e scrivere capitolo dopo capitolo", "Rivedere il testo ed esportarlo in Word o PDF", "Provare tutto con 50 crediti gratuiti"],
    per: "Chi sogna di scrivere un libro e non sa da dove cominciare, e chi pubblica su Amazon KDP.",
    utente: "Pubblicando il libro che scrive, per esempio su Amazon KDP, l'utente può guadagnare dalle sue vendite. Più libri riesce a scrivere, più possibilità ha.",
  },
  soft: {
    serve: "È il software completo per scrivere libri con l'AI: tutto in un unico posto, con il preventivo in crediti prima di ogni operazione.",
    fare: ["Lavorare con chat guidata, indice, fonti e stesura", "Fare controlli di revisione e di originalità", "Seguire la checklist per la pubblicazione su KDP", "Esportare in Word o PDF e pagare solo i crediti usati"],
    per: "Autori che vogliono più controllo sul proprio lavoro e preferiscono pagare solo quello che usano.",
    utente: "Scrivendo e pubblicando più libri in meno tempo, l'utente può far crescere le sue entrate da autore, pagando solo i crediti che usa.",
  },
  lib: {
    serve: "È lo store italiano di ebook di autori indipendenti: si legge e si acquista, ma si può anche pubblicare e vendere il proprio libro.",
    fare: ["Scoprire e comprare ebook, che restano nella tua libreria", "Leggere gli ebook acquistati", "Pubblicare e vendere il tuo libro con il 50% di royalty", "Usare il sito in italiano e in inglese"],
    per: "Lettori curiosi di nuovi autori italiani e autori indipendenti che vogliono vendere i propri libri.",
    utente: "Se è autore, l'utente vende i suoi ebook e tiene il 50% di royalty su ogni copia. Se è lettore, compra una volta e il libro resta suo.",
  },
  com: {
    serve: "È la community degli scrittori italiani: un posto per imparare l'autopubblicazione e confrontarsi con chi ci è già passato.",
    fare: ["Parlare con altri autori tra messaggi e Stories", "Seguire video corsi, eventi e webinar", "Prenotare consulenze in videochiamata con autori esperti"],
    per: "Scrittori italiani, esordienti o già pubblicati, che vogliono crescere insieme ad altri.",
    utente: "Imparando a pubblicare e a promuovere meglio i propri libri, l'utente può aumentare le vendite, con l'aiuto di corsi, community e consulenze.",
  },
  boost: {
    serve: "Fa il marketing sui social al posto tuo con 10 agenti AI, senza abbonamento: si paga solo a crediti.",
    fare: ["Creare immagini, caroselli e video", "Pubblicare su Facebook, Instagram, YouTube e TikTok", "Approvare ogni contenuto a mano o lasciarlo in pilota automatico", "Promuovere prodotti fisici o digitali, come libri, ebook e corsi"],
    per: "Professionisti, piccole imprese e attività, autori e chiunque venda prodotti e voglia farsi conoscere online.",
    utente: "L'utente fa conoscere la propria attività o i propri prodotti sui social con meno tempo e meno costi, e attira più clienti.",
  },
};

/** Pacchetti e prezzi pubblici dei siti, usati negli esempi di compenso (verificati sulle pagine dei siti il 28/11/2026). */
export const ESEMPI: Record<string, { nome: string; dettaglio?: string; prezzo: number }[]> = {
  seo: [
    { nome: "Base", dettaglio: "150 crediti", prezzo: 10 },
    { nome: "Creator", dettaglio: "375 crediti", prezzo: 25 },
    { nome: "Studio", dettaglio: "750 crediti", prezzo: 50 },
    { nome: "Professionale", dettaglio: "1.500 crediti", prezzo: 100 },
  ],
  soft: [
    { nome: "Base", dettaglio: "150 crediti", prezzo: 10 },
    { nome: "Creator", dettaglio: "375 crediti", prezzo: 25 },
    { nome: "Studio", dettaglio: "750 crediti", prezzo: 50 },
    { nome: "Professionale", dettaglio: "1.500 crediti", prezzo: 100 },
  ],
  lib: [
    { nome: "Un ebook", dettaglio: "esempio da 5 €", prezzo: 5 },
    { nome: "Liberamente Plus", dettaglio: "3 libri al mese", prezzo: 4.99 },
  ],
  com: [
    { nome: "Consulenza lampo", dettaglio: "30 minuti", prezzo: 20 },
    { nome: "Consulenza completa", dettaglio: "60 minuti", prezzo: 40 },
    { nome: "Consulenza approfondita", dettaglio: "90 minuti", prezzo: 60 },
  ],
  boost: [
    { nome: "Starter", dettaglio: "150 crediti", prezzo: 9.9 },
    { nome: "Crescita", dettaglio: "380 crediti", prezzo: 24.9 },
    { nome: "Pro", dettaglio: "770 crediti", prezzo: 49.9 },
    { nome: "Agenzia", dettaglio: "1.550 crediti", prezzo: 99 },
  ],
};

/* Compagnia di Scrittura (sesto sito). Prezzi dei tre pacchetti letti sul sito il 27/11/2026. */
TIPS.it.cds = {
  who: "Chi ha un'idea, una storia o un'esperienza da trasformare in libro ma non ha tempo o voglia di scriverlo.",
  ideas: [
    "Parla a chi dice «un libro lo scriverei, ma non so da dove cominciare»: qui non deve scrivere nulla, basta raccontare l'idea.",
    "Mostra la scala dei pacchetti: Solo Ebook, con copertina, oppure Libro Completo con revisione. Chi ha poco budget parte dal primo.",
    "Pensa a professionisti, coach, consulenti e artigiani che vogliono un libro per farsi conoscere: è un biglietto da visita che dura nel tempo.",
    "Condividi nei gruppi e nei forum di scrittura, di crescita personale e di imprenditoria, con una frase semplice e il tuo link.",
  ],
};
TIPS.en.cds = {
  who: "People with an idea, a story or an experience to turn into a book who do not have the time or the wish to write it.",
  ideas: [
    "Talk to people who say «I would write a book, but I don't know where to start»: here they write nothing, they just tell the idea.",
    "Show the ladder of packages: ebook only, with cover, or the Complete Book with revision. Those on a small budget can start from the first.",
    "Think of professionals, coaches, consultants and craftspeople who want a book to get known: it is a business card that lasts.",
    "Share it in writing, personal growth and entrepreneurship groups and forums, with one simple sentence and your link.",
  ],
};
DETAIL.cds = {
  serve: "È un servizio di ghostwriting di ebook: la persona racconta l'idea e il libro lo scrive la Compagnia di Scrittura.",
  fare: ["Ricevere un ebook di 150 pagine", "Aggiungere la copertina", "Aggiungere anche la revisione", "Inviare le istruzioni dettagliate su WhatsApp dopo l'acquisto"],
  per: "Chi ha un'idea o una storia da trasformare in libro ma non vuole o non può scriverla da sé.",
  utente: "L'utente ottiene il suo libro senza scriverlo: lo può pubblicare, usarlo per farsi conoscere o regalarlo, da 19,99 €.",
};
ESEMPI.cds = [
  { nome: "Solo Ebook", dettaglio: "150 pagine", prezzo: 19.99 },
  { nome: "Ebook + Copertina", dettaglio: "150 pagine", prezzo: 29.99 },
  { nome: "Libro Completo", dettaglio: "con copertina e revisione", prezzo: 39.99 },
];

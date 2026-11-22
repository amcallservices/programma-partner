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
};

import "@fontsource-variable/literata";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/siteUrl";


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Programma partner: guadagna il 15% portando utenti ai siti Self Publishing", template: "%s | Programma partner" },
  description:
    "Programma di affiliazione per l'ecosistema Self Publishing: condividi il tuo link personale e ricevi il 15% sul netto di ogni acquisto su Scrittore Site, Liberamente, Self Publishing Italia, Compagnia di Scrittura e BOOST AI. Pagamento mensile con bonifico dai 20 €.",
  applicationName: "Programma partner",
  keywords: ["programma di affiliazione", "programma partner", "guadagnare con i referral", "self publishing", "scrittura libri con AI", "ebook", "marketing con AI", "Scrittore Site", "Liberamente", "BOOST AI"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "/",
    siteName: "Programma partner",
    title: "Programma partner: porta nuovi utenti ai siti Self Publishing e guadagna il 15%",
    description: "Link personale per ogni sito, compenso del 15% sul netto, pagamento mensile con bonifico dai 20 €. Nessuna modifica ai siti, nessun codice sconto.",
  },
  twitter: { card: "summary_large_image", title: "Programma partner: guadagna il 15% con i siti Self Publishing", description: "Condividi il tuo link personale e ricevi il 15% sul netto di ogni acquisto." },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = { themeColor: "#16134d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

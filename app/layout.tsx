import "@fontsource-variable/literata";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programma partner - Ecosistema Self Publishing",
  description: "Segnala i cinque siti dell'ecosistema Self Publishing e ricevi il 15% su ogni vendita.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

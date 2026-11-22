import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programma partner - Ecosistema Self Publishing",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

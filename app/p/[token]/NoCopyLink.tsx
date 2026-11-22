"use client";

/** Link cliccabile ma non copiabile: niente selezione, trascinamento o menu "copia indirizzo". Per copiarlo c'è il pulsante nella sezione dei link. */
export default function NoCopyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="nocopy"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </a>
  );
}

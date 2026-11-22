"use client";

import { useRef, useState } from "react";
import { SITES } from "@/lib/sites";

const HEIGHTS = [270, 330, 295, 345, 310];
// Su fondo scuro servono tinte più chiare: il dorso della community è blu notte, come lo sfondo.
const SPINE: Record<string, string> = { com: "#4f46c8" };
const LIGHT: Record<string, string> = { seo: "#2dd4bf", soft: "#60a5fa", lib: "#fb923c", com: "#a5a0ff", boost: "#c4b5fd" };

/** Cinque dorsi di libro, uno per sito: si clicca un dorso per leggere di cosa si tratta. */
export default function Shelf() {
  const [sel, setSel] = useState(0);
  const s = SITES[sel];
  const root = useRef<HTMLDivElement>(null);
  function pick(i: number) {
    setSel(i);
    // la luce dell'intera testata prende il colore del libro scelto
    root.current?.closest<HTMLElement>(".hero-home")?.style.setProperty("--glow", LIGHT[SITES[i].key] ?? "#7c7cff");
  }
  return (
    <div ref={root}>
      <div className="shelf" role="group" aria-label="I cinque siti dell'ecosistema">
        {SITES.map((x, i) => (
          <button
            key={x.key}
            type="button"
            className="spine"
            style={{ ["--c" as string]: SPINE[x.key] ?? x.color, height: HEIGHTS[i % HEIGHTS.length] }}
            aria-pressed={sel === i}
            onClick={() => pick(i)}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="shelfinfo" aria-live="polite">
        <h3 style={{ color: LIGHT[s.key] }}>{s.name}</h3>
        <p style={{ margin: "6px 0 0" }}>{s.pitch}</p>
        <ul>
          {s.bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
      </div>
    </div>
  );
}

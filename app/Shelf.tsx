"use client";

import { useState } from "react";
import { SITES } from "@/lib/sites";

const HEIGHTS = [270, 330, 295, 345, 310];

/** Cinque dorsi di libro, uno per sito: si clicca un dorso per leggere di cosa si tratta. */
export default function Shelf() {
  const [sel, setSel] = useState(0);
  const s = SITES[sel];
  return (
    <div>
      <div className="shelf" role="group" aria-label="I cinque siti dell'ecosistema">
        {SITES.map((x, i) => (
          <button
            key={x.key}
            type="button"
            className="spine"
            style={{ ["--c" as string]: x.color, height: HEIGHTS[i % HEIGHTS.length] }}
            aria-pressed={sel === i}
            onClick={() => setSel(i)}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="shelfinfo" aria-live="polite">
        <h3 style={{ color: s.color }}>{s.name}</h3>
        <p style={{ margin: "6px 0 0" }}>{s.pitch}</p>
        <ul>
          {s.bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
      </div>
    </div>
  );
}

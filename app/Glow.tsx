"use client";

import { useEffect } from "react";

/** Segue il puntatore sugli elementi con data-glow e ne scrive la posizione nelle variabili --mx e --my. */
export default function Glow() {
  useEffect(() => {
    function move(e: PointerEvent) {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-glow]") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, []);
  return null;
}

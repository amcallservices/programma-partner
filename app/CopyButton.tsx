"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "Copia" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement("textarea");
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }
  return (
    <button type="button" className="ghost small" onClick={copy} aria-live="polite">
      {done ? "Copiato" : label}
    </button>
  );
}

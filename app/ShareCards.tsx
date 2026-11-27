"use client";

import { useState } from "react";

export type ShareItem = { key: string; name: string; color: string; url: string; note?: string };
export type ShareLabels = { title: string; sub: string; warn: string; copy: string; copied: string; share: string; shareOn: string; msg: string };

/** I link personali del partner: grandi, con "Copia" e condivisione con un clic. */
export default function ShareCards({ items, labels, tour = true }: { items: ShareItem[]; labels: ShareLabels; tour?: boolean }) {
  const [done, setDone] = useState<string | null>(null);

  async function copy(it: ShareItem) {
    try { await navigator.clipboard.writeText(it.url); }
    catch {
      const t = document.createElement("textarea");
      t.value = it.url; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
    }
    setDone(it.key);
    setTimeout(() => setDone((d) => (d === it.key ? null : d)), 1800);
  }
  async function share(it: ShareItem) {
    const nav = navigator as Navigator & { share?: (d: { title?: string; text?: string; url?: string }) => Promise<void> };
    if (nav.share) { try { await nav.share({ title: it.name, text: `${labels.msg} ${it.name}:`, url: it.url }); return; } catch { return; } }
    copy(it);
  }
  const enc = encodeURIComponent;

  return (
    <section className="sc" {...(tour ? { "data-tour": "links" } : {})}>
      <h2>{labels.title}</h2>
      <p className="sc-sub">{labels.sub}</p>
      <div className="sc-grid">
        {items.map((it) => (
          <article className="sc-card" key={it.key} style={{ ["--c" as string]: it.color }}>
            <h3>{it.name}</h3>
            {it.note ? <p className="sc-note">{it.note}</p> : null}
            <code>{it.url}</code>
            <div className="sc-actions">
              <button type="button" className="sc-copy" onClick={() => copy(it)} aria-live="polite">{done === it.key ? labels.copied : labels.copy}</button>
              <button type="button" className="ghost small" onClick={() => share(it)}>{labels.share}</button>
            </div>
            <div className="sc-ch" aria-label={labels.shareOn}>
              <a href={`https://wa.me/?text=${enc(`${`${labels.msg} ${it.name}:`} ${it.url}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(it.url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href={`https://t.me/share/url?url=${enc(it.url)}&text=${enc(`${labels.msg} ${it.name}:`)}`} target="_blank" rel="noopener noreferrer">Telegram</a>
              <a href={`https://twitter.com/intent/tweet?url=${enc(it.url)}&text=${enc(`${labels.msg} ${it.name}:`)}`} target="_blank" rel="noopener noreferrer">X</a>
            </div>
          </article>
        ))}
      </div>
      <p className="sc-warn" role="note"><span aria-hidden="true">⚠️</span> {labels.warn}</p>
    </section>
  );
}

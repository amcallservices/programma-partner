"use client";

import { useRef, useState } from "react";
import CopyButton from "../../CopyButton";

export type GItem = {
  id: string; title: string; kind: string; fileUrl: string | null; dl: string | null;
  fileName: string | null; size: string; text: string | null; link: string;
};
type Labels = {
  download: string; copyText: string; copyLink: string; copied: string; textOnly: string; close: string; description: string;
  share: string; sharing: string; shareCopied: string; shareDesktop: string; shareOn: string;
};

export default function Gallery({ items, labels }: { items: GItem[]; labels: Labels }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [cur, setCur] = useState<GItem | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [busy, setBusy] = useState(false);

  function open(i: GItem) { setMsg(""); setCur(i); requestAnimationFrame(() => ref.current?.showModal()); }
  function onClose() { ref.current?.querySelectorAll("video").forEach((v) => v.pause()); setCur(null); }

  async function copyTxt(t: string) {
    try { await navigator.clipboard.writeText(t); }
    catch {
      const el = document.createElement("textarea");
      el.value = t; document.body.appendChild(el); el.select(); document.execCommand("copy"); el.remove();
    }
  }

  /** Condivisione assistita: sul telefono apre il menu di condivisione con file e testo; sul computer scarica il file e copia il testo. */
  async function share(i: GItem) {
    const text = i.text ?? `${i.title} ${i.link}`;
    const nav = navigator as Navigator & { canShare?: (d: object) => boolean; share?: (d: object) => Promise<void> };
    setBusy(true); setMsg(labels.sharing);
    try {
      await copyTxt(text); // alcune app ignorano il testo quando si condivide un file: così basta incollarlo
      if (nav.share && i.fileUrl) {
        const res = await fetch(i.fileUrl);
        const blob = await res.blob();
        const file = new File([blob], i.fileName ?? "media", { type: blob.type || undefined });
        if (nav.canShare?.({ files: [file] })) {
          await nav.share({ files: [file], text, title: i.title });
          setMsg(labels.shareCopied);
          return;
        }
      }
      if (nav.share && !i.fileUrl) {
        await nav.share({ text, title: i.title });
        setMsg("");
        return;
      }
      if (i.dl) {
        const a = document.createElement("a");
        a.href = i.dl; a.download = i.fileName ?? ""; document.body.appendChild(a); a.click(); a.remove();
        setMsg(labels.shareDesktop);
      } else {
        setMsg(labels.copied);
      }
    } catch (e) {
      // l'utente ha chiuso il menu di condivisione: nessun errore da mostrare
      if ((e as Error)?.name === "AbortError") setMsg(labels.shareCopied);
      else if (i.dl) { setMsg(labels.shareDesktop); }
      else setMsg(labels.copied);
    } finally { setBusy(false); }
  }

  const enc = encodeURIComponent;

  /** Pulsanti social: i link web non possono allegare file, quindi scarico l'immagine e copio il testo; poi il social si apre da solo. */
  function prep(i: GItem) {
    const text = i.text ?? `${i.title} ${i.link}`;
    void copyTxt(text);
    if (i.dl) {
      const a = document.createElement("a");
      a.href = i.dl; a.download = i.fileName ?? ""; document.body.appendChild(a); a.click(); a.remove();
    }
    setMsg(i.dl ? labels.shareDesktop : labels.shareCopied);
  }

  return (
    <>
      <div className="tgrid">
        {items.map((i) => (
          <button type="button" className="tcard" key={i.id} onClick={() => open(i)} title={i.title}>
            <span className="tthumb">
              {i.fileUrl && i.kind === "immagine" && <img src={i.fileUrl} alt="" loading="lazy" />}
              {i.fileUrl && i.kind === "video" && <><video src={`${i.fileUrl}#t=0.1`} preload="metadata" muted playsInline /><em className="tplay" aria-hidden="true" /><span className="tbadge">Video</span></>}
              {i.fileUrl && i.kind === "file" && <span className="mph">PDF</span>}
              {!i.fileUrl && <span className="mph">{labels.textOnly}</span>}
            </span>
            <span className="tname">{i.title}</span>
          </button>
        ))}
      </div>
      <dialog ref={ref} className="lightbox" onClose={onClose} onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}>
        {cur && (
          <div className="lb-in">
            <button type="button" className="lb-x ghost small" onClick={() => ref.current?.close()} aria-label={labels.close}>✕</button>
            {cur.fileUrl && cur.kind === "immagine" && <img src={cur.fileUrl} alt={cur.title} />}
            {cur.fileUrl && cur.kind === "video" && <video src={cur.fileUrl} controls autoPlay playsInline />}
            <h3>{cur.title}</h3>
            {cur.text && <><div className="lb-label">{labels.description}</div><p className="lb-text">{cur.text}</p></>}
            {cur.fileName && <div className="mmeta">{cur.fileName}{cur.size ? ` · ${cur.size}` : ""}</div>}
            <div className="mactions" style={{ padding: "12px 0 0" }}>
              {cur.dl && <a className="btn small" href={cur.dl} download={cur.fileName ?? undefined}>{labels.download}</a>}
              <CopyButton text={cur.text ?? cur.link} label={cur.text ? labels.copyText : labels.copyLink} doneLabel={labels.copied} />
              <button type="button" className="btn small share-btn" disabled={busy} onClick={() => share(cur)}>{labels.share}</button>
            </div>
            <p className="lb-msg" role="status" aria-live="polite">{msg}</p>
            <div className="sc-ch lb-ch" aria-label={labels.shareOn}>
              <span>{labels.shareOn}</span>
              <a href={`https://wa.me/?text=${enc(cur.text ?? `${cur.title} ${cur.link}`)}`} target="_blank" rel="noopener noreferrer" onClick={() => prep(cur)}>WhatsApp</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(cur.link)}`} target="_blank" rel="noopener noreferrer" onClick={() => prep(cur)}>Facebook</a>
              <a href={`https://t.me/share/url?url=${enc(cur.link)}&text=${enc(cur.title)}`} target="_blank" rel="noopener noreferrer" onClick={() => prep(cur)}>Telegram</a>
              <a href={`https://twitter.com/intent/tweet?url=${enc(cur.link)}&text=${enc(cur.title)}`} target="_blank" rel="noopener noreferrer" onClick={() => prep(cur)}>X</a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

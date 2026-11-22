"use client";

import { useRef, useState } from "react";
import CopyButton from "../../CopyButton";

export type GItem = {
  id: string; title: string; kind: string; fileUrl: string | null; dl: string | null;
  fileName: string | null; size: string; text: string | null; link: string;
};
type Labels = { download: string; copyText: string; copyLink: string; copied: string; textOnly: string; close: string; description: string };

export default function Gallery({ items, labels }: { items: GItem[]; labels: Labels }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [cur, setCur] = useState<GItem | null>(null);

  function open(i: GItem) { setCur(i); requestAnimationFrame(() => ref.current?.showModal()); }
  function onClose() { ref.current?.querySelectorAll("video").forEach((v) => v.pause()); setCur(null); }

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
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

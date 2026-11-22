"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createItem, prepareUpload } from "./actions";

type Site = { key: string; name: string };

export default function MediaForm({ sites }: { sites: Site[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function upload(url: string, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.upload.onprogress = (e) => e.lengthComputable && setPct(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Caricamento rifiutato (${xhr.status}).`)));
      xhr.onerror = () => reject(new Error("Connessione interrotta durante il caricamento."));
      const fd = new FormData();
      fd.append("cacheControl", "31536000");
      fd.append("", file);
      xhr.send(fd);
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get("file") as File | null;
    const hasFile = !!file && file.size > 0;
    setBusy(true); setMsg(null); setPct(null);
    try {
      let uploaded: { path: string; name: string; mime: string; size: number } | null = null;
      const siteKey = String(f.get("site"));
      if (hasFile) {
        const mime = file!.type || "application/octet-stream";
        const prep = await prepareUpload({ siteKey, fileName: file!.name, mime, size: file!.size });
        if ("error" in prep && prep.error) throw new Error(prep.error);
        await upload(prep.signedUrl!, file!);
        uploaded = { path: prep.path!, name: file!.name, mime, size: file!.size };
      }
      const res = await createItem({
        siteKey, lang: String(f.get("lang")), title: String(f.get("title") ?? ""), body: String(f.get("body") ?? ""), file: uploaded,
      });
      if ("error" in res && res.error) throw new Error(res.error);
      form.reset();
      setMsg({ ok: true, text: "Contenuto aggiunto." });
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Errore." });
    } finally {
      setBusy(false); setPct(null);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="card">
      <div className="row">
        <div>
          <label htmlFor="site">Sito</label>
          <select id="site" name="site" required>{sites.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}</select>
        </div>
        <div>
          <label htmlFor="lang">Lingua</label>
          <select id="lang" name="lang"><option value="it">Italiano</option><option value="en">English</option></select>
        </div>
        <div style={{ flex: 2 }}>
          <label htmlFor="title">Titolo</label>
          <input id="title" name="title" required maxLength={140} placeholder="Es. Reel di presentazione" />
        </div>
      </div>
      <label htmlFor="body">Testo (facoltativo)</label>
      <textarea id="body" name="body" rows={5} placeholder="Scrivi il testo per i social. Metti {LINK} dove vuoi il link del partner: se non lo metti, lo aggiungo io in fondo." />
      <label htmlFor="file">Immagine, video o PDF (facoltativo, fino a 500 MB)</label>
      <input id="file" name="file" type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/quicktime,video/webm,application/pdf" />
      <p style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" disabled={busy}>{busy ? (pct === null ? "Salvo…" : `Carico il file… ${pct}%`) : "Aggiungi"}</button>
        {pct !== null && <progress max={100} value={pct} style={{ width: 200 }} />}
      </p>
      {msg && <p className={`notice${msg.ok ? "" : " bad"}`} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}
    </form>
  );
}

import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { SITES } from "@/lib/sites";
import { PROMO_BUCKET, mb } from "@/lib/promo";
import Nav from "../Nav";
import DeleteMedia from "./DeleteMedia";
import MediaForm from "./MediaForm";
import { deleteItem, updateItem } from "./actions";

export const dynamic = "force-dynamic";

export default async function Media({ searchParams }: { searchParams: { ok?: string; err?: string } }) {
  requireAdmin();
  const supa = db();
  const { data } = await supa.from("promo_items").select("*").order("created_at", { ascending: false });
  const items = data ?? [];
  const url = (p: string) => supa.storage.from(PROMO_BUCKET).getPublicUrl(p).data.publicUrl;

  return (
    <>
      <Nav />
      <div className="wrap">
        <h1>Media per la promozione</h1>
        <p className="muted">Quello che carichi qui compare nel pannello di tutti i partner, nella sezione «I media per la promozione», diviso per sito. Nei testi, {"{LINK}"} diventa il link personale del partner.</p>
        {searchParams.ok && <p className="notice">Fatto: {searchParams.ok}.</p>}
        {searchParams.err && <p className="notice bad">Errore: {searchParams.err}.</p>}

        <h2>Aggiungi un contenuto</h2>
        <MediaForm sites={SITES.map((s) => ({ key: s.key, name: s.name }))} />

        {SITES.map((s) => {
          const list = items.filter((i) => i.site_key === s.key);
          return (
            <section key={s.key}>
              <h2 style={{ borderLeft: `8px solid ${s.color}`, paddingLeft: 12 }}>{s.name} <span className="muted">({list.length})</span></h2>
              {list.length === 0 && <p className="muted">Ancora nessun contenuto.</p>}
              {list.map((i) => (
                <div className="card" key={i.id}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
                    {i.file_path && i.kind === "immagine" && <img src={url(i.file_path)} alt="" width={120} height={80} style={{ objectFit: "cover", borderRadius: 6 }} />}
                    {i.file_path && i.kind === "video" && <video src={`${url(i.file_path)}#t=0.1`} width={140} height={80} preload="metadata" muted style={{ objectFit: "cover", borderRadius: 6, background: "#000" }} />}
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <b>{i.title}</b> <span className="pill">{i.lang.toUpperCase()}</span> <span className="pill">{i.kind}</span>
                      {i.file_name && <div className="muted">{i.file_name} · {mb(i.size_bytes)}</div>}
                    </div>
                    <DeleteMedia action={deleteItem} id={i.id} title={i.title} />
                  </div>
                  <details style={{ marginTop: 10 }}>
                    <summary className="muted">Modifica titolo e testo</summary>
                    <form action={updateItem}>
                      <input type="hidden" name="id" value={i.id} />
                      <label>Titolo</label><input name="title" defaultValue={i.title} required />
                      <label>Lingua</label>
                      <select name="lang" defaultValue={i.lang}><option value="it">Italiano</option><option value="en">English</option></select>
                      <label>Testo</label><textarea name="body" rows={5} defaultValue={i.body ?? ""} />
                      <p style={{ marginTop: 10 }}><button type="submit" className="small">Salva</button></p>
                    </form>
                  </details>
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </>
  );
}

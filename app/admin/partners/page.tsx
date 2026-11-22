import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { SITES } from "@/lib/sites";
import Nav from "../Nav";
import CopyButton from "../../CopyButton";
import ConfirmDelete from "../ConfirmDelete";
import { createPartner, deletePartner, togglePartner } from "../actions";

export const dynamic = "force-dynamic";

function baseUrl(): string {
  return (process.env.APP_URL || "https://TUO-DOMINIO").replace(/\/$/, "");
}

export default async function Partners({
  searchParams,
}: {
  searchParams: { err?: string; ok?: string; deleted?: string };
}) {
  requireAdmin();
  const { data: partners } = await db().from("partners").select("*").order("created_at", { ascending: false });
  const base = baseUrl();

  return (
    <>
      <Nav />
      <div className="wrap">
        <h1>Partner e link</h1>
        <p className="lead">Crea un partner, invia al partner il suo pannello privato e i link da usare nei suoi contenuti.</p>
        {searchParams.ok && <p className="notice">Partner creato.</p>}
        {searchParams.deleted && <p className="notice">Partner «{searchParams.deleted}» eliminato.</p>}
        {searchParams.err && <p className="notice bad">{searchParams.err}</p>}

        <form action={createPartner} className="card row">
          <div><label htmlFor="name">Nome partner</label><input id="name" name="name" required /></div>
          <div><label htmlFor="email">Email (facoltativa)</label><input id="email" name="email" type="email" /></div>
          <div><label htmlFor="pct">Compenso %</label><input id="pct" name="pct" defaultValue="10" inputMode="decimal" /></div>
          <div className="auto"><button type="submit">Crea partner</button></div>
        </form>

        {(partners ?? []).map((p) => {
          const panel = `${base}/p/${p.token}`;
          return (
            <div className="card" key={p.id}>
              <div className="row" style={{ alignItems: "center" }}>
                <div>
                  <h3 style={{ display: "inline" }}>{p.name}</h3>{" "}
                  <span className={`pill ${p.active ? "pagata" : "off"}`}>{p.active ? "attivo" : "disattivo"}</span>
                  <div className="muted">Codice <code>{p.code}</code> · compenso {Number(p.commission_pct)}%</div>
                </div>
                <div className="auto row" style={{ flex: "0 0 auto", alignItems: "center" }}>
                  <form action={togglePartner} className="auto">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="active" value={p.active ? "1" : "0"} />
                    <button className="ghost small" type="submit">{p.active ? "Disattiva" : "Riattiva"}</button>
                  </form>
                  <ConfirmDelete id={p.id} name={p.name} action={deletePartner} />
                </div>
              </div>

              <p className="muted" style={{ margin: "14px 0 4px" }}>Pannello privato del partner, da inviargli:</p>
              <div className="linkrow">
                <code>{panel}</code>
                <CopyButton text={panel} label="Copia pannello" />
              </div>

              <p className="muted" style={{ margin: "14px 0 0" }}>Link da usare nei suoi contenuti:</p>
              {SITES.map((s) => {
                const url = `${base}/go/${p.code}/${s.key}`;
                return (
                  <div className="linkrow" key={s.key} style={{ ["--c" as string]: s.color }}>
                    <span className="dot" />
                    <span className="nm">{s.name}</span>
                    <code>{url}</code>
                    <CopyButton text={url} />
                  </div>
                );
              })}
            </div>
          );
        })}
        {(partners ?? []).length === 0 && (
          <div className="card flat"><p className="muted" style={{ margin: 0 }}>Ancora nessun partner: creane uno qui sopra.</p></div>
        )}
      </div>
    </>
  );
}

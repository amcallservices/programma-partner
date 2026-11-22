import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { SITES } from "@/lib/sites";
import Nav from "../Nav";
import { createPartner, togglePartner } from "../actions";

export const dynamic = "force-dynamic";

function baseUrl(): string {
  return (process.env.APP_URL || "https://TUO-DOMINIO").replace(/\/$/, "");
}

export default async function Partners({ searchParams }: { searchParams: { err?: string; ok?: string } }) {
  requireAdmin();
  const { data: partners } = await db().from("partners").select("*").order("created_at", { ascending: false });
  const base = baseUrl();

  return (
    <>
      <Nav />
      <div className="wrap">
        <h1>Partner e link</h1>
        {searchParams.ok && <p className="okmsg">Partner creato.</p>}
        {searchParams.err && <p className="err">Errore: {searchParams.err}</p>}

        <form action={createPartner} className="card row">
          <div><label htmlFor="name">Nome partner</label><input id="name" name="name" required /></div>
          <div><label htmlFor="email">Email (facoltativa)</label><input id="email" name="email" type="email" /></div>
          <div><label htmlFor="pct">Compenso %</label><input id="pct" name="pct" defaultValue="10" inputMode="decimal" /></div>
          <div><button type="submit">Crea partner</button></div>
        </form>

        {(partners ?? []).map((p) => (
          <div className="card" key={p.id}>
            <div className="row" style={{ alignItems: "center" }}>
              <div>
                <strong>{p.name}</strong> {!p.active && <span className="pill">disattivo</span>}
                <div className="muted">Codice <code>{p.code}</code> - compenso {Number(p.commission_pct)}%</div>
              </div>
              <form action={togglePartner} style={{ flex: "0 0 auto" }}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="active" value={p.active ? "1" : "0"} />
                <button className="ghost small" type="submit">{p.active ? "Disattiva" : "Riattiva"}</button>
              </form>
            </div>
            <p className="muted" style={{ marginBottom: 4 }}>Pannello privato del partner (da inviargli):</p>
            <code>{base}/p/{p.token}</code>
            <p className="muted" style={{ margin: "12px 0 4px" }}>Link da usare nei suoi contenuti:</p>
            <div className="scroll">
              <table>
                <tbody>
                  {SITES.map((s) => (
                    <tr key={s.key}>
                      <td style={{ width: 190 }}>{s.name}</td>
                      <td><code>{base}/go/{p.code}/{s.key}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {(partners ?? []).length === 0 && <p className="muted">Ancora nessun partner.</p>}
      </div>
    </>
  );
}

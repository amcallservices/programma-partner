import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { dateFmt } from "@/lib/i18n";
import Nav from "../Nav";
import CopyButton from "../../CopyButton";

export const dynamic = "force-dynamic";

const FIELDS: [string, string][] = [
  ["first_name", "Nome"], ["last_name", "Cognome"], ["iban", "IBAN"], ["bank", "Banca di riferimento"], ["phone", "Cellulare"], ["address", "Indirizzo"],
];

export default async function Profiles() {
  requireAdmin();
  const supa = db();
  const [{ data: partners }, { data: profiles }] = await Promise.all([
    supa.from("partners").select("id, name, code, active").order("created_at", { ascending: false }),
    supa.from("partner_profiles").select("*"),
  ]);
  const byId = new Map((profiles ?? []).map((p) => [p.partner_id, p]));

  return (
    <>
      <Nav />
      <div className="wrap">
        <h1>Profili dei partner</h1>
        <p className="lead">Dati inseriti dai partner per ricevere i pagamenti. Sono dati personali e bancari: usali solo per pagare i compensi.</p>
        {(partners ?? []).map((p) => {
          const pr = byId.get(p.id);
          return (
            <div className="card" key={p.id}>
              <h3 style={{ display: "inline" }}>{p.name}</h3>{" "}
              <span className={`pill ${pr ? "pagata" : "attesa"}`}>{pr ? "profilo compilato" : "non ancora compilato"}</span>
              <div className="muted">Codice <code>{p.code}</code>{pr?.updated_at ? ` · aggiornato il ${dateFmt(pr.updated_at, "it")}` : ""}</div>
              {pr && (
                <div className="scroll" style={{ marginTop: 10 }}>
                  <table>
                    <tbody>
                      {FIELDS.map(([k, label]) => (
                        <tr key={k}>
                          <th style={{ width: 200, textAlign: "left" }}>{label}</th>
                          <td style={{ overflowWrap: "anywhere" }}>{pr[k]}</td>
                          <td style={{ width: 1, whiteSpace: "nowrap" }}><CopyButton text={String(pr[k] ?? "")} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
        {(partners ?? []).length === 0 && <div className="card flat"><p className="muted" style={{ margin: 0 }}>Ancora nessun partner.</p></div>}
      </div>
    </>
  );
}

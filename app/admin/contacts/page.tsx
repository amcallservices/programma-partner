import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { SITES } from "@/lib/sites";
import { saleStatus } from "@/lib/commission";
import Nav from "../Nav";

export const dynamic = "force-dynamic";

export default async function Contacts({ searchParams }: { searchParams: { partner?: string; site?: string } }) {
  requireAdmin();
  const supa = db();
  const [{ data: partners }, { data: leadsAll }, { data: sales }] = await Promise.all([
    supa.from("partners").select("id, name").order("name"),
    supa.from("leads").select("id, partner_id, site_key, email, name, consent, created_at").order("created_at", { ascending: false }).limit(2000),
    supa.from("sales").select("*").not("partner_id", "is", null),
  ]);
  const nameOf = new Map((partners ?? []).map((p) => [p.id, p.name]));
  const siteName = (k: string) => SITES.find((s) => s.key === k)?.name ?? k;
  const buyers = new Set(
    (sales ?? []).filter((s) => saleStatus(s) !== "annullata" && s.email).map((s) => `${s.partner_id}|${String(s.email).toLowerCase()}`),
  );

  const all = leadsAll ?? [];
  const leads = all.filter(
    (l) => (!searchParams.partner || l.partner_id === searchParams.partner) && (!searchParams.site || l.site_key === searchParams.site),
  );
  const bought = leads.filter((l) => buyers.has(`${l.partner_id}|${String(l.email).toLowerCase()}`)).length;

  // riepilogo partner x sito (sull'insieme completo)
  const count = (pid: string, sk: string) => all.filter((l) => l.partner_id === pid && l.site_key === sk).length;

  return (
    <>
      <Nav />
      <div className="wrap">
        <h1>Contatti registrati</h1>
        <p className="muted">Chi ha lasciato l&apos;email dai link dei partner, anche senza acquisti. Qui vedi le email complete; ai partner restano parzialmente nascoste.</p>

        <h2>Riepilogo per partner e sito</h2>
        <div className="scroll">
          <table>
            <thead>
              <tr><th>Partner</th>{SITES.map((s) => <th key={s.key}>{s.name}</th>)}<th>Totale</th></tr>
            </thead>
            <tbody>
              {(partners ?? []).map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  {SITES.map((s) => <td key={s.key}>{count(p.id, s.key)}</td>)}
                  <td><b>{all.filter((l) => l.partner_id === p.id).length}</b></td>
                </tr>
              ))}
              {(partners ?? []).length === 0 && <tr><td colSpan={SITES.length + 2} className="muted">Nessun partner.</td></tr>}
            </tbody>
          </table>
        </div>

        <h2>Elenco email</h2>
        <form method="get" className="card row">
          <div>
            <label htmlFor="partner">Partner</label>
            <select id="partner" name="partner" defaultValue={searchParams.partner ?? ""}>
              <option value="">Tutti</option>
              {(partners ?? []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="site">Sito</label>
            <select id="site" name="site" defaultValue={searchParams.site ?? ""}>
              <option value="">Tutti</option>
              {SITES.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
            </select>
          </div>
          <div><button type="submit">Filtra</button></div>
        </form>
        <p className="muted">{leads.length} email, di cui {bought} con acquisto.</p>
        <div className="scroll">
          <table>
            <thead><tr><th>Data</th><th>Email</th><th>Nome</th><th>Partner</th><th>Sito</th><th>Consenso</th><th>Ha acquistato</th></tr></thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.created_at).toLocaleDateString("it-IT")}</td>
                  <td>{l.email}</td>
                  <td>{l.name ?? "—"}</td>
                  <td>{nameOf.get(l.partner_id) ?? "—"}</td>
                  <td>{siteName(l.site_key)}</td>
                  <td>{l.consent ? "sì" : "no"}</td>
                  <td>{buyers.has(`${l.partner_id}|${String(l.email).toLowerCase()}`) ? "sì" : "non ancora"}</td>
                </tr>
              ))}
              {leads.length === 0 && <tr><td colSpan={7} className="muted">Nessuna email registrata.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

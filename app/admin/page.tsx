import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { commissionCents, eur, saleStatus } from "@/lib/commission";
import Nav from "./Nav";
import { syncNow } from "./actions";
import SyncButton from "./SyncButton";

export const dynamic = "force-dynamic";

export default async function Admin({ searchParams }: { searchParams: { msg?: string } }) {
  requireAdmin();
  const supa = db();
  const [{ data: partners }, { data: sales }, { count: clicks }, { count: leads }] = await Promise.all([
    supa.from("partners").select("id, name, code, commission_pct, active"),
    supa.from("sales").select("partner_id, amount_cents, net_cents, refunded_cents, paid_at, commission_pct, payout_id"),
    supa.from("clicks").select("id", { count: "exact", head: true }),
    supa.from("leads").select("id", { count: "exact", head: true }),
  ]);

  const all = sales ?? [];
  const attributed = all.filter((s) => s.partner_id);
  const sum = (st: string) =>
    attributed.filter((s) => saleStatus(s) === st).reduce((a, s) => a + commissionCents(s), 0);

  const perPartner = (partners ?? []).map((p) => {
    const mine = attributed.filter((s) => s.partner_id === p.id);
    return {
      ...p,
      n: mine.length,
      attesa: mine.filter((s) => saleStatus(s) === "in attesa").reduce((a, s) => a + commissionCents(s), 0),
      maturata: mine.filter((s) => saleStatus(s) === "maturata").reduce((a, s) => a + commissionCents(s), 0),
      pagata: mine.filter((s) => saleStatus(s) === "pagata").reduce((a, s) => a + commissionCents(s), 0),
    };
  });

  return (
    <>
      <Nav />
      <div className="wrap">
        <h1>Riepilogo</h1>
        {searchParams.msg && <p className="notice" role="status">{searchParams.msg}</p>}
        <div className="grid">
          <div className="card stat" style={{ ["--stat" as string]: "var(--soft)" }}><span>Click sui link</span><b>{clicks ?? 0}</b></div>
          <div className="card stat" style={{ ["--stat" as string]: "var(--seo)" }}><span>Email raccolte</span><b>{leads ?? 0}</b></div>
          <div className="card stat" style={{ ["--stat" as string]: "var(--boost)" }}><span>Vendite attribuite</span><b>{attributed.length}</b></div>
          <div className="card stat" style={{ ["--stat" as string]: "var(--lib)" }}><span>Vendite senza partner</span><b>{all.length - attributed.length}</b></div>
        </div>
        <div className="grid">
          <div className="card stat" style={{ ["--stat" as string]: "var(--lib)" }}><span>Compensi in attesa (30 giorni)</span><b>{eur(sum("in attesa"))}</b></div>
          <div className="card stat" style={{ ["--stat" as string]: "var(--seo)" }}><span>Compensi maturati da pagare</span><b>{eur(sum("maturata"))}</b></div>
          <div className="card stat" style={{ ["--stat" as string]: "var(--soft)" }}><span>Compensi già pagati</span><b>{eur(sum("pagata"))}</b></div>
        </div>

        <h2>Per partner</h2>
        <div className="scroll">
          <table>
            <thead><tr><th>Partner</th><th>%</th><th>Vendite</th><th>In attesa</th><th>Maturato</th><th>Pagato</th></tr></thead>
            <tbody>
              {perPartner.map((p) => (
                <tr key={p.id}>
                  <td>{p.name} {!p.active && <span className="pill">disattivo</span>}</td>
                  <td>{Number(p.commission_pct)}%</td>
                  <td>{p.n}</td>
                  <td>{eur(p.attesa)}</td>
                  <td>{eur(p.maturata)}</td>
                  <td>{eur(p.pagata)}</td>
                </tr>
              ))}
              {perPartner.length === 0 && <tr><td colSpan={6} className="muted">Nessun partner: creane uno in "Partner e link".</td></tr>}
            </tbody>
          </table>
        </div>

        <h2>Sincronizza con Stripe</h2>
        <form action={syncNow} className="card row">
          <div>
            <label htmlFor="days">Quanti giorni indietro</label>
            <select id="days" name="days" defaultValue="45">
              <option value="45">Ultimi 45 giorni (uso normale)</option>
              <option value="365">Ultimi 12 mesi (prima volta)</option>
            </select>
          </div>
          <div className="auto"><SyncButton /></div>
        </form>
        <p className="muted">La sincronizzazione parte anche da sola ogni 6 ore. Stripe viene solo letto, mai modificato.</p>
      </div>
    </>
  );
}

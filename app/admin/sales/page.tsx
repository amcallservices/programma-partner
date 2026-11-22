import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { commissionCents, eur, saleStatus } from "@/lib/commission";
import Nav from "../Nav";
import { addManualSale, assignSale } from "../actions";

export const dynamic = "force-dynamic";

export default async function Sales({ searchParams }: { searchParams: { err?: string; ok?: string } }) {
  requireAdmin();
  const supa = db();
  const [{ data: sales }, { data: partners }] = await Promise.all([
    supa.from("sales").select("*").order("paid_at", { ascending: false }).limit(300),
    supa.from("partners").select("id, name").order("name"),
  ]);
  const nameOf = new Map((partners ?? []).map((p) => [p.id, p.name]));

  return (
    <>
      <Nav />
      <div className="wrap">
        <h1>Vendite</h1>
        {searchParams.ok && <p className="okmsg">Vendita aggiunta.</p>}
        {searchParams.err && <p className="err">Errore: {searchParams.err}</p>}

        <h2>Aggiungi una vendita a mano (es. PayPal / Liberamente)</h2>
        <form action={addManualSale} className="card row">
          <div><label htmlFor="email">Email cliente</label><input id="email" name="email" type="email" /></div>
          <div><label htmlFor="amount">Importo lordo (€)</label><input id="amount" name="amount" required inputMode="decimal" /></div>
          <div><label htmlFor="net">Netto (€, facoltativo)</label><input id="net" name="net" inputMode="decimal" /></div>
          <div><label htmlFor="date">Data</label><input id="date" name="date" type="date" /></div>
          <div><label htmlFor="description">Descrizione</label><input id="description" name="description" /></div>
          <div><button type="submit">Aggiungi</button></div>
        </form>

        <h2>Ultime vendite</h2>
        <p className="muted">Se una vendita non è attribuita ma sai chi l'ha portata (email diversa), assegnala a mano dal menu.</p>
        <div className="scroll">
          <table>
            <thead><tr><th>Data</th><th>Cliente</th><th>Descrizione</th><th>Lordo</th><th>Netto</th><th>Partner</th><th>Compenso</th><th>Stato</th></tr></thead>
            <tbody>
              {(sales ?? []).map((s) => {
                const st = saleStatus(s);
                return (
                  <tr key={s.id}>
                    <td>{new Date(s.paid_at).toLocaleDateString("it-IT")}</td>
                    <td>{s.email ?? "—"}</td>
                    <td>{s.description ?? "—"}</td>
                    <td>{eur(s.amount_cents, s.currency)}{s.refunded_cents > 0 && <div className="muted">rimborsati {eur(s.refunded_cents, s.currency)}</div>}</td>
                    <td>{eur(s.net_cents, s.currency)}</td>
                    <td>
                      {s.payout_id ? (
                        nameOf.get(s.partner_id) ?? "—"
                      ) : (
                        <form action={assignSale} className="row" style={{ flexWrap: "nowrap" }}>
                          <input type="hidden" name="sale_id" value={s.id} />
                          <select name="partner_id" defaultValue={s.partner_id ?? ""} style={{ minWidth: 120 }}>
                            <option value="">— nessuno —</option>
                            {(partners ?? []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                          <button className="ghost small" type="submit">Salva</button>
                        </form>
                      )}
                    </td>
                    <td>{eur(commissionCents(s))}</td>
                    <td><span className={`pill ${st === "in attesa" ? "attesa" : st}`}>{st}</span></td>
                  </tr>
                );
              })}
              {(sales ?? []).length === 0 && <tr><td colSpan={8} className="muted">Nessuna vendita: usa "Sincronizza ora" nel riepilogo.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

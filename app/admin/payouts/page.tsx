import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { eur } from "@/lib/commission";
import Nav from "../Nav";
import { createPayouts, markPaid } from "../actions";

export const dynamic = "force-dynamic";

export default async function Payouts({ searchParams }: { searchParams: { msg?: string } }) {
  requireAdmin();
  const supa = db();
  const [{ data: payouts }, { data: partners }] = await Promise.all([
    supa.from("payouts").select("*").order("created_at", { ascending: false }),
    supa.from("partners").select("id, name, email"),
  ]);
  const p = new Map((partners ?? []).map((x) => [x.id, x]));
  const min = process.env.MIN_PAYOUT_EUR ?? "50";

  return (
    <>
      <Nav />
      <div className="wrap">
        <h1>Pagamenti ai partner</h1>
        {searchParams.msg && <p className="notice">{searchParams.msg}</p>}
        <div className="card">
          <p>
            "Chiudi il mese" raggruppa, per ogni partner, i compensi <b>maturati</b> (vendite non rimborsate con più di 30
            giorni) in un pagamento da fare. Sotto la soglia minima ({min} €) l'importo resta accumulato.
          </p>
          <form action={createPayouts}><button type="submit">Chiudi il mese e crea i pagamenti</button></form>
        </div>

        <div className="scroll">
          <table>
            <thead><tr><th>Periodo</th><th>Partner</th><th>Importo</th><th>Stato</th><th></th></tr></thead>
            <tbody>
              {(payouts ?? []).map((x) => (
                <tr key={x.id}>
                  <td>{x.period}</td>
                  <td>{p.get(x.partner_id)?.name ?? "—"}<div className="muted">{p.get(x.partner_id)?.email ?? ""}</div></td>
                  <td><b>{eur(x.amount_cents, x.currency)}</b></td>
                  <td><span className={`pill ${x.status === "pagato" ? "pagata" : "attesa"}`}>{x.status.replace("_", " ")}</span>
                    {x.paid_at && <div className="muted">{new Date(x.paid_at).toLocaleDateString("it-IT")}</div>}
                    {x.note && <div className="muted">{x.note}</div>}</td>
                  <td>
                    {x.status === "da_pagare" && (
                      <form action={markPaid} className="row" style={{ flexWrap: "nowrap" }}>
                        <input type="hidden" name="id" value={x.id} />
                        <input name="note" placeholder="Nota (es. bonifico del 5/12)" />
                        <button className="small" type="submit">Segna pagato</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {(payouts ?? []).length === 0 && <tr><td colSpan={5} className="muted">Nessun pagamento ancora.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="muted">Il pagamento vero (bonifico o PayPal) lo fai tu fuori dall'app: qui lo registri come pagato.</p>
      </div>
    </>
  );
}

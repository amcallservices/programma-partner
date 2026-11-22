import Link from "next/link";
import { logout } from "./actions";

export default function Nav() {
  return (
    <div className="nav">
      <strong style={{ color: "#fff" }}>Programma partner</strong>
      <Link href="/admin">Riepilogo</Link>
      <Link href="/admin/partners">Partner e link</Link>
      <Link href="/admin/sales">Vendite</Link>
      <Link href="/admin/payouts">Pagamenti</Link>
      <span className="sp" />
      <form action={logout}>
        <button className="ghost small" type="submit">Esci</button>
      </form>
    </div>
  );
}

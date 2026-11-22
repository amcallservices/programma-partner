"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";

const LINKS = [
  { href: "/admin", label: "Riepilogo" },
  { href: "/admin/partners", label: "Partner e link" },
  { href: "/admin/contacts", label: "Contatti" },
  { href: "/admin/sales", label: "Vendite" },
  { href: "/admin/payouts", label: "Pagamenti" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav" aria-label="Area amministratore">
      <span className="brand">Programma partner</span>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
      <span className="sp" />
      <form action={logout}>
        <button className="ghost small" type="submit" style={{ color: "#fff", borderColor: "rgba(255,255,255,.35)" }}>
          Esci
        </button>
      </form>
    </nav>
  );
}

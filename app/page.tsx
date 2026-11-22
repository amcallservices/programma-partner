import Link from "next/link";

export default function Home() {
  return (
    <div className="wrap narrow">
      <h1>Programma partner</h1>
      <p className="muted">Questa pagina è riservata. I partner accedono dal link privato ricevuto.</p>
      <p><Link href="/admin">Area amministratore</Link></p>
    </div>
  );
}

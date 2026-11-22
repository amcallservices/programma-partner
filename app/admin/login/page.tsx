import { login } from "../actions";

export default function LoginPage({ searchParams }: { searchParams: { err?: string } }) {
  return (
    <div className="wrap narrow">
      <h1>Accesso amministratore</h1>
      <p className="lead" style={{ marginTop: 8 }}>Area riservata a chi gestisce il programma partner.</p>
      <form action={login} className="card">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoFocus autoComplete="username" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" />
        {searchParams.err && <p className="notice bad" role="alert" style={{ marginTop: 14 }}>Email o password errate.</p>}
        <p style={{ marginTop: 18, marginBottom: 0 }}><button type="submit">Entra</button></p>
      </form>
    </div>
  );
}

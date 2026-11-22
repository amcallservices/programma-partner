import { login } from "../actions";

export default function LoginPage({ searchParams }: { searchParams: { err?: string } }) {
  return (
    <div className="wrap narrow">
      <h1>Accesso amministratore</h1>
      <form action={login} className="card">
        <label htmlFor="email">Email amministratore</label>
        <input id="email" name="email" type="email" required autoFocus autoComplete="username" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" />
        {searchParams.err && <p className="err">Email o password errate.</p>}
        <p><button type="submit">Entra</button></p>
      </form>
    </div>
  );
}

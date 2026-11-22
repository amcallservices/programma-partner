"use client";

import { useRef, useState } from "react";

/** Pulsante "Elimina" con finestra di conferma: bisogna riscrivere il nome del partner. */
export default function ConfirmDelete({
  id,
  name,
  action,
}: {
  id: string;
  name: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [typed, setTyped] = useState("");
  const ok = typed.trim().toLowerCase() === name.trim().toLowerCase();

  return (
    <>
      <button type="button" className="danger ghost small" onClick={() => ref.current?.showModal()}>
        Elimina
      </button>
      <dialog ref={ref} className="confirm" onClose={() => setTyped("")}>
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <h3>Eliminare {name}?</h3>
          <p className="muted">
            Spariscono il partner, i suoi link, i click e le email raccolte. Le vendite restano nell&apos;elenco ma
            tornano &quot;senza partner&quot;. L&apos;operazione non si può annullare. Se il partner ha già ricevuto
            pagamenti, l&apos;eliminazione viene bloccata: in quel caso disattivalo.
          </p>
          <label htmlFor={`c-${id}`}>Per confermare scrivi il nome: <strong>{name}</strong></label>
          <input
            id={`c-${id}`}
            name="confirm"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
          />
          <div className="row" style={{ marginTop: 18, justifyContent: "flex-end" }}>
            <button type="button" className="ghost auto" onClick={() => ref.current?.close()}>Annulla</button>
            <button type="submit" className="danger auto" disabled={!ok}>Elimina partner</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

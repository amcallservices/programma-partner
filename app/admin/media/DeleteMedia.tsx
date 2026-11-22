"use client";

export default function DeleteMedia({ id, title, action }: { id: string; title: string; action: (f: FormData) => void | Promise<void> }) {
  return (
    <form action={action} onSubmit={(e) => { if (!window.confirm(`Eliminare «${title}»? Sparisce anche dal pannello dei partner.`)) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="danger ghost small">Elimina</button>
    </form>
  );
}

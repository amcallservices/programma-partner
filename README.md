# Programma partner - app di tracciamento referral

Traccia le vendite portate dai partner senza modificare i cinque siti.

## Come funziona
1. Crei un partner: l'app genera i link `/go/<codice>/<sito>` e un pannello privato `/p/<token>`.
2. Il visitatore clicca, lascia l'email (con consenso) e viene mandato al sito.
3. Ogni 6 ore (o con "Sincronizza ora") l'app legge i pagamenti da Stripe in sola lettura e li collega ai partner tramite l'email.
4. Compenso: percentuale sul netto, matura dopo 30 giorni, si annulla con il rimborso. Cliente attribuito per 12 mesi (primo partner).

## Messa online (in ordine)
1. Crea un progetto Supabase NUOVO ed esegui `supabase/schema.sql` nell'SQL Editor.
2. In Stripe crea una chiave riservata (rk_live_...) con il solo permesso di lettura su Charges e Customers (una per ogni account Stripe).
3. Crea un progetto Vercel dal repository e inserisci le variabili di `.env.example`.
4. Apri `APP_URL/admin`, accedi, crea il primo partner e premi "Sincronizza ora" con "Ultimi 12 mesi".

## Test in locale
`npm install`, copia `.env.example` in `.env.local` e compila, poi `npm run dev`. `npm test` prova la logica dei compensi.

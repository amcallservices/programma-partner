-- Schema per l'app di tracciamento referral.
-- Esegui questo file nell'SQL Editor di Supabase (progetto nuovo e dedicato).

create extension if not exists pgcrypto;

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  code text not null unique,            -- usato nei link: /go/<code>/<sito>
  token text not null unique,           -- accesso privato al pannello: /p/<token>
  commission_pct numeric(5,2) not null default 15,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists clicks (
  id bigserial primary key,
  partner_id uuid not null references partners(id) on delete cascade,
  site_key text not null,
  created_at timestamptz not null default now()
);
create index if not exists clicks_partner_idx on clicks(partner_id, created_at);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  site_key text not null,
  email text not null,                  -- sempre minuscolo
  name text,
  consent boolean not null default false,
  consent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists leads_email_idx on leads(email, created_at);
create index if not exists leads_partner_idx on leads(partner_id, created_at);

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  period text not null,                 -- es. 2026-12
  amount_cents integer not null,
  currency text not null default 'eur',
  status text not null default 'da_pagare' check (status in ('da_pagare','pagato')),
  paid_at timestamptz,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,     -- id addebito Stripe (ch_...) oppure manual_...
  source text not null default 'stripe', -- stripe | manuale
  email text,
  description text,
  site_guess text,
  amount_cents integer not null,        -- lordo
  net_cents integer not null,           -- netto dopo commissioni di pagamento
  refunded_cents integer not null default 0,
  currency text not null default 'eur',
  paid_at timestamptz not null,
  partner_id uuid references partners(id) on delete set null,
  lead_id uuid references leads(id) on delete set null,
  commission_pct numeric(5,2),
  attribution text not null default 'auto' check (attribution in ('auto','manuale','nessuna')),
  payout_id uuid references payouts(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists sales_partner_idx on sales(partner_id, paid_at);
create index if not exists sales_email_idx on sales(email);

-- Tutti gli accessi avvengono dal server con la chiave di servizio:
-- blocchiamo ogni accesso diretto dal browser.
alter table partners enable row level security;
alter table clicks enable row level security;
alter table leads enable row level security;
alter table payouts enable row level security;
alter table sales enable row level security;

-- Password del partner e profilo (dati per i pagamenti). Da eseguire nell'SQL Editor del progetto programma-partner.
alter table partners
  add column if not exists pw_hash text,
  add column if not exists pw_set_at timestamptz,
  add column if not exists pw_fails int not null default 0,
  add column if not exists pw_locked_until timestamptz;

create table if not exists partner_profiles (
  partner_id uuid primary key references partners(id) on delete cascade,
  first_name text, last_name text, iban text, bank text, phone text, address text,
  updated_at timestamptz not null default now()
);
alter table partner_profiles enable row level security;

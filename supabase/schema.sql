-- Schéma Supabase pour la plateforme d'adhésion politique
-- Copier ce fichier dans l'éditeur SQL Supabase pour initialiser la base de données

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  address text not null,
  national_id text not null unique,
  gender text not null check (gender in ('Masculin', 'Féminin')),
  photo_url text,
  contribution_amount integer not null default 1000,
  payment_reference text,
  payment_declared boolean not null default false,
  payment_verified boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.membership_applications(id) on delete set null,
  member_number text not null unique,
  first_name text not null,
  last_name text not null,
  phone text not null,
  address text not null,
  national_id text not null unique,
  gender text not null check (gender in ('Masculin', 'Féminin')),
  photo_url text,
  qr_value text not null,
  joined_at timestamptz not null default now(),
  card_status text not null default 'active' check (card_status in ('active', 'suspended', 'revoked')),
  updated_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  scope text not null default 'member' check (scope in ('member', 'all', 'public')),
  title text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  movement_name text not null,
  short_name text not null,
  wave_merchant_code text not null,
  fee_amount integer not null default 1000,
  processing_delay text not null default '48 heures',
  logo_label text not null default 'ACD',
  created_at timestamptz not null default now()
);

-- Row Level Security de base
alter table public.membership_applications enable row level security;
alter table public.members enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_settings enable row level security;

-- Lecture publique limitée pour les administrateurs authentifiés
create policy "Admins can read applications" on public.membership_applications
  for select using (auth.role() = 'authenticated');

create policy "Admins can update applications" on public.membership_applications
  for update using (auth.role() = 'authenticated');

create policy "Admins can read members" on public.members
  for select using (auth.role() = 'authenticated');

create policy "Admins can insert members" on public.members
  for insert with check (auth.role() = 'authenticated');

-- Insertion publique pour les demandes d'adhésion
create policy "Anyone can submit application" on public.membership_applications
  for insert with check (true);

-- Les membres peuvent lire leurs propres notifications
create policy "Members can read own notifications" on public.notifications
  for select using (auth.uid() is not null);

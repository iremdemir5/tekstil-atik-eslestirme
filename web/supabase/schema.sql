-- Gercek veri odakli eslestirme modeli
-- Supabase SQL Editor uzerinden calistirabilirsiniz.

create extension if not exists "pgcrypto";

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  company_type text not null check (company_type in ('producer', 'buyer')),
  legal_name text not null,
  tax_number text unique not null,
  mersis_number text,
  city text not null,
  district text,
  address text,
  latitude double precision,
  longitude double precision,
  phone text,
  email text,
  website text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  document_type text not null check (
    document_type in (
      'trade_registry',
      'tax_certificate',
      'environment_license',
      'facility_permit',
      'other'
    )
  ),
  document_url text not null,
  valid_until date,
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'rejected', 'expired')
  ),
  verified_by uuid,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.producer_profiles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  avg_monthly_waste_kg numeric(12,2),
  preferred_pickup_days text[] default '{}',
  verification_level integer not null default 0 check (verification_level between 0 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.buyer_profiles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  accepted_materials text[] not null default '{}',
  accepts_recommended_uses text[] not null default '{}',
  monthly_capacity_kg numeric(12,2) not null default 0,
  min_lot_kg numeric(12,2) not null default 0,
  max_lot_kg numeric(12,2),
  service_radius_km numeric(10,2) not null default 50,
  quality_score integer not null default 50 check (quality_score between 0 and 100),
  compliance_score integer not null default 50 check (compliance_score between 0 and 100),
  reliability_score integer not null default 50 check (reliability_score between 0 and 100),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.match_candidates (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.analysis_sessions(id) on delete cascade,
  buyer_company_id uuid not null references public.companies(id) on delete cascade,
  total_score numeric(5,2) not null check (total_score between 0 and 100),
  distance_km numeric(10,2),
  material_score numeric(5,2) not null default 0,
  capacity_score numeric(5,2) not null default 0,
  distance_score numeric(5,2) not null default 0,
  compliance_score numeric(5,2) not null default 0,
  trust_score numeric(5,2) not null default 0,
  reasons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique(session_id, buyer_company_id)
);

create index if not exists idx_companies_type_active on public.companies(company_type, is_active);
create index if not exists idx_buyer_profiles_verified on public.buyer_profiles(is_verified);
create index if not exists idx_match_candidates_session on public.match_candidates(session_id);

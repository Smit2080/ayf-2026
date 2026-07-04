-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  whatsapp_number text not null,
  age int not null,
  college text not null,
  stream text not null,
  role text not null default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Admin override policies
create policy "Admins can view all profiles" on public.profiles
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Create competitions table
create table public.competitions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  competition_name text not null,
  performance_details text not null,
  status text default 'Pending Audition' not null,
  audition_slot text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for competitions
alter table public.competitions enable row level security;

create policy "Users can view their own competitions" on public.competitions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own competitions" on public.competitions
  for insert with check (auth.uid() = user_id);

-- Admin override policies
create policy "Admins can view all competitions" on public.competitions
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update competitions" on public.competitions
  for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Create volunteers table
create table public.volunteers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade unique not null,
  gender text not null,
  city text not null,
  languages text not null,
  experience text not null,
  why_volunteer text not null,
  instagram_id text,
  status text default 'Pending Review' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for volunteers
alter table public.volunteers enable row level security;

create policy "Users can view their own volunteer application" on public.volunteers
  for select using (auth.uid() = user_id);

create policy "Users can insert their own volunteer application" on public.volunteers
  for insert with check (auth.uid() = user_id);

-- Admin override policies
create policy "Admins can view all volunteers" on public.volunteers
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update volunteers" on public.volunteers
  for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));


-- enum + roles table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users view own roles" on public.user_roles for select to authenticated
  using (auth.uid() = user_id);
create policy "admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- departments
create table public.departments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_bn text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.departments enable row level security;
create policy "departments public read" on public.departments for select using (true);
create policy "admins manage departments" on public.departments for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- team members
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  name text not null,
  title text not null,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.team_members enable row level security;
create policy "team_members public read" on public.team_members for select using (true);
create policy "admins manage team_members" on public.team_members for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create index team_members_dept_idx on public.team_members(department_id, sort_order);

-- seed departments
insert into public.departments (slug, name, name_bn, sort_order) values
  ('engineering','Engineering','ইঞ্জিনিয়ারিং',1),
  ('architecture','Architecture','আর্কিটেকচার',2),
  ('construction','Construction','কনস্ট্রাকশন',3),
  ('sales','Sales & Marketing','সেলস ও মার্কেটিং',4),
  ('finance','Finance','ফাইন্যান্স',5),
  ('customer-care','Customer Care','কাস্টমার কেয়ার',6);

-- storage bucket
insert into storage.buckets (id, name, public) values ('team-images','team-images', true)
  on conflict (id) do nothing;

create policy "team-images public read" on storage.objects for select
  using (bucket_id = 'team-images');
create policy "admins upload team-images" on storage.objects for insert to authenticated
  with check (bucket_id = 'team-images' and public.has_role(auth.uid(), 'admin'));
create policy "admins update team-images" on storage.objects for update to authenticated
  using (bucket_id = 'team-images' and public.has_role(auth.uid(), 'admin'));
create policy "admins delete team-images" on storage.objects for delete to authenticated
  using (bucket_id = 'team-images' and public.has_role(auth.uid(), 'admin'));

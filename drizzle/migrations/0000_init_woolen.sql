create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.claim_owner()
returns boolean language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then
    return public.has_role(auth.uid(), 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (auth.uid(), 'admin');
  return true;
end $$;
revoke execute on function public.claim_owner() from public, anon;
grant execute on function public.claim_owner() to authenticated;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  category text not null default 'Decoration Mat',
  image_url text,
  image_path text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "Public views published" on public.products for select to anon, authenticated using (published = true);
create policy "Owner views all" on public.products for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Owner inserts" on public.products for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Owner updates" on public.products for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Owner deletes" on public.products for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

create table public.custom_orders (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  phone text not null check (char_length(phone) between 5 and 20),
  product_type text not null default '',
  size text not null default '',
  message text not null default '' check (char_length(message) <= 2000),
  created_at timestamptz not null default now()
);
grant insert on public.custom_orders to anon, authenticated;
grant select, delete on public.custom_orders to authenticated;
grant all on public.custom_orders to service_role;
alter table public.custom_orders enable row level security;
create policy "Anyone submits orders" on public.custom_orders for insert to anon, authenticated with check (true);
create policy "Owner reads orders" on public.custom_orders for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Owner deletes orders" on public.custom_orders for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
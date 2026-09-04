-- ============ ENUMS & ROLES ============
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "users read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profile owner read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profile owner upsert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profile owner update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ============ CATEGORIES ============
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);
grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select to anon, authenticated using (true);

-- ============ PRODUCTS ============
create table public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  brand text not null,
  price numeric(12,2) not null,
  old_price numeric(12,2),
  ram int not null default 0,
  storage int not null default 0,
  os text not null,
  rating numeric(2,1) not null default 0,
  reviews int not null default 0,
  stock int not null default 0,
  tags text[] not null default '{}',
  color text,
  image text,
  specs jsonb not null default '[]',
  description text,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now()
);
create index products_brand_idx on public.products(brand);
create index products_os_idx on public.products(os);
create index products_tags_idx on public.products using gin(tags);

grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products public read" on public.products for select to anon, authenticated using (true);

-- ============ COUPONS ============
create type public.coupon_kind as enum ('percent', 'shipping');
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  kind public.coupon_kind not null,
  value numeric(5,2) not null default 0,
  label text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.coupons to anon, authenticated;
grant all on public.coupons to service_role;
alter table public.coupons enable row level security;
create policy "coupons public read" on public.coupons for select to anon, authenticated using (active = true);

-- ============ ORDERS ============
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  status text not null default 'pending',
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  shipping numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  shipping_name text,
  shipping_address text,
  shipping_city text,
  payment_status text not null default 'unpaid',
  created_at timestamptz not null default now()
);
create index orders_user_idx on public.orders(user_id);
create index orders_status_idx on public.orders(status);

grant select on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders owner read" on public.orders for select to authenticated using (user_id = auth.uid());

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  name text not null,
  price numeric(12,2) not null,
  qty int not null default 1
);
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "order_items owner read" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- ============ REVIEWS ============
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text,
  rating int not null check (rating between 1 and 5),
  body text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.reviews to anon, authenticated;
grant insert, update on public.reviews to authenticated;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;
create policy "reviews public read" on public.reviews for select to anon, authenticated using (approved = true);
create policy "reviews owner read own" on public.reviews for select to authenticated using (user_id = auth.uid());
create policy "reviews owner insert" on public.reviews for insert to authenticated with check (user_id = auth.uid());
create policy "reviews owner update own" on public.reviews for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============ WISHLIST ============
create table public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);
grant select, insert, delete on public.wishlist to authenticated;
grant all on public.wishlist to service_role;
alter table public.wishlist enable row level security;
create policy "wishlist owner all" on public.wishlist for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============ SECURITY LOGS ============
create type public.audit_level as enum ('ok', 'warn', 'alert');
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event text not null,
  meta jsonb not null default '{}',
  level public.audit_level not null default 'ok',
  ip text,
  created_at timestamptz not null default now()
);
grant select on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "audit owner read" on public.audit_logs for select to authenticated using (user_id = auth.uid());

-- ============ SEED: PRODUCTS ============
insert into public.products (id, slug, name, brand, price, old_price, ram, storage, os, rating, reviews, stock, tags, color, image, specs, description) values
('iphone-15-pro','iphone-15-pro','iPhone 15 Pro','Apple',27999,29999,8,256,'iOS',4.8,1284,24,array['featured','bestseller'],'Titanium Black','linear-gradient(135deg, #3a3a3a, #0f0f10)','[{"label":"Display","value":"6.1\" Super Retina XDR"},{"label":"Chip","value":"Apple A17 Pro"},{"label":"Camera","value":"48MP triple system"},{"label":"Battery","value":"Up to 23 hrs video"}]','Titanium. A17 Pro chip. The most powerful iPhone yet.'),
('galaxy-s24-ultra','galaxy-s24-ultra','Galaxy S24 Ultra','Samsung',32499,null,12,512,'Android',4.7,942,18,array['featured','new'],'Titanium Violet','linear-gradient(135deg, #6b46c1, #1a1147)','[{"label":"Display","value":"6.8\" Dynamic AMOLED 2X"},{"label":"Chip","value":"Snapdragon 8 Gen 3"},{"label":"Camera","value":"200MP main + 50MP tele"},{"label":"Battery","value":"5000 mAh"}]','200MP camera. Built-in S Pen. Galaxy AI.'),
('pixel-8-pro','pixel-8-pro','Pixel 8 Pro','Google',22499,24999,12,256,'Android',4.6,612,31,array['bestseller'],'Bay Blue','linear-gradient(135deg, #3b82f6, #0c1e3f)','[{"label":"Display","value":"6.7\" LTPO OLED 120Hz"},{"label":"Chip","value":"Google Tensor G3"},{"label":"Camera","value":"50MP triple system"},{"label":"Battery","value":"5050 mAh"}]','Google AI photography. Tensor G3 chip.'),
('oneplus-12','oneplus-12','OnePlus 12','OnePlus',19999,null,16,512,'Android',4.5,388,12,array['new'],'Flowy Emerald','linear-gradient(135deg, #10b981, #062c22)','[{"label":"Display","value":"6.82\" LTPO AMOLED"},{"label":"Chip","value":"Snapdragon 8 Gen 3"},{"label":"Camera","value":"50MP Hasselblad"},{"label":"Battery","value":"5400 mAh"}]','Hasselblad camera. 100W SuperVOOC charging.'),
('iphone-15','iphone-15','iPhone 15','Apple',19999,null,6,128,'iOS',4.6,2102,40,array['bestseller'],'Pink','linear-gradient(135deg, #fbcfe8, #7a2a4a)','[{"label":"Display","value":"6.1\" Super Retina XDR"},{"label":"Chip","value":"Apple A16 Bionic"},{"label":"Camera","value":"48MP dual"},{"label":"Battery","value":"Up to 20 hrs video"}]','Dynamic Island. 48MP main camera. USB-C.'),
('galaxy-a55','galaxy-a55','Galaxy A55','Samsung',11249,null,8,128,'Android',4.3,506,60,array['new'],'Awesome Iceblue','linear-gradient(135deg, #67e8f9, #0e3a4a)','[{"label":"Display","value":"6.6\" Super AMOLED"},{"label":"Chip","value":"Exynos 1480"},{"label":"Camera","value":"50MP triple"},{"label":"Battery","value":"5000 mAh"}]','5G. Triple camera. Bright Super AMOLED.'),
('xiaomi-14','xiaomi-14','Xiaomi 14','Xiaomi',17499,null,12,256,'Android',4.4,271,22,array['featured'],'Jade Green','linear-gradient(135deg, #84cc16, #1f3408)','[{"label":"Display","value":"6.36\" LTPO OLED"},{"label":"Chip","value":"Snapdragon 8 Gen 3"},{"label":"Camera","value":"50MP Leica triple"},{"label":"Battery","value":"4610 mAh"}]','Leica optics. Snapdragon 8 Gen 3.'),
('nothing-phone-2','nothing-phone-2','Nothing Phone (2)','Nothing',14999,16999,12,256,'Android',4.4,198,15,array['featured','new'],'Dark Grey','linear-gradient(135deg, #374151, #0a0a0a)','[{"label":"Display","value":"6.7\" LTPO OLED 120Hz"},{"label":"Chip","value":"Snapdragon 8+ Gen 1"},{"label":"Camera","value":"50MP dual"},{"label":"Battery","value":"4700 mAh"}]','Glyph interface. Transparent design.'),
('iphone-14','iphone-14','iPhone 14','Apple',17499,null,6,128,'iOS',4.5,3120,50,array['bestseller'],'Midnight','linear-gradient(135deg, #1f2937, #000000)','[{"label":"Display","value":"6.1\" Super Retina XDR"},{"label":"Chip","value":"Apple A15 Bionic"},{"label":"Camera","value":"12MP dual"},{"label":"Battery","value":"Up to 20 hrs video"}]','A15 Bionic. Cinematic mode. Crash detection.'),
('pixel-8a','pixel-8a','Pixel 8a','Google',12499,null,8,128,'Android',4.5,311,28,array['new','bestseller'],'Aloe','linear-gradient(135deg, #86efac, #14532d)','[{"label":"Display","value":"6.1\" OLED 120Hz"},{"label":"Chip","value":"Google Tensor G3"},{"label":"Camera","value":"64MP dual"},{"label":"Battery","value":"4492 mAh"}]','Google AI features at a great price.'),
('oneplus-nord-4','oneplus-nord-4','OnePlus Nord 4','OnePlus',10749,null,12,256,'Android',4.2,142,33,array['new'],'Mercurial Silver','linear-gradient(135deg, #9ca3af, #111827)','[{"label":"Display","value":"6.74\" AMOLED 120Hz"},{"label":"Chip","value":"Snapdragon 7+ Gen 3"},{"label":"Camera","value":"50MP dual"},{"label":"Battery","value":"5500 mAh"}]','Metal unibody. 100W fast charging.'),
('xiaomi-redmi-note-13','xiaomi-redmi-note-13','Redmi Note 13 Pro','Xiaomi',8249,null,8,256,'Android',4.3,887,80,array['bestseller'],'Forest Green','linear-gradient(135deg, #22c55e, #0a1f12)','[{"label":"Display","value":"6.67\" AMOLED 120Hz"},{"label":"Chip","value":"Snapdragon 7s Gen 2"},{"label":"Camera","value":"200MP triple"},{"label":"Battery","value":"5100 mAh"}]','200MP camera. 67W turbo charging.');

-- demo coupons
insert into public.coupons (code, kind, value, label, active) values
('WELCOME10','percent',10,'10% Off',true),
('SHIPFREE','shipping',0,'Free Shipping',true),
('SAVE15','percent',15,'15% Off',true);

-- sample approved reviews
insert into public.reviews (product_id, author_name, rating, body, approved) values
('iphone-15-pro','Alex',5,'Incredible build quality, battery lasts all day. Camera is unreal.',true),
('iphone-15-pro','Priya',4,'Love the design, slight learning curve with new gestures.',true),
('iphone-15-pro','Sam',5,'Shipped fast and arrived in perfect condition. Highly recommend.',true);

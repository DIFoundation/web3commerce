-- Enable RLS
alter table products enable row level security;
alter table orders enable row level security;

-- Products: sellers manage their own
create policy "Sellers can CRUD their products"
  on products for all
  using (seller_id = auth.uid());

-- Products: public can view active
create policy "Public can view active products"
  on products for select
  using (status = 'active');

-- Orders: buyers see their orders
create policy "Buyers can view their orders"
  on orders for select
  using (buyer_address = auth.jwt() ->> 'wallet_address');

-- Orders: sellers see orders for their products
create policy "Sellers can view their product orders"
  on orders for select
  using (seller_id = auth.uid());
create table if not exists candles (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  candle_type text not null,
  message text not null,
  from_name text,
  colour text default 'gold',
  approved boolean default true
);

alter table candles enable row level security;

drop policy if exists "Anyone can submit candles" on candles;
drop policy if exists "Anyone can view approved candles" on candles;

create policy "Anyone can submit candles"
on candles
for insert
to anon
with check (true);

create policy "Anyone can view approved candles"
on candles
for select
to anon
using (approved = true);

update candles
set approved = true
where approved = false;

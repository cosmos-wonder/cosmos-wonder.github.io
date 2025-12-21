-- 投资持仓分析相关表
-- 与 subconscious_tracking 表在同一个 schema (public) 下

-- 1. 出入金记录表
create table public.cash_flow (
  id uuid not null default gen_random_uuid (),
  record_date date not null,
  flow_type varchar(10) not null check (flow_type in ('deposit', 'withdraw')), -- 'deposit' 入金, 'withdraw' 出金
  amount numeric(15, 2) not null, -- 金额，支持小数点后2位
  note text null, -- 备注
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint cash_flow_pkey primary key (id)
) TABLESPACE pg_default;

-- 创建索引以提高查询性能
create index idx_cash_flow_date on public.cash_flow (record_date);
create index idx_cash_flow_type on public.cash_flow (flow_type);

-- 2. 净值记录表
create table public.net_value (
  id uuid not null default gen_random_uuid (),
  record_date date not null,
  net_value numeric(15, 2) not null, -- 净值，支持小数点后2位
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint net_value_pkey primary key (id),
  constraint net_value_record_date_key unique (record_date) -- 每个日期只能有一条净值记录
) TABLESPACE pg_default;

-- 创建索引以提高查询性能
create index idx_net_value_date on public.net_value (record_date);

-- 添加注释
comment on table public.cash_flow is '出入金记录表，记录投资账户的资金流入和流出';
comment on table public.net_value is '净值记录表，记录投资账户的每日净值';

comment on column public.cash_flow.record_date is '记录日期';
comment on column public.cash_flow.flow_type is '资金流向类型：deposit(入金) 或 withdraw(出金)';
comment on column public.cash_flow.amount is '金额（元）';
comment on column public.cash_flow.note is '备注信息';

comment on column public.net_value.record_date is '记录日期（唯一）';
comment on column public.net_value.net_value is '净值（元）';


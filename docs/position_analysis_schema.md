# 投资持仓分析表结构说明

## 表结构

### 1. cash_flow（出入金记录表）

记录投资账户的资金流入和流出。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | uuid | 主键 | PRIMARY KEY, 自动生成 |
| record_date | date | 记录日期 | NOT NULL |
| flow_type | varchar(10) | 资金流向类型 | NOT NULL, CHECK (flow_type IN ('deposit', 'withdraw')) |
| amount | numeric(15, 2) | 金额（元） | NOT NULL, 支持小数点后2位 |
| note | text | 备注 | NULL |
| created_at | timestamp with time zone | 创建时间 | 默认 now() |
| updated_at | timestamp with time zone | 更新时间 | 默认 now() |

**索引：**
- `idx_cash_flow_date`: 按日期索引，提高查询性能
- `idx_cash_flow_type`: 按类型索引

**flow_type 说明：**
- `deposit`: 入金（资金流入）
- `withdraw`: 出金（资金流出）

### 2. net_value（净值记录表）

记录投资账户的每日净值。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | uuid | 主键 | PRIMARY KEY, 自动生成 |
| record_date | date | 记录日期 | NOT NULL, UNIQUE（每个日期只能有一条记录） |
| net_value | numeric(15, 2) | 净值（元） | NOT NULL, 支持小数点后2位 |
| created_at | timestamp with time zone | 创建时间 | 默认 now() |
| updated_at | timestamp with time zone | 更新时间 | 默认 now() |

**索引：**
- `idx_net_value_date`: 按日期索引，提高查询性能

**唯一约束：**
- `record_date`: 每个日期只能有一条净值记录，使用 `upsert` 操作更新

## 使用说明

### 创建表

1. 执行 `position_analysis_tables.sql` 创建表结构
2. 执行 `position_analysis_rls_setup.sql` 配置 RLS 策略

### 数据操作

**出入金记录：**
- 插入：每次有资金流入或流出时插入一条记录
- 更新：可以修改金额、日期、备注等
- 删除：可以删除错误的记录

**净值记录：**
- 插入/更新：使用 `upsert` 操作，如果日期已存在则更新，否则插入
- 删除：可以删除特定日期的净值记录

### 计算逻辑

**累计投入计算：**
```sql
-- 计算到某个日期为止的累计投入
SELECT 
  COALESCE(SUM(CASE WHEN flow_type = 'deposit' THEN amount ELSE -amount END), 0) as total_invested
FROM cash_flow
WHERE record_date <= '2025-12-14';
```

**收益率计算：**
- 累计收益率 = (当前净值 - 累计投入) / 累计投入 * 100%
- 年化收益率 = ((1 + 累计收益率/100) ^ (1/年数) - 1) * 100%

## 注意事项

1. **日期唯一性**：`net_value` 表的 `record_date` 有唯一约束，同一天只能有一条净值记录
2. **数据精度**：金额和净值使用 `numeric(15, 2)`，支持最大 999,999,999,999,999.99 的数值
3. **RLS 策略**：当前设置为允许所有人访问，适合个人网站使用
4. **时区**：`created_at` 和 `updated_at` 使用 `timestamp with time zone`，会自动处理时区


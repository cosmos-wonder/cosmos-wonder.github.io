# 潜意识执行追踪表设计文档

## 表名
`subconscious_tracking`

## 用途
存储用户每天的潜意识执行追踪记录，包括决策、停顿、信号捕捉等信息。

## 表结构

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | UUID | PRIMARY KEY | 主键，自动生成 |
| `user_id` | UUID | FOREIGN KEY, NOT NULL | 用户ID（关联 auth.users） |
| `record_date` | DATE | NOT NULL, UNIQUE | 记录日期 |
| `has_decision` | BOOLEAN | NULL | 关键决策/沟通是否出现 |
| `did_pause` | BOOLEAN | NULL | 是否执行"3秒停顿" |
| `captured_signal` | BOOLEAN | NULL | 是否捕捉到潜意识信号 |
| `respected_signal` | BOOLEAN | NULL | 是否尊重该信号 |
| `reason` | TEXT | NULL | 未执行原因 |
| `reflection` | TEXT | NULL | 当天一句反思 |
| `created_at` | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | 更新时间 |

## 索引

1. `idx_subconscious_tracking_user_id` - 用户ID索引
2. `idx_subconscious_tracking_date` - 日期索引
3. `idx_subconscious_tracking_user_date` - 用户+日期复合索引

## 约束

- **唯一约束**：`(user_id, record_date)` - 同一用户同一天只能有一条记录
- **外键约束**：`user_id` 关联 `auth.users(id)`

## 触发器

- `update_subconscious_tracking_updated_at` - 自动更新 `updated_at` 字段

## 单用户版本

如果网站是单用户使用，可以简化表结构，移除 `user_id` 字段：

```sql
CREATE TABLE subconscious_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_date DATE NOT NULL UNIQUE,
  has_decision BOOLEAN,
  did_pause BOOLEAN,
  captured_signal BOOLEAN,
  respected_signal BOOLEAN,
  reason TEXT,
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 在 Supabase 中创建表

### 方法1：使用 SQL Editor

1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 复制 `subconscious_tracking_table.sql` 中的 SQL 代码
4. 执行 SQL

### 方法2：使用 Table Editor

1. 登录 Supabase Dashboard
2. 进入 Table Editor
3. 点击 "New Table"
4. 按照以下配置创建表：

**表名**：`subconscious_tracking`

**字段配置**：
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (uuid, foreign key → auth.users.id)
- `record_date` (date, not null)
- `has_decision` (boolean)
- `did_pause` (boolean)
- `captured_signal` (boolean)
- `respected_signal` (boolean)
- `reason` (text)
- `reflection` (text)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

**唯一约束**：
- 添加约束：`unique_user_date` on `(user_id, record_date)`

**索引**：
- `idx_subconscious_tracking_user_id` on `user_id`
- `idx_subconscious_tracking_date` on `record_date`
- `idx_subconscious_tracking_user_date` on `(user_id, record_date)`

## Row Level Security (RLS) 策略

建议启用 RLS 并设置策略：

```sql
-- 启用 RLS
ALTER TABLE subconscious_tracking ENABLE ROW LEVEL SECURITY;

-- 策略：用户只能查看和修改自己的记录
CREATE POLICY "Users can view own records"
  ON subconscious_tracking
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records"
  ON subconscious_tracking
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records"
  ON subconscious_tracking
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own records"
  ON subconscious_tracking
  FOR DELETE
  USING (auth.uid() = user_id);
```

## API 使用示例

### 插入记录
```javascript
const { data, error } = await supabase
  .from('subconscious_tracking')
  .insert({
    user_id: userId,
    record_date: '2025-01-15',
    has_decision: true,
    did_pause: true,
    captured_signal: true,
    respected_signal: true,
    reason: '当时其实犹豫了',
    reflection: '今天很好地捕捉到了潜意识信号'
  });
```

### 查询记录
```javascript
const { data, error } = await supabase
  .from('subconscious_tracking')
  .select('*')
  .eq('user_id', userId)
  .order('record_date', { ascending: false });
```

### 更新记录
```javascript
const { data, error } = await supabase
  .from('subconscious_tracking')
  .update({ reflection: '更新后的反思' })
  .eq('id', recordId);
```

### 删除记录
```javascript
const { data, error } = await supabase
  .from('subconscious_tracking')
  .delete()
  .eq('id', recordId);
```


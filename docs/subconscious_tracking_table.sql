-- 潜意识执行追踪表
-- 用于存储用户每天的决策追踪记录

CREATE TABLE IF NOT EXISTS subconscious_tracking (
  -- 主键
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 用户标识（如果支持多用户，可以使用 auth.users 的 id）
  -- 如果单用户，可以设为固定值或移除
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 记录日期
  record_date DATE NOT NULL,
  
  -- 关键决策/沟通是否出现
  has_decision BOOLEAN,
  
  -- 是否执行"3秒停顿"
  did_pause BOOLEAN,
  
  -- 是否捕捉到潜意识信号
  captured_signal BOOLEAN,
  
  -- 是否尊重该信号
  respected_signal BOOLEAN,
  
  -- 未执行原因（可选）
  reason TEXT,
  
  -- 当天一句反思
  reflection TEXT,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 唯一约束：同一用户同一天只能有一条记录
  -- 如果单用户，可以改为：UNIQUE(record_date)
  CONSTRAINT unique_user_date UNIQUE(user_id, record_date)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_subconscious_tracking_user_id ON subconscious_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_subconscious_tracking_date ON subconscious_tracking(record_date);
CREATE INDEX IF NOT EXISTS idx_subconscious_tracking_user_date ON subconscious_tracking(user_id, record_date);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subconscious_tracking_updated_at
  BEFORE UPDATE ON subconscious_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 策略配置（单用户场景）
-- 由于表结构中没有 user_id，需要允许所有人访问

-- 如果 RLS 已启用，需要设置策略允许所有操作
-- 在 Supabase Dashboard > Authentication > Policies 中配置，或执行以下 SQL：

/*
-- 启用 RLS（如果还未启用）
ALTER TABLE subconscious_tracking ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取
CREATE POLICY "Allow public read"
  ON subconscious_tracking
  FOR SELECT
  USING (true);

-- 允许所有人插入
CREATE POLICY "Allow public insert"
  ON subconscious_tracking
  FOR INSERT
  WITH CHECK (true);

-- 允许所有人更新
CREATE POLICY "Allow public update"
  ON subconscious_tracking
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 允许所有人删除
CREATE POLICY "Allow public delete"
  ON subconscious_tracking
  FOR DELETE
  USING (true);
*/

-- 或者，如果不需要 RLS，可以在 Supabase Dashboard 中禁用 RLS
-- ALTER TABLE subconscious_tracking DISABLE ROW LEVEL SECURITY;


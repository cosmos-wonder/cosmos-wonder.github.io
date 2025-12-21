-- Supabase RLS 策略配置
-- 用于单用户场景的 subconscious_tracking 表

-- 检查 RLS 是否已启用
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'subconscious_tracking';

-- 如果 RLS 已启用，需要设置策略允许所有操作
-- 如果 RLS 未启用，可以跳过此文件

-- 方案 1：启用 RLS 并允许所有人访问（推荐用于单用户场景）
ALTER TABLE subconscious_tracking ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果有）
DROP POLICY IF EXISTS "Allow public read" ON subconscious_tracking;
DROP POLICY IF EXISTS "Allow public insert" ON subconscious_tracking;
DROP POLICY IF EXISTS "Allow public update" ON subconscious_tracking;
DROP POLICY IF EXISTS "Allow public delete" ON subconscious_tracking;

-- 创建新策略：允许所有人读取
CREATE POLICY "Allow public read"
  ON subconscious_tracking
  FOR SELECT
  USING (true);

-- 创建新策略：允许所有人插入
CREATE POLICY "Allow public insert"
  ON subconscious_tracking
  FOR INSERT
  WITH CHECK (true);

-- 创建新策略：允许所有人更新
CREATE POLICY "Allow public update"
  ON subconscious_tracking
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 创建新策略：允许所有人删除
CREATE POLICY "Allow public delete"
  ON subconscious_tracking
  FOR DELETE
  USING (true);

-- 方案 2：如果不需要 RLS，可以禁用（不推荐，但更简单）
-- ALTER TABLE subconscious_tracking DISABLE ROW LEVEL SECURITY;


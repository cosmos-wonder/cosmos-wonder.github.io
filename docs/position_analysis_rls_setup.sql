-- 投资持仓分析表的 Row Level Security (RLS) 设置
-- 与 subconscious_tracking 表使用相同的策略：允许所有人访问（因为这是个人网站）

-- 1. 启用 RLS
ALTER TABLE public.cash_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.net_value ENABLE ROW LEVEL SECURITY;

-- 2. 删除现有策略（如果有）
DROP POLICY IF EXISTS "Allow public read" ON public.cash_flow;
DROP POLICY IF EXISTS "Allow public insert" ON public.cash_flow;
DROP POLICY IF EXISTS "Allow public update" ON public.cash_flow;
DROP POLICY IF EXISTS "Allow public delete" ON public.cash_flow;

DROP POLICY IF EXISTS "Allow public read" ON public.net_value;
DROP POLICY IF EXISTS "Allow public insert" ON public.net_value;
DROP POLICY IF EXISTS "Allow public update" ON public.net_value;
DROP POLICY IF EXISTS "Allow public delete" ON public.net_value;

-- 3. 创建策略：允许所有人 SELECT（读取）
CREATE POLICY "Allow public read"
  ON public.cash_flow
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read"
  ON public.net_value
  FOR SELECT
  USING (true);

-- 4. 创建策略：允许所有人 INSERT（插入）
CREATE POLICY "Allow public insert"
  ON public.cash_flow
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert"
  ON public.net_value
  FOR INSERT
  WITH CHECK (true);

-- 5. 创建策略：允许所有人 UPDATE（更新）
CREATE POLICY "Allow public update"
  ON public.cash_flow
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON public.net_value
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 6. 创建策略：允许所有人 DELETE（删除）
CREATE POLICY "Allow public delete"
  ON public.cash_flow
  FOR DELETE
  USING (true);

CREATE POLICY "Allow public delete"
  ON public.net_value
  FOR DELETE
  USING (true);


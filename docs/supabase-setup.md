# Supabase 数据库连接配置指南

## 步骤 1：获取 Supabase API Key

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 找到以下信息：
   - **Project URL**: `https://nsdupgglfhqgwttkxsoo.supabase.co`（已配置）
   - **anon public key**: 复制这个 key（需要配置）

## 步骤 2：配置 API Key

打开文件 `thinking/subconscious.html`，找到以下代码（大约在第 904 行）：

```javascript
supabaseClient = supabase.createClient(
  'https://nsdupgglfhqgwttkxsoo.supabase.co',
  'YOUR_SUPABASE_ANON_KEY' // 需要替换为实际的 anon key
);
```

将 `YOUR_SUPABASE_ANON_KEY` 替换为你从 Supabase Dashboard 复制的 **anon public key**。

## 步骤 3：验证连接

1. 打开 `thinking/subconscious.html` 页面
2. 打开浏览器开发者工具（F12）
3. 查看 Console 标签
4. 如果看到 "Supabase 客户端初始化成功"，说明连接成功

## 数据存储说明

### 数据库存储（主要）
- 数据保存在 Supabase 数据库的 `subconscious_tracking` 表中
- 数据持久化，不会丢失
- 可以在 Supabase Dashboard 中查看和管理数据

### LocalStorage 存储（备份）
- 同时保存到浏览器 localStorage 作为备份
- 如果数据库连接失败，会自动使用 localStorage
- 清除浏览器缓存会丢失 localStorage 数据

## 功能说明

### 自动保存
- 每次修改表格内容后，自动保存到数据库
- 新记录会自动插入数据库
- 已有记录会自动更新

### 数据加载
- 页面加载时自动从数据库读取所有记录
- 按日期倒序排列（最新的在前）
- 如果数据库为空，会显示一行空白记录

### 删除功能
- 删除记录会同时从数据库和 localStorage 中删除
- 删除前会弹出确认对话框

## 故障排除

### 问题：数据没有保存到数据库

**可能原因：**
1. API Key 未正确配置
2. 网络连接问题
3. Supabase RLS 策略限制

**解决方法：**
1. 检查 API Key 是否正确
2. 检查浏览器控制台是否有错误信息
3. 如果使用 RLS，确保策略允许插入和更新

### 问题：控制台显示 "Supabase 客户端库未加载"

**解决方法：**
- 确保网络连接正常，Supabase CDN 可以访问
- 检查是否有广告拦截器阻止了 CDN 请求

### 问题：数据只保存在 localStorage

**可能原因：**
- Supabase 客户端初始化失败
- API Key 配置错误

**解决方法：**
- 检查浏览器控制台的错误信息
- 验证 API Key 是否正确
- 数据仍会保存在 localStorage 作为备份

## 安全建议

### API Key 安全
- **anon key** 是公开的，可以放在前端代码中
- 不要使用 **service_role key**（有完整权限）
- 建议启用 Row Level Security (RLS) 策略

### RLS 策略设置（可选）

如果表中有 `user_id` 字段，建议设置 RLS：

```sql
-- 启用 RLS
ALTER TABLE subconscious_tracking ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取和写入（单用户场景）
CREATE POLICY "Allow all operations"
  ON subconscious_tracking
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

如果不需要 RLS，可以在 Supabase Dashboard 中禁用。

## 测试连接

在浏览器控制台中运行以下代码测试连接：

```javascript
// 测试查询
const { data, error } = await supabaseClient
  .from('subconscious_tracking')
  .select('*')
  .limit(1);

if (error) {
  console.error('连接失败:', error);
} else {
  console.log('连接成功!', data);
}
```

## 下一步

配置完成后，你的追踪数据将：
- ✅ 自动保存到 Supabase 数据库
- ✅ 支持多设备访问（如果配置了用户认证）
- ✅ 数据持久化，不会丢失
- ✅ 可以在 Supabase Dashboard 中查看和管理


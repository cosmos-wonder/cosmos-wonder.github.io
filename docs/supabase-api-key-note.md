# Supabase API Key 配置说明

## ⚠️ 重要提示

你当前使用的 `xeTYzEuIuYt4oE3u` 看起来像是数据库密码，而不是 Supabase API Key。

## 如何获取正确的 API Key

### Supabase API Key (anon public key)

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 找到 **Project API keys** 部分
5. 复制 **anon public** key（这是一个很长的 JWT token，通常以 `eyJ` 开头）

### 数据库连接字符串 vs API Key

- **数据库连接字符串**（你提供的）：
  ```
  postgresql://postgres:xeTYzEuIuYt4oE3u@db.nsdupgglfhqgwttkxsoo.supabase.co:5432/postgres
  ```
  这是用于直接连接 PostgreSQL 数据库的，**不能**用于 Supabase JS 客户端。

- **Supabase API Key**（需要的）：
  这是用于 Supabase JS 客户端的前端 API key，从 Dashboard 获取。

## 更新配置

在 `thinking/subconscious.html` 文件中，找到：

```javascript
supabaseClient = supabase.createClient(
  'https://nsdupgglfhqgwttkxsoo.supabase.co',
  'xeTYzEuIuYt4oE3u' // 替换为从 Dashboard 获取的 anon public key
);
```

将 `xeTYzEuIuYt4oE3u` 替换为从 Supabase Dashboard 复制的 **anon public key**。

## 验证配置

配置完成后，打开浏览器控制台（F12），应该看到：
- ✅ "Supabase 客户端初始化成功"
- ❌ 如果看到错误，检查 API key 是否正确


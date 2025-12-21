# 标普500数据API配置指南

本页面支持显示标普500指数的收益率曲线，用于与您的投资表现进行对比。以下是可用的免费API选项：

## 推荐方案

### 方案1: Alpha Vantage (推荐) ⭐

**优点：**
- 免费，注册即可使用
- 稳定可靠
- 提供完整的历史数据
- 无需信用卡

**注册步骤：**
1. 访问 https://www.alphavantage.co/support/#api-key
2. 填写邮箱和公司名称（可填个人）
3. 点击 "GET FREE API KEY"
4. 复制获得的API key

**配置方法：**
在 `investment/position-analysis.html` 文件中，找到以下代码：
```javascript
const ALPHA_VANTAGE_API_KEY = ''; // 请在这里填入你的API key
```
将您的API key填入引号中即可。

**限制：**
- 免费版：每分钟5次请求，每天500次请求
- 对于个人使用完全足够

---

### 方案2: Polygon.io

**优点：**
- 免费层提供充足的数据
- 数据质量高

**注册步骤：**
1. 访问 https://polygon.io/
2. 注册免费账户
3. 在Dashboard中获取API key

**配置方法：**
在 `investment/position-analysis.html` 文件中，找到以下代码：
```javascript
const POLYGON_API_KEY = ''; // 请在这里填入你的API key
```
将您的API key填入引号中即可。

**限制：**
- 免费版：每分钟5次请求

---

### 方案3: Yahoo Finance (备用方案)

**优点：**
- 无需注册
- 数据丰富

**缺点：**
- 可能遇到CORS跨域问题
- 稳定性不如官方API

**说明：**
代码中已包含通过CORS代理访问Yahoo Finance的实现，如果前两个方案都不可用，可以尝试此方案。

---

## 使用说明

1. **选择API方案**：推荐使用 Alpha Vantage，注册简单且稳定
2. **配置API Key**：在代码中填入您的API key
3. **刷新页面**：配置完成后刷新页面，标普500数据将自动加载
4. **查看图表**：在"收益率曲线"模式下，可以看到您的收益率与标普500的对比

## 数据说明

- **标普500 (S&P 500)**：美国500家大型上市公司的股票指数，广泛代表美国股市整体表现
- **长期年化收益率**：约10.26%
- **数据更新**：每日更新（取决于API提供商）

## 注意事项

- API key是敏感信息，请妥善保管
- 如果使用GitHub Pages等公开仓库，建议使用环境变量或后端代理来保护API key
- 免费API通常有请求频率限制，请合理使用

## 故障排查

如果标普500数据没有显示：

1. **检查API key**：确认已正确填入API key
2. **查看浏览器控制台**：按F12打开开发者工具，查看是否有错误信息
3. **检查网络连接**：确保可以访问API服务
4. **尝试其他API**：如果某个API不可用，可以尝试其他方案

## 相关链接

- [Alpha Vantage 官网](https://www.alphavantage.co/)
- [Polygon.io 官网](https://polygon.io/)
- [标普500 Wikipedia](https://zh.wikipedia.org/wiki/S%26P_500)


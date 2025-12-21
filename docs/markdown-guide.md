# Markdown 工具包使用指南

这是一个通用的 Markdown 渲染工具包，可以在任何 HTML 页面中使用，支持将 Markdown 格式的文本自动转换为 HTML。

## 快速开始

### 1. 引入必要的文件

在 HTML 页面的 `<head>` 部分添加：

```html
<!-- Markdown 样式 -->
<link rel="stylesheet" href="css/markdown.css">

<!-- Markdown 解析器 (marked.js) -->
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
```

在 `</body>` 之前添加：

```html
<!-- Markdown 渲染器 -->
<script src="js/markdown-renderer.js"></script>
```

**注意**：如果页面在子目录中，需要调整路径，例如：
- `../css/markdown.css`
- `../js/markdown-renderer.js`

### 2. 使用 Markdown

在 HTML 中使用 `data-markdown` 属性标记需要渲染的内容：

```html
<div class="markdown-content" data-markdown>
# 标题

这是段落文本。

**加粗文本** 和 *斜体文本*

- 列表项 1
- 列表项 2

> 这是引用

```代码块```
</div>
```

## 支持的 Markdown 语法

工具包支持标准的 Markdown 语法，包括：

- **标题**：`# H1`, `## H2`, `### H3` 等
- **强调**：`**粗体**`, `*斜体*`, `~~删除线~~`
- **列表**：有序列表和无序列表
- **链接**：`[文本](URL)`
- **图片**：`![alt](URL)`
- **引用**：`> 引用内容`
- **代码**：行内代码 `` `code` `` 和代码块
- **表格**：Markdown 表格语法
- **水平线**：`---` 或 `***`
- **任务列表**：`- [ ]` 和 `- [x]`

## 示例

### 基本示例

```html
<main>
  <section>
    <h1>文章标题</h1>
    
    <div class="markdown-content" data-markdown>
## 章节标题

这是一段文字，可以包含 **加粗** 和 *斜体*。

### 子章节

- 列表项 1
- 列表项 2
- 列表项 3

> 这是一段引用文字。

```javascript
function hello() {
  console.log('Hello, World!');
}
```
    </div>
  </section>
</main>
```

### 多个 Markdown 区域

一个页面可以有多个 Markdown 区域：

```html
<div class="markdown-content" data-markdown>
第一段 Markdown 内容
</div>

<div class="markdown-content" data-markdown>
第二段 Markdown 内容
</div>
```

## 高级用法

### 手动触发渲染

如果需要动态添加 Markdown 内容，可以手动触发渲染：

```javascript
// 渲染所有标记的元素
MarkdownRenderer.renderAll();

// 渲染特定元素
const element = document.querySelector('.my-markdown');
MarkdownRenderer.render(element);
```

### 监听渲染完成事件

```javascript
document.querySelectorAll('[data-markdown]').forEach(function(element) {
  element.addEventListener('markdown:rendered', function(event) {
    console.log('Markdown 已渲染', event.detail);
  });
});
```

## 样式自定义

如果需要自定义样式，可以覆盖 `css/markdown.css` 中的样式，或者添加额外的 CSS：

```css
/* 自定义 Markdown 样式 */
.markdown-content {
  /* 你的自定义样式 */
}

.markdown-content h1 {
  /* 自定义标题样式 */
}
```

## 注意事项

1. **路径问题**：确保 CSS 和 JS 文件的路径正确，特别是在子目录中的页面
2. **加载顺序**：必须先加载 `marked.js`，再加载 `markdown-renderer.js`
3. **内容安全**：Markdown 会被转换为 HTML，确保内容来源可信
4. **性能**：大量 Markdown 内容可能影响页面加载速度

## 文件结构

```
cosmos-wonder.github.io/
├── css/
│   └── markdown.css          # Markdown 样式文件
├── js/
│   └── markdown-renderer.js  # Markdown 渲染器
└── docs/
    └── markdown-guide.md     # 本使用指南
```

## 故障排除

### Markdown 没有渲染

1. 检查浏览器控制台是否有错误
2. 确认 `marked.js` 已正确加载
3. 确认 `markdown-renderer.js` 已正确加载
4. 确认元素有 `data-markdown` 属性

### 样式不正确

1. 确认 `markdown.css` 已正确引入
2. 检查是否有其他 CSS 覆盖了样式
3. 检查路径是否正确

### 代码高亮不工作

当前版本不包含代码高亮功能。如需代码高亮，可以集成 `highlight.js` 或 `Prism.js`。

## 更新日志

- **v1.0.0** (2025-01-XX): 初始版本，支持基本 Markdown 渲染


/**
 * Markdown 渲染工具
 * 使用方法：
 * 1. 在页面中引入 marked.js: <script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
 * 2. 引入此文件: <script src="js/markdown-renderer.js"></script>
 * 3. 引入样式: <link rel="stylesheet" href="css/markdown.css">
 * 4. 在 HTML 中使用: <div class="markdown-content" data-markdown>你的 Markdown 内容</div>
 */

(function() {
  'use strict';

  // 检查 marked 是否已加载
  if (typeof marked === 'undefined') {
    console.error('Markdown Renderer: marked.js 未加载。请先引入 marked.js');
    return;
  }

  // 配置 marked 选项
  marked.setOptions({
    breaks: true,        // 支持 GitHub 风格的换行
    gfm: true,           // 启用 GitHub 风格的 Markdown
    headerIds: true,     // 为标题生成 ID
    mangle: false,       // 不混淆邮箱地址
    pedantic: false,     // 不使用原始 Markdown.pl 的行为
    sanitize: false,     // 不清理 HTML
    smartLists: true,    // 使用智能列表
    smartypants: false,  // 不使用智能标点
    xhtml: false         // 不使用 XHTML 自闭合标签
  });

  /**
   * 渲染单个 Markdown 元素
   * @param {HTMLElement} element - 包含 Markdown 内容的元素
   */
  function renderMarkdown(element) {
    if (!element || !element.hasAttribute('data-markdown')) {
      return;
    }

    try {
      // 获取原始 Markdown 文本
      const markdown = element.textContent.trim();
      
      if (!markdown) {
        return;
      }

      // 转换为 HTML
      const html = marked.parse(markdown);
      
      // 设置转换后的 HTML
      element.innerHTML = html;
      
      // 添加已渲染标记
      element.classList.add('markdown-rendered');
      
      // 触发自定义事件，方便其他脚本监听
      const event = new CustomEvent('markdown:rendered', {
        detail: { element: element, markdown: markdown, html: html }
      });
      element.dispatchEvent(event);
      
    } catch (error) {
      console.error('Markdown 渲染错误:', error);
      element.classList.add('markdown-error');
      element.innerHTML = '<p style="color: red;">Markdown 渲染失败: ' + error.message + '</p>';
    }
  }

  /**
   * 渲染页面中所有标记为 Markdown 的元素
   */
  function renderAllMarkdown() {
    const elements = document.querySelectorAll('[data-markdown]');
    elements.forEach(renderMarkdown);
  }

  /**
   * 初始化 Markdown 渲染器
   */
  function init() {
    // 如果 DOM 已加载完成，直接渲染
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderAllMarkdown);
    } else {
      renderAllMarkdown();
    }
  }

  // 自动初始化
  init();

  // 导出公共 API（可选，用于手动控制）
  window.MarkdownRenderer = {
    render: renderMarkdown,
    renderAll: renderAllMarkdown
  };

})();


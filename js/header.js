// 通用头部组件
(function() {
  'use strict';

  // 获取当前页面路径，用于设置活动链接
  function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename;
  }

  // 生成导航栏 HTML
  function generateNav(currentPage) {
    const navItems = [
      { href: 'index.html', text: '首页', id: 'home' },
      { href: 'about.html', text: '关于我', id: 'about' },
      { href: 'investment.html', text: '投资记录', id: 'investment' }
    ];

    let navHTML = '<ul>';
    navItems.forEach(item => {
      const isActive = currentPage === item.href || 
                      (item.id === 'home' && (currentPage === 'index.html' || currentPage === '')) ||
                      (item.id === 'about' && currentPage.startsWith('about')) ||
                      (item.id === 'investment' && currentPage.startsWith('investment'));
      
      const activeClass = isActive ? ' class="active"' : '';
      navHTML += `<li><a href="${item.href}"${activeClass}>${item.text}</a></li>`;
    });

    // 添加语言切换器
    navHTML += `
      <li>
        <select id="lang-switcher">
          <option value="traditional">繁體中文</option>
          <option value="simplified">简体中文</option>
        </select>
      </li>
    `;
    navHTML += '</ul>';

    return navHTML;
  }

  // 生成头部 HTML
  function generateHeader() {
    const currentPage = getCurrentPage();
    
    return `
      <header>
        <div class="header-container">
          <div class="logo-container">
            <div class="logo-text-container">
              <div class="logo-text">Cosmos of WW</div>
              <div class="logo-subtitle">Along with Probability</div>
            </div>
          </div>
          <nav>
            ${generateNav(currentPage)}
          </nav>
        </div>
      </header>
    `;
  }

  // 插入头部到页面
  function insertHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.outerHTML = generateHeader();
    } else {
      // 如果没有占位符，尝试在 body 开头插入
      const body = document.body;
      if (body) {
        body.insertAdjacentHTML('afterbegin', generateHeader());
      }
    }
  }

  // 页面加载完成后插入头部
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertHeader);
  } else {
    insertHeader();
  }
})();


// 简繁转换映射表（常用字词）
const conversionMap = {
  // 导航和常用词
  '简体': '簡體',
  '繁体': '繁體',
  '首页': '首頁',
  '读书笔记': '讀書筆記',
  '投资记录': '投資記錄',
  '话题思考': '話題思考',
  '英语学习': '英語學習',
  '欢迎来到我的思想宇宙': '歡迎來到我的思想宇宙',
  '这里是我记录个人所思所想、感悟总结的空间。包括读书笔记、投资记录、对各种话题的关注和思考，以及英语学习等内容。': '這裡是我記錄個人所思所想、感悟總結的空間。包括讀書筆記、投資記錄、對各種話題的關注和思考，以及英語學習等內容。',
  '了解更多关于我': '了解更多關於我',
  '记录阅读过程中的思考、感悟和总结': '記錄閱讀過程中的思考、感悟和總結',
  '技术类书籍': '技術類書籍',
  '商业与投资': '商業與投資',
  '人文社科': '人文社科',
  '个人成长': '個人成長',
  '查看笔记': '查看筆記',
  '记录投资学习与实践过程中的思考与总结': '記錄投資學習與實踐過程中的思考與總結',
  '市场观察': '市場觀察',
  '投资策略': '投資策略',
  '案例分析': '案例分析',
  '心得体会': '心得體會',
  '查看记录': '查看記錄',
  '对各种话题的关注、思考和深度分析': '對各種話題的關注、思考和深度分析',
  '科技趋势': '科技趨勢',
  '社会现象': '社會現象',
  '人生感悟': '人生感悟',
  '行业观察': '行業觀察',
  '查看思考': '查看思考',
  '记录英语学习过程中的笔记和心得': '記錄英語學習過程中的筆記和心得',
  '词汇积累': '詞彙積累',
  '语法笔记': '語法筆記',
  '阅读材料': '閱讀材料',
  '学习心得': '學習心得',
  '查看学习': '查看學習',
  '记录思考，分享成长': '記錄思考，分享成長',
  '返回首页': '返回首頁',
  '关注自己需要关注的': '關注自己需要關注的',
  '希望通过这个平台，能够系统地整理和分享我的学习与思考历程。': '希望通過這個平台，能夠系統地整理和分享我的學習與思考歷程。',
  'Cosmos of WW - 我的思想宇宙': 'Cosmos of WW - 我的思想宇宙',
  '关于我 - Cosmos of WW': '關於我 - Cosmos of WW',
  '以一种审慎的态度，思考自己的人生。': '以一種審慎的態度，思考自己的人生。',
  '关于我': '關於我'
};

// 创建反向映射
const reverseMap = {};
Object.keys(conversionMap).forEach(key => {
  reverseMap[conversionMap[key]] = key;
});

// 简繁转换函数
function convertText(text, toTraditional) {
  if (!text) return text;
  
  let result = text;
  const map = toTraditional ? conversionMap : reverseMap;
  
  // 按长度排序，先匹配长的短语
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  
  sortedKeys.forEach(key => {
    if (result.includes(key)) {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, map[key]);
    }
  });
  
  return result;
}

// 转换页面文本
function convertPage(toTraditional) {
  // 转换所有文本节点
  function convertNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text && text.trim().length > 0) {
        const parent = node.parentElement;
        if (parent && parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE' && parent.id !== 'lang-switcher') {
          node.textContent = convertText(text, toTraditional);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.id !== 'lang-switcher') {
        Array.from(node.childNodes).forEach(convertNode);
      }
    }
  }

  // 转换页面内容
  const body = document.body;
  Array.from(body.childNodes).forEach(convertNode);

  // 转换 title
  if (document.title) {
    document.title = convertText(document.title, toTraditional);
  }

  // 转换 input 和 textarea 的 placeholder
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
    el.placeholder = convertText(el.placeholder, toTraditional);
  });

  // 更新下拉列表选中值
  const langSelect = document.getElementById('lang-switcher');
  if (langSelect) {
    langSelect.value = toTraditional ? 'traditional' : 'simplified';
  }
}

// 初始化语言设置
function initLanguage() {
  // 默认繁体中文
  const savedLang = localStorage.getItem('language') || 'traditional';
  const isTraditional = savedLang === 'traditional';
  
  // 设置下拉列表的默认值
  const langSelect = document.getElementById('lang-switcher');
  if (langSelect) {
    langSelect.value = savedLang;
  }
  
  if (isTraditional) {
    // 延迟执行以确保页面完全加载
    setTimeout(() => {
      convertPage(true);
    }, 100);
  }
}

// 切换语言
function changeLanguage() {
  const langSelect = document.getElementById('lang-switcher');
  if (!langSelect) return;
  
  const newLang = langSelect.value;
  localStorage.setItem('language', newLang);
  
  // 重新加载页面以应用转换
  location.reload();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initLanguage();
    
    // 绑定下拉列表变化事件
    const langSelect = document.getElementById('lang-switcher');
    if (langSelect) {
      langSelect.addEventListener('change', changeLanguage);
    }
  });
} else {
  initLanguage();
  
  // 绑定下拉列表变化事件
  const langSelect = document.getElementById('lang-switcher');
  if (langSelect) {
    langSelect.addEventListener('change', changeLanguage);
  }
}

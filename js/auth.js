/**
 * 认证和权限管理模块
 * 使用 GitHub OAuth 进行身份验证
 */

// 配置
const AUTH_CONFIG = {
  // GitHub OAuth App Client ID（需要在 GitHub 创建 OAuth App）
  // 创建地址：https://github.com/settings/developers
  GITHUB_CLIENT_ID: 'YOUR_GITHUB_CLIENT_ID', // 需要替换
  
  // 后端 API 地址
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8787'
    : 'https://blog-backend.cxmwwb.workers.dev',
  
  // 存储 key
  STORAGE_KEY_TOKEN: 'github_token',
  STORAGE_KEY_USER: 'user_info',
  STORAGE_KEY_ROLE: 'user_role',
  STORAGE_KEY_VIEW_MODE: 'view_mode', // 'admin' 或 'guest'，用于 admin 切换到 guest 模式
};

// 当前用户状态
let currentUser = null;
let currentRole = 'guest';
let viewMode = 'guest'; // 实际显示模式（admin 可以切换到 guest 模式）

// 初始化认证
async function initAuth() {
  // 从 localStorage 恢复状态
  const savedToken = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_TOKEN);
  const savedUser = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_USER);
  const savedRole = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_ROLE);
  const savedViewMode = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_VIEW_MODE);

  if (savedToken && savedUser) {
    currentUser = JSON.parse(savedUser);
    currentRole = savedRole || 'guest';
    viewMode = savedViewMode || currentRole;
    
    // 验证 token 是否仍然有效
    try {
      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: savedToken }),
      });

      if (response.ok) {
        const data = await response.json();
        currentUser = data.user;
        currentRole = data.role;
        viewMode = savedViewMode || currentRole;
        updateAuthUI();
        return;
      }
    } catch (e) {
      console.error('Auth verification failed:', e);
    }
  }

  // 如果没有有效 token，清除状态
  clearAuth();
  updateAuthUI();
}

// GitHub OAuth 登录（简化版：直接输入 token）
function loginWithGitHub() {
  loginWithToken();
}

// 处理 OAuth 回调
async function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const savedState = sessionStorage.getItem('oauth_state');

  if (!code || !state || state !== savedState) {
    return false;
  }

  // 清除 URL 参数
  window.history.replaceState({}, document.title, window.location.pathname);
  sessionStorage.removeItem('oauth_state');

  try {
    // 通过后端交换 code 获取 token（需要后端实现 /api/auth/callback）
    // 或者直接使用 GitHub API 交换（需要 client_secret，不安全）
    // 这里简化处理：提示用户手动输入 token 或使用 GitHub Personal Access Token
    
    // 临时方案：使用 GitHub Personal Access Token
    // 用户需要在 GitHub Settings > Developer settings > Personal access tokens 创建 token
    const token = prompt('请输入你的 GitHub Personal Access Token:\n\n创建地址：https://github.com/settings/tokens\n权限：只需要 read:user');
    
    if (token) {
      await authenticateWithToken(token);
    }
  } catch (e) {
    console.error('OAuth callback failed:', e);
    alert('登录失败，请重试');
  }

  return true;
}

// 使用 token 认证
async function authenticateWithToken(token) {
  try {
    const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    currentUser = data.user;
    currentRole = data.role;
    viewMode = currentRole;

    // 保存到 localStorage
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_TOKEN, token);
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_USER, JSON.stringify(currentUser));
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_ROLE, currentRole);
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_VIEW_MODE, viewMode);

    updateAuthUI();
    return true;
  } catch (e) {
    console.error('Authentication failed:', e);
    alert('认证失败，请检查 token 是否正确\n\n获取 Token:\n1. 访问 https://github.com/settings/tokens\n2. 创建 Personal Access Token (classic)\n3. 权限：只需要 read:user');
    return false;
  }
}

// 简化登录：直接输入 token
function loginWithToken() {
  const token = prompt('请输入你的 GitHub Personal Access Token:\n\n获取方式：\n1. 访问 https://github.com/settings/tokens\n2. 点击 "Generate new token (classic)"\n3. 权限选择：read:user\n4. 复制生成的 token');
  
  if (token && token.trim()) {
    authenticateWithToken(token.trim());
  }
}

// 登出
function logout() {
  clearAuth();
  updateAuthUI();
  // 重新加载页面以应用权限变化
  window.location.reload();
}

// 清除认证信息
function clearAuth() {
  currentUser = null;
  currentRole = 'guest';
  viewMode = 'guest';
  localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_TOKEN);
  localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_USER);
  localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_ROLE);
  localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_VIEW_MODE);
}

// 切换视图模式（admin 可以切换到 guest 模式）
function toggleViewMode() {
  if (currentRole === 'admin') {
    viewMode = viewMode === 'admin' ? 'guest' : 'admin';
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEY_VIEW_MODE, viewMode);
    updateAuthUI();
    // 重新加载数据以应用权限变化
    if (typeof loadData === 'function') {
      loadData();
    }
    if (typeof loadTrackingData === 'function') {
      loadTrackingData();
    }
  }
}

// 获取当前有效角色（考虑 viewMode）
function getEffectiveRole() {
  return viewMode;
}

// 检查是否是 admin
function isAdmin() {
  return getEffectiveRole() === 'admin';
}

// 检查是否是 guest
function isGuest() {
  return getEffectiveRole() === 'guest';
}

// 获取认证 token（用于 API 请求）
function getAuthToken() {
  return localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_TOKEN);
}

// 生成随机 state
function generateState() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 更新认证 UI
function updateAuthUI() {
  // 触发自定义事件，让页面更新 UI
  const event = new CustomEvent('authStateChanged', {
    detail: {
      user: currentUser,
      role: currentRole,
      viewMode: viewMode,
      isAdmin: isAdmin(),
    },
  });
  document.dispatchEvent(event);
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    handleOAuthCallback().then(handled => {
      if (!handled) {
        initAuth();
      }
    });
  });
} else {
  handleOAuthCallback().then(handled => {
    if (!handled) {
      initAuth();
    }
  });
}

// 导出函数
window.auth = {
  initAuth,
  loginWithGitHub,
  loginWithToken,
  authenticateWithToken,
  logout,
  toggleViewMode,
  getEffectiveRole,
  isAdmin,
  isGuest,
  getAuthToken,
  getCurrentUser: () => currentUser,
  getCurrentRole: () => currentRole,
  getViewMode: () => viewMode,
};


#!/usr/bin/env node

/**
 * 监控文件变化并自动重启服务器
 * 检测到变更后等待 10 秒再重启
 */

const { spawn, exec } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

const PORT = 8000;
let serverProcess = null;
let restartTimeout = null;

// 忽略的文件和目录
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.DS_Store',
  '*.log',
  '*.tmp',
  'package-lock.json'
];

// 启动服务器
function startServer() {
  console.log('\n🚀 正在启动服务器...');
  console.log(`📡 访问地址: http://localhost:${PORT}`);
  console.log('📝 默认首页: index.html');
  console.log('👀 正在监控文件变化...\n');
  
  serverProcess = spawn('http-server', ['-p', PORT, '-c-1'], {
    stdio: 'inherit',
    shell: true
  });

  serverProcess.on('error', (err) => {
    console.error('❌ 服务器启动失败:', err.message);
    console.log('💡 提示: 请先安装 http-server: npm install -g http-server');
  });

  serverProcess.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(`\n⚠️  服务器退出，退出码: ${code}`);
    }
  });
}

// 停止服务器
function stopServer() {
  if (serverProcess) {
    console.log('\n🛑 正在停止服务器...');
    serverProcess.kill();
    serverProcess = null;
  }
}

// 重启服务器（延迟 10 秒）
function restartServer() {
  // 清除之前的定时器
  if (restartTimeout) {
    clearTimeout(restartTimeout);
  }

  console.log('\n📝 检测到文件变化，1 秒后重启服务器...');
  console.log('   (按 Ctrl+C 取消重启)');

  restartTimeout = setTimeout(() => {
    stopServer();
    setTimeout(() => {
      startServer();
    }, 500); // 等待 500ms 确保端口释放
  }, 1000); // 等待 1 秒
}

// 监控文件变化
function watchFiles() {
  const watchPath = path.join(__dirname);
  
  console.log('👀 开始监控文件变化...');
  console.log(`📁 监控目录: ${watchPath}\n`);

  const watcher = chokidar.watch(watchPath, {
    ignored: IGNORE_PATTERNS,
    ignoreInitial: true,
    persistent: true
  });

  watcher
    .on('change', (filePath) => {
      const relativePath = path.relative(watchPath, filePath);
      console.log(`\n📝 文件已修改: ${relativePath}`);
      restartServer();
    })
    .on('add', (filePath) => {
      const relativePath = path.relative(watchPath, filePath);
      console.log(`\n➕ 文件已添加: ${relativePath}`);
      restartServer();
    })
    .on('unlink', (filePath) => {
      const relativePath = path.relative(watchPath, filePath);
      console.log(`\n🗑️  文件已删除: ${relativePath}`);
      restartServer();
    })
    .on('error', (error) => {
      console.error('❌ 监控错误:', error);
    });

  return watcher;
}

// 处理退出信号
process.on('SIGINT', () => {
  console.log('\n\n👋 正在退出...');
  if (restartTimeout) {
    clearTimeout(restartTimeout);
  }
  stopServer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopServer();
  process.exit(0);
});

// 检查是否安装了 http-server
exec('which http-server', (error) => {
  if (error) {
    console.log('📦 http-server 未安装，正在安装...');
    exec('npm install -g http-server', (installError) => {
      if (installError) {
        console.error('❌ 安装失败:', installError.message);
        process.exit(1);
      } else {
        console.log('✅ http-server 安装成功\n');
        startServer();
        watchFiles();
      }
    });
  } else {
    startServer();
    watchFiles();
  }
});


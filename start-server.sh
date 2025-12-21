#!/bin/bash

# 启动本地服务器，默认显示 index.html
# 使用 http-server，默认端口 8000

# 检查是否安装了 http-server
if ! command -v http-server &> /dev/null; then
    echo "http-server 未安装，正在安装..."
    npm install -g http-server
fi

# 启动服务器
# -p 8000: 端口号
# -o: 自动打开浏览器
# -c-1: 禁用缓存
# http-server 会自动识别 index.html 作为默认首页
echo "正在启动服务器..."
echo "访问地址: http://localhost:8000"
echo "默认首页: index.html"
echo "按 Ctrl+C 停止服务器"
http-server -p 8000 -c-1


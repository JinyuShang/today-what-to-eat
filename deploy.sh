#!/bin/bash

echo "🍳 今天吃什么 - 快速部署脚本"
echo "================================"
echo ""

# 检查是否安装了 Git
if ! command -v git &> /dev/null; then
    echo "❌ 请先安装 Git"
    exit 1
fi

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装 Vercel CLI..."
    npm i -g vercel
fi

# 初始化 Git 仓库
if [ ! -d ".git" ]; then
    echo "🔧 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit: 今天吃什么菜谱生成器"
fi

# 创建 GitHub 仓库
if [ -z "$(git remote get-url origin)" ]; then
    echo "📤 创建 GitHub 仓库..."
    gh repo create today-what-to-eat --public --source=. --remote=origin
    git push -u origin main
else
    echo "✅ Git 仓库已存在"
fi

# 部署到 Vercel
echo "🚀 部署到 Vercel..."
vercel

echo ""
echo "✅ 部署完成！"
echo "🎉 你的应用已上线！"

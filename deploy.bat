@echo off
echo 🍳 今天吃什么 - 快速部署脚本
echo ================================
echo.

REM 检查是否安装了 Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 请先安装 Git
    exit /b 1
)

REM 检查是否安装了 Vercel CLI
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 正在安装 Vercel CLI...
    npm i -g vercel
)

REM 初始化 Git 仓库
if not exist ".git" (
    echo 🔧 初始化 Git 仓库...
    git init
    git add .
    git commit -m "Initial commit: 今天吃什么菜谱生成器"
)

REM 创建 GitHub 仓库（如果有 gh 命令）
where gh >nul 2>nul
if %errorlevel% equ 0 (
    if not defined GIT_REMOTE (
        echo 📤 创建 GitHub 仓库...
        gh repo create today-what-to-eat --public --source=. --remote=origin
        git push -u origin main
    )
) else (
    echo ⚠️  未安装 GitHub CLI，请手动创建仓库
)

REM 部署到 Vercel
echo 🚀 部署到 Vercel...
vercel

echo.
echo ✅ 部署完成！
echo 🎉 你的应用已上线！
pause

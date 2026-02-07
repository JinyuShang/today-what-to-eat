# 🍳 今天吃什么 - 剩余食材菜谱生成器

> 输入你冰箱里的食材，AI 智能推荐可用菜谱，还能生成购物清单！

为黑客松比赛而作，1小时快速开发完成。

## ✨ 功能特性

- 🥕 **智能食材匹配** - 输入现有食材，实时推荐可用菜谱
- 📊 **匹配度显示** - 直观展示每道菜的匹配百分比
- 🛒 **购物清单生成** - 一键生成缺少的食材清单
- ❤️ **收藏功能** - 收藏喜欢的菜谱
- 🔗 **分享协作** - 生成链接分享给好友
- 📱 **响应式设计** - 完美适配手机和电脑
- 🎨 **精美 UI** - 现代化设计，操作流畅

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 📦 部署到 Vercel

### 方法一：通过 Vercel CLI（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel
```

### 方法二：通过 GitHub + Vercel 网页

1. **推送到 GitHub**

```bash
git init
git add .
git commit -m "Initial commit: 今天吃什么菜谱生成器"
gh repo create today-what-to-eat --public --source=. --remote=origin
git push -u origin main
```

2. **在 Vercel 部署**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Import Project"
   - 选择你的 GitHub 仓库
   - 点击 "Deploy"

3. **完成！** Vercel 会自动构建并部署，几秒钟后你就能获得一个 HTTPS 链接

## 🎯 技术栈

- **框架**: Next.js 14 + TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **数据**: 40+ 预设菜谱数据库
- **存储**: LocalStorage（无需后端）

## 📁 项目结构

```
today-what-to-eat/
├── app/
│   ├── page.tsx              # 主页面
│   ├── layout.tsx            # 布局
│   └── globals.css           # 全局样式
├── components/
│   ├── IngredientInput.tsx   # 食材输入组件
│   ├── RecipeCard.tsx        # 菜谱卡片
│   ├── RecipeList.tsx        # 菜谱列表
│   ├── ShoppingList.tsx      # 购物清单
│   └── FavoritesPanel.tsx    # 收藏面板
├── lib/
│   ├── recipe-db.ts          # 菜谱数据库
│   ├── storage.ts            # LocalStorage 封装
│   └── utils.ts              # 工具函数
└── types/
    └── index.ts              # TypeScript 类型
```

## 🎮 使用指南

### 1. 添加食材
- 在输入框输入食材名称，按回车或点击"+"按钮
- 点击快捷标签快速添加常见食材

### 2. 查看菜谱
- 系统自动显示匹配的菜谱
- 绿色勾号表示已有的食材
- 橙色加号表示缺少的食材

### 3. 购物清单
- 点击"加清单"按钮自动添加缺少的食材
- 在购物清单中勾选已购买的食材

### 4. 分享给好友
- 点击"分享"按钮复制链接
- 好友打开链接即可看到你选择的食材

## 🎨 现场演示建议

### 演示流程（3分钟）

1. **开场** (30秒)
   - "大家是否有过这样的烦恼：打开冰箱不知道做什么菜？"

2. **演示基础功能** (1分钟)
   - 输入：番茄、鸡蛋
   - 实时推荐：番茄炒蛋（100%匹配）
   - 展示匹配度算法

3. **演示购物清单** (30秒)
   - 选择"麻婆豆腐"
   - 自动生成缺少的食材清单
   - 展示分类功能

4. **演示分享功能** (30秒)
   - 生成分享链接
   - 扫码展示多人场景

5. **演示收藏** (30秒)
   - 收藏常用菜谱
   - 查看收藏面板

### 演示数据

```bash
推荐演示食材：
- 番茄 + 鸡蛋 = 番茄炒蛋 (100% 匹配)
- 土豆 + 牛肉 = 土豆炖牛肉 (80% 匹配)
- 豆腐 + 猪肉 = 麻婆豆腐 (70% 匹配)
```

## 🌟 亮点总结

- ✅ **1小时开发完成** - 快速迭代，高效实现
- ✅ **无需后端** - 纯前端实现，部署简单
- ✅ **实用性强** - 解决真实生活痛点
- ✅ **用户体验好** - 流畅动画，直观交互
- ✅ **易于扩展** - 可接入真实 AI API

## 🔧 未来扩展

- [ ] 接入 OpenAI API 生成菜谱
- [ ] 图片识别食材（Vision API）
- [ ] 营养成分分析
- [ ] 菜谱评分系统
- [ ] PWA 离线支持
- [ ] 暗色模式

## 📄 许可证

MIT License

## 🙏 致谢

- Next.js 团队
- Tailwind CSS
- Lucide Icons
- Unsplash（图片）

---

🍳 **祝你在黑客松中取得好成绩！马到成功！** 🎉

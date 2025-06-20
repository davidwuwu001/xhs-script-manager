# 小红书话术管理系统

一个基于 Next.js 和 Supabase 的话术收集和管理平台，帮助用户高效管理和使用各种话术模板。

## 功能特性

### 核心功能
- 📝 **话术管理**: 创建、编辑、删除话术内容
- 🏷️ **标签系统**: 为话术添加标签，便于分类和搜索
- 📁 **模块分类**: 按模块组织话术，支持层级结构
- 🔍 **智能搜索**: 支持关键词搜索和标签过滤
- 📋 **一键复制**: 快速复制话术内容到剪贴板
- 📊 **使用统计**: 记录话术复制次数，了解使用频率

### 用户界面
- 🎨 **现代化设计**: 采用 Tailwind CSS 构建的美观界面
- 📱 **响应式布局**: 支持桌面端和移动端访问
- 🌙 **优雅交互**: 流畅的动画效果和用户体验
- 🔧 **管理后台**: 专门的管理界面用于内容管理

## 技术栈

- **前端框架**: Next.js 15.3.4
- **UI 库**: React 19 + Tailwind CSS 4
- **数据库**: Supabase (PostgreSQL)
- **图标**: Lucide React
- **语言**: TypeScript

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- Supabase 账户

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/davidwuwu001/xhs-script-manager.git
cd xhs-script-manager
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **配置环境变量**
```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入你的 Supabase 配置：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret_key
```

4. **设置数据库**

在 Supabase 控制台中执行 `database_setup.sql` 文件中的 SQL 语句来创建必要的表结构。

5. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── admin/             # 管理后台页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── CopyButton.tsx     # 复制按钮组件
│   ├── ModuleNav.tsx      # 模块导航组件
│   ├── ScriptCard.tsx     # 话术卡片组件
│   ├── ScriptModal.tsx    # 话术详情模态框
│   └── SearchBar.tsx      # 搜索栏组件
├── lib/                   # 工具库
│   ├── supabase.ts        # Supabase 客户端和数据操作
│   └── utils.ts           # 工具函数
├── database_setup.sql     # 数据库初始化脚本
└── public/               # 静态资源
```

## 数据库结构

### modules 表
- `id`: 主键
- `name`: 模块名称
- `description`: 模块描述
- `parent_id`: 父模块ID（支持层级结构）
- `created_at`: 创建时间

### scripts 表
- `id`: 主键
- `title`: 话术标题
- `content`: 话术内容
- `module_id`: 所属模块ID
- `tags`: 标签数组
- `copy_count`: 复制次数
- `created_at`: 创建时间

## 使用说明

### 普通用户
1. 在首页浏览所有话术
2. 使用搜索框查找特定话术
3. 通过标签过滤话术
4. 点击话术卡片查看详情
5. 使用复制按钮复制话术内容

### 管理员
1. 访问 `/admin` 进入管理后台
2. 在「话术管理」标签页中添加、编辑、删除话术
3. 在「模块管理」标签页中管理模块分类
4. 为话术添加标签和分类

## 部署

### Vercel 部署
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### 其他平台
项目支持部署到任何支持 Next.js 的平台，如 Netlify、Railway 等。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License

## 更新日志

### v0.1.0
- 初始版本发布
- 基础话术管理功能
- 搜索和过滤功能
- 管理后台
- 响应式设计

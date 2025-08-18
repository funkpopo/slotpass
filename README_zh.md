# 🎰 SlotPass

**语言 / Language**: [English](README.md) | **中文**

一个有趣且安全的密码生成器，采用老虎机界面设计，使用 React 和 Vite 构建。

## ✨ 特性

- 🎰 **交互式老虎机**: 通过有趣的老虎机动画生成密码
- 🔐 **安全生成**: 使用加密安全的随机密码生成算法
- 🌍 **多语言支持**: 通过 i18next 实现国际化
- 📱 **渐进式 Web 应用**: 可在移动端和桌面端安装为原生应用
- 🎨 **响应式设计**: 在所有设备上无缝运行
- 🔒 **内存保护**: 自动清理内存中的密码痕迹
- ⚡ **快速轻量**: 使用 Vite 构建，性能优化

## 🌐 在线演示

立即体验: **[https://funk.qzz.io/](https://funk.qzz.io/)**

## 🚀 快速开始

### 环境要求

- Node.js (v16 或更高版本)
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone <repository-url>
cd slotpass

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产构建

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 🐳 Docker 部署

项目包含 Docker 配置，便于部署：

```bash
# 使用 Docker Compose 构建和运行
docker-compose up -d
```

## 📋 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 生产构建
- `npm run preview` - 预览生产构建

## 🛠️ 技术栈

- **前端**: React 22, Vite
- **样式**: CSS Modules
- **国际化**: i18next, react-i18next
- **PWA**: Service Worker 支持
- **部署**: Docker, Nginx

## 📱 PWA 支持

SlotPass 可以在支持的设备上安装为渐进式 Web 应用。访问网站时会出现安装提示。

## 🔒 安全特性

- 加密安全的随机数生成
- 自动内存清理以防止密码痕迹
- 不在服务器端存储生成的密码
- 控制台保护，防止密码泄露

## 🌍 支持的语言

- 英语
- 中文（简体）

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。
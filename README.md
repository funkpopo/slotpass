# 🎰 SlotPass

**Language / 语言**: **English** | [中文](README_zh.md)

A fun and secure password generator with a slot machine interface, built with React and Vite.

## ✨ Features

- 🎰 **Interactive Slot Machine**: Generate passwords with a fun slot machine animation
- 🔐 **Secure Generation**: Cryptographically secure random password generation
- 🌍 **Multi-language Support**: Internationalization with i18next
- 📱 **Progressive Web App**: Install as a native app on mobile and desktop
- 🎨 **Responsive Design**: Works seamlessly on all devices
- 🔒 **Memory Protection**: Automatic cleanup of password traces from memory
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance

## 🌐 Demo

Try it live: **[https://funk.qzz.io/](https://funk.qzz.io/)**

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd slotpass

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🐳 Docker Deployment

The project includes Docker configuration for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🛠️ Tech Stack

- **Frontend**: React 22, Vite
- **Styling**: CSS Modules
- **Internationalization**: i18next, react-i18next
- **PWA**: Service Worker support
- **Deployment**: Docker, Nginx

## 📱 PWA Support

SlotPass can be installed as a Progressive Web App on supported devices. Look for the install prompt when visiting the site.

## 🔒 Security Features

- Cryptographically secure random number generation
- Automatic memory cleanup to prevent password traces
- No server-side storage of generated passwords
- Console protection against password exposure

## 🌍 Supported Languages

- English
- Chinese (Simplified)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import './i18n/i18n.js'
import { setupConsoleProtection, createProtectedStorage } from './utils/consoleProtection.js'

// 启用控制台保护
setupConsoleProtection()
createProtectedStorage()

// 在生产环境中禁用 React DevTools
if (import.meta.env.PROD) {
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = null
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberUnmount = null
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
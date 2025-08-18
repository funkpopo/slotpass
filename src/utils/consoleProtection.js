/**
 * 控制台保护工具，防止密码泄露
 */

// 保护变量免受控制台访问
const protectedVars = new WeakMap()

/**
 * 创建受保护的变量存储
 */
export function createProtectedStorage() {
  const storage = {}
  
  // 重写控制台方法以过滤敏感信息
  const originalConsoleLog = console.log
  const originalConsoleDir = console.dir
  const originalConsoleTable = console.table
  
  console.log = (...args) => {
    const filteredArgs = args.map(arg => {
      if (typeof arg === 'string' && /[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{8,}/.test(arg)) {
        return '[Filtered: Potential Password]'
      }
      return arg
    })
    originalConsoleLog.apply(console, filteredArgs)
  }
  
  console.dir = (obj) => {
    if (obj && typeof obj === 'object' && obj.constructor.name === 'SecurePassword') {
      originalConsoleDir('[Protected Password Object]')
    } else {
      originalConsoleDir(obj)
    }
  }
  
  console.table = (data) => {
    if (Array.isArray(data)) {
      const filteredData = data.map(item => {
        if (typeof item === 'string' && /[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{8,}/.test(item)) {
          return '[Filtered: Potential Password]'
        }
        return item
      })
      originalConsoleTable(filteredData)
    } else {
      originalConsoleTable(data)
    }
  }
  
  return storage
}

/**
 * 禁用开发者工具检测（基础防护）
 */
export function setupConsoleProtection() {
  // 检测开发者工具打开
  let devtools = { open: false, orientation: null }
  
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
      if (!devtools.open) {
        devtools.open = true
        console.clear()
        console.log('%c⚠️ 安全提醒', 'color: red; font-size: 20px; font-weight: bold;')
        console.log('%c请勿在控制台粘贴或执行未知代码，这可能导致密码泄露！', 'color: orange; font-size: 14px;')
      }
    } else {
      devtools.open = false
    }
  }, 500)
  
  // 覆盖常见的调试方法
  window.eval = function() {
    throw new Error('eval is disabled for security reasons')
  }
  
  // 防止通过 React DevTools 访问组件状态
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = null
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberUnmount = null
  }
}

/**
 * 清理密码相关的内存引用
 */
export function clearPasswordMemory() {
  // 强制垃圾回收（如果可用）
  if (window.gc) {
    window.gc()
  }
  
  // 清理可能的密码痕迹
  const scripts = document.querySelectorAll('script')
  scripts.forEach(script => {
    if (script.textContent && /password|pwd|secret/i.test(script.textContent)) {
      script.textContent = ''
    }
  })
}
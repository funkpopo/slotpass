import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      title: "SlotPass",
      description: "Slot Machine Password Generator",
      footer: "Secure Random Password Generation · Never Repeat",
      lengthLabel: "Password Length",
      generateButton: "Generate Password",
      copyButton: "Copy",
      copied: "Copied!",
      passwordStrength: {
        veryWeak: "Very Weak",
        weak: "Weak",
        fair: "Fair", 
        good: "Good",
        strong: "Strong"
      },
      slotMachine: {
        title: "Password Roulette",
        generating: "Generating...",
        lengthLabel: "Password Length",
        generateButton: "Generate Password",
        options: {
          title: "Character Types",
          uppercase: "A-Z",
          lowercase: "a-z", 
          numbers: "0-9",
          symbols: "!@#"
        },
        status: {
          ready: "Ready",
          generating: "Generating password...",
          stopping: "Setting character {{index}}...",
          completed: "Password generated! Check the slots for your password"
        },
        password: {
          show: "Show password",
          hide: "Hide password", 
          copy: "Copy password",
          copied: "Password copied to clipboard!",
          copyError: "Copy failed, please select password manually",
          strength: "Strength:"
        },
        strengthLevels: {
          none: "No password",
          weak: "Weak",
          fair: "Fair",
          good: "Good", 
          strong: "Very Strong"
        }
      },
      pwa: {
        install: "Install App",
        installPrompt: "Add SlotPass to your home screen for quick access!",
        close: "Close"
      }
    }
  },
  zh: {
    translation: {
      title: "SlotPass",
      description: "老虎机风格的密码生成器",
      footer: "安全随机密码生成 · 永不重复",
      lengthLabel: "密码长度",
      generateButton: "生成密码",
      copyButton: "复制",
      copied: "已复制！",
      passwordStrength: {
        veryWeak: "极弱",
        weak: "弱",
        fair: "一般",
        good: "良好", 
        strong: "强"
      },
      slotMachine: {
        title: "密码轮盘",
        generating: "生成中...",
        lengthLabel: "密码长度",
        generateButton: "生成密码",
        options: {
          title: "字符类型",
          uppercase: "大写字母",
          lowercase: "小写字母",
          numbers: "数字",
          symbols: "特殊符号"
        },
        status: {
          ready: "准备就绪",
          generating: "正在生成密码...",
          stopping: "正在确定第 {{index}} 位密码...",
          completed: "密码生成完成！查看轮盘中的密码"
        },
        password: {
          show: "显示密码",
          hide: "隐藏密码",
          copy: "复制密码", 
          copied: "密码已复制到剪贴板！",
          copyError: "复制失败，请手动选择密码",
          strength: "强度:"
        },
        strengthLevels: {
          none: "暂无密码",
          weak: "弱",
          fair: "中等",
          good: "强",
          strong: "极强"
        }
      },
      pwa: {
        install: "安装应用",
        installPrompt: "将 SlotPass 添加到主屏幕以便快速访问！",
        close: "关闭"
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    load: 'languageOnly',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      excludeCacheFor: ['cimode'],
      convertDetectedLanguage: (lng) => {
        // Convert language codes to supported languages
        if (lng.startsWith('zh')) {
          return 'zh'
        }
        if (lng.startsWith('en')) {
          return 'en'
        }
        // Default fallback
        return 'en'
      }
    }
  })

export default i18n
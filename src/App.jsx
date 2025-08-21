import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SlotMachine from './components/SlotMachine/SlotMachine'
import PWAInstall from './components/PWAInstall/PWAInstall'
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher'
import SEOHead from './components/SEOHead/SEOHead'
import { clearPasswordMemory } from './utils/consoleProtection'
import './App.css'

function App() {
  const { t } = useTranslation()
  const [passwordLength, setPasswordLength] = useState(8)
  const [securePassword, setSecurePassword] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // 定期清理密码内存痕迹
  useEffect(() => {
    const interval = setInterval(() => {
      clearPasswordMemory()
    }, 30000) // 每30秒清理一次

    return () => clearInterval(interval)
  }, [])

  const handleGeneratePassword = () => {
    setIsGenerating(true)
    // 清理之前的密码
    if (securePassword) {
      securePassword.clear()
    }
    setSecurePassword(null)
  }

  const handlePasswordGenerated = (password) => {
    // 这里password是明文，但只用于传递，不存储
    setIsGenerating(false)
    // 实际的安全密码对象在SlotMachine组件中管理
  }

  const handleLengthChange = (newLength) => {
    setPasswordLength(newLength)
    if (securePassword && !isGenerating) {
      securePassword.clear()
      setSecurePassword(null)
    }
  }

  return (
    <div className="app">
      <SEOHead />
      <header className="app-header">
        <h1 className="app-title">🎰 {t('title')}</h1>
        <LanguageSwitcher />
      </header>

      <main className="app-main">
        <div className="app-container">
          <SlotMachine
            passwordLength={passwordLength}
            isSpinning={isGenerating}
            onPasswordGenerated={handlePasswordGenerated}
            onLengthChange={handleLengthChange}
            onGenerate={handleGeneratePassword}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>{t('footer')}</p>
      </footer>

      <PWAInstall />
    </div>
  )
}

export default App
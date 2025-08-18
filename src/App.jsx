import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SlotMachine from './components/SlotMachine/SlotMachine'
import PWAInstall from './components/PWAInstall/PWAInstall'
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher'
import './App.css'

function App() {
  const { t } = useTranslation()
  const [passwordLength, setPasswordLength] = useState(8)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePassword = () => {
    setIsGenerating(true)
    setGeneratedPassword('')
  }

  const handlePasswordGenerated = (password) => {
    setGeneratedPassword(password)
    setIsGenerating(false)
  }

  const handleLengthChange = (newLength) => {
    setPasswordLength(newLength)
    if (generatedPassword && !isGenerating) {
      setGeneratedPassword('')
    }
  }

  return (
    <div className="app">
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
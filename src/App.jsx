import React, { useState } from 'react'
import SlotMachine from './components/SlotMachine/SlotMachine'
import PasswordControls from './components/PasswordControls/PasswordControls'
import PasswordDisplay from './components/PasswordDisplay/PasswordDisplay'
import './App.css'

function App() {
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
        <h1 className="app-title">🎰 SlotPass</h1>
      </header>

      <main className="app-main">
        <div className="app-container">
          <PasswordControls
            passwordLength={passwordLength}
            onLengthChange={handleLengthChange}
            onGenerate={handleGeneratePassword}
            isGenerating={isGenerating}
          />

          <SlotMachine
            passwordLength={passwordLength}
            isSpinning={isGenerating}
            onPasswordGenerated={handlePasswordGenerated}
          />

          <PasswordDisplay
            password={generatedPassword}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>安全随机密码生成 · 永不重复</p>
      </footer>
    </div>
  )
}

export default App
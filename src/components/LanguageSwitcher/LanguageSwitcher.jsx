import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './LanguageSwitcher.module.css'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'zh', name: '简体中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.languageSwitcher}>
      <button 
        className={styles.currentLanguage} 
        onClick={toggleDropdown}
        aria-label="Switch language"
      >
        <span className={styles.flag}>{currentLanguage.flag}</span>
        <span className={styles.arrow}>▼</span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.languageOption} ${
                language.code === i18n.language ? styles.active : ''
              }`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className={styles.flag}>{language.flag}</span>
              <span className={styles.languageName}>{language.name}</span>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default LanguageSwitcher
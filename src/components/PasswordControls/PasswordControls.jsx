import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './PasswordControls.module.css'

const PasswordControls = ({ 
  passwordLength = 8, 
  onLengthChange, 
  onGenerate, 
  isGenerating = false,
  options = {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  },
  onOptionsChange
}) => {
  const { t } = useTranslation()
  const handleLengthChange = (event) => {
    const newLength = parseInt(event.target.value, 10)
    if (newLength >= 3 && newLength <= 20) {
      onLengthChange(newLength)
    }
  }

  const handleGenerateClick = () => {
    if (!isGenerating && isOptionsValid()) {
      onGenerate()
    }
  }

  const isOptionsValid = () => {
    return options.includeUppercase || options.includeLowercase || options.includeNumbers || options.includeSymbols
  }

  return (
    <div className={styles.passwordControls}>
      <div className={styles.controlsHeader}>
        <h2 className={styles.controlsTitle}>{t('passwordControls.title')}</h2>
        <div className={styles.subtitle}>{t('passwordControls.subtitle')}</div>
      </div>

      <div className={styles.controlsBody}>
        <div className={styles.lengthControl}>
          <label htmlFor="passwordLength" className={styles.lengthLabel}>
            {t('passwordControls.lengthLabel')}
            <span className={styles.lengthValue}>{passwordLength}</span>
          </label>
          
          <div className={styles.lengthSlider}>
            <input
              id="passwordLength"
              type="range"
              min="3"
              max="20"
              value={passwordLength}
              onChange={handleLengthChange}
              className={styles.slider}
              disabled={isGenerating}
            />
            <div className={styles.sliderLabels}>
              <span className={styles.sliderLabel}>3</span>
              <span className={styles.sliderLabel}>12</span>
              <span className={styles.sliderLabel}>20</span>
            </div>
          </div>
        </div>

        <div className={styles.optionsSection}>
          <h3 className={styles.optionsTitle}>{t('passwordControls.options.title')}</h3>
          <div className={styles.switchGrid}>
            <div className={styles.switchItem}>
              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={options.includeUppercase}
                  onChange={(e) => onOptionsChange({ ...options, includeUppercase: e.target.checked })}
                  className={styles.switchInput}
                  disabled={isGenerating}
                />
                <span className={styles.switchSlider}></span>
                <span className={styles.switchText}>{t('passwordControls.options.uppercase')}</span>
              </label>
            </div>
            
            <div className={styles.switchItem}>
              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) => onOptionsChange({ ...options, includeLowercase: e.target.checked })}
                  className={styles.switchInput}
                  disabled={isGenerating}
                />
                <span className={styles.switchSlider}></span>
                <span className={styles.switchText}>{t('passwordControls.options.lowercase')}</span>
              </label>
            </div>
            
            <div className={styles.switchItem}>
              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) => onOptionsChange({ ...options, includeNumbers: e.target.checked })}
                  className={styles.switchInput}
                  disabled={isGenerating}
                />
                <span className={styles.switchSlider}></span>
                <span className={styles.switchText}>{t('passwordControls.options.numbers')}</span>
              </label>
            </div>
            
            <div className={styles.switchItem}>
              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={options.includeSymbols}
                  onChange={(e) => onOptionsChange({ ...options, includeSymbols: e.target.checked })}
                  className={styles.switchInput}
                  disabled={isGenerating}
                />
                <span className={styles.switchSlider}></span>
                <span className={styles.switchText}>{t('passwordControls.options.symbols')}</span>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.generateSection}>
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating || !isOptionsValid()}
            className={`${styles.generateButton} ${isGenerating ? styles.generating : ''}`}
          >
            <span className={styles.buttonIcon}>
              {isGenerating ? '⏳' : '🎲'}
            </span>
            <span className={styles.buttonText}>
              {isGenerating ? t('passwordControls.generating') : t('passwordControls.generateButton')}
            </span>
          </button>
          
          <div className={styles.generateHint}>
            {!isOptionsValid() ? t('passwordControls.selectOptionsHint') : t('passwordControls.generateHint')}
          </div>
        </div>
      </div>

      <div className={styles.securityInfo}>
        <div className={styles.securityItem}>
          <span className={styles.securityIcon}>🔒</span>
          <span className={styles.securityText}>{t('passwordControls.security.encryption')}</span>
        </div>
        <div className={styles.securityItem}>
          <span className={styles.securityIcon}>🎯</span>
          <span className={styles.securityText}>{t('passwordControls.security.features')}</span>
        </div>
        <div className={styles.securityItem}>
          <span className={styles.securityIcon}>♻️</span>
          <span className={styles.securityText}>{t('passwordControls.security.unique')}</span>
        </div>
      </div>
    </div>
  )
}

export default PasswordControls
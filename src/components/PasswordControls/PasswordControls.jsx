import React from 'react'
import styles from './PasswordControls.module.css'

const PasswordControls = ({ 
  passwordLength = 8, 
  onLengthChange, 
  onGenerate, 
  isGenerating = false 
}) => {
  const handleLengthChange = (event) => {
    const newLength = parseInt(event.target.value, 10)
    if (newLength >= 4 && newLength <= 20) {
      onLengthChange(newLength)
    }
  }

  const handleGenerateClick = () => {
    if (!isGenerating) {
      onGenerate()
    }
  }

  return (
    <div className={styles.passwordControls}>
      <div className={styles.controlsHeader}>
        <h2 className={styles.controlsTitle}>密码设置</h2>
        <div className={styles.subtitle}>自定义您的安全密码</div>
      </div>

      <div className={styles.controlsBody}>
        <div className={styles.lengthControl}>
          <label htmlFor="passwordLength" className={styles.lengthLabel}>
            密码长度
            <span className={styles.lengthValue}>{passwordLength}</span>
          </label>
          
          <div className={styles.lengthSlider}>
            <input
              id="passwordLength"
              type="range"
              min="4"
              max="20"
              value={passwordLength}
              onChange={handleLengthChange}
              className={styles.slider}
              disabled={isGenerating}
            />
            <div className={styles.sliderLabels}>
              <span className={styles.sliderLabel}>4</span>
              <span className={styles.sliderLabel}>12</span>
              <span className={styles.sliderLabel}>20</span>
            </div>
          </div>
        </div>

        <div className={styles.generateSection}>
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className={`${styles.generateButton} ${isGenerating ? styles.generating : ''}`}
          >
            <span className={styles.buttonIcon}>
              {isGenerating ? '⏳' : '🎲'}
            </span>
            <span className={styles.buttonText}>
              {isGenerating ? '生成中...' : '生成密码'}
            </span>
          </button>
          
          <div className={styles.generateHint}>
            点击按钮启动老虎机生成随机密码
          </div>
        </div>
      </div>

      <div className={styles.securityInfo}>
        <div className={styles.securityItem}>
          <span className={styles.securityIcon}>🔒</span>
          <span className={styles.securityText}>加密安全随机数</span>
        </div>
        <div className={styles.securityItem}>
          <span className={styles.securityIcon}>🎯</span>
          <span className={styles.securityText}>包含大小写字母、数字、符号</span>
        </div>
        <div className={styles.securityItem}>
          <span className={styles.securityIcon}>♻️</span>
          <span className={styles.securityText}>每次生成完全不同</span>
        </div>
      </div>
    </div>
  )
}

export default PasswordControls
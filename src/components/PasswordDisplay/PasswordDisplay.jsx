import React, { useState, useCallback } from 'react'
import styles from './PasswordDisplay.module.css'

const PasswordDisplay = ({ password = '' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [copyStatus, setCopyStatus] = useState('idle') // 'idle', 'copied', 'error'

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const copyToClipboard = useCallback(async () => {
    if (!password) return

    try {
      await navigator.clipboard.writeText(password)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (err) {
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }, [password])

  const getStrengthInfo = (password) => {
    if (!password) return { level: 0, text: '暂无密码', color: 'var(--text-muted)' }
    
    const length = password.length
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
    
    const typesCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length
    
    if (length >= 12 && typesCount >= 4) {
      return { level: 4, text: '极强', color: 'var(--accent-primary)' }
    } else if (length >= 8 && typesCount >= 3) {
      return { level: 3, text: '强', color: '#8bc34a' }
    } else if (length >= 6 && typesCount >= 2) {
      return { level: 2, text: '中等', color: '#ffeb3b' }
    } else {
      return { level: 1, text: '弱', color: 'var(--accent-danger)' }
    }
  }

  const strengthInfo = getStrengthInfo(password)

  const displayPassword = password ? (isVisible ? password : '•'.repeat(password.length)) : ''

  return (
    <div className={styles.passwordDisplay}>
      <div className={styles.displayHeader}>
        <h3 className={styles.displayTitle}>生成的密码</h3>
        {password && (
          <div className={styles.strengthIndicator}>
            <span className={styles.strengthLabel}>强度:</span>
            <div className={styles.strengthMeter}>
              <div 
                className={styles.strengthFill}
                style={{ 
                  width: `${(strengthInfo.level / 4) * 100}%`,
                  backgroundColor: strengthInfo.color
                }}
              />
            </div>
            <span 
              className={styles.strengthText}
              style={{ color: strengthInfo.color }}
            >
              {strengthInfo.text}
            </span>
          </div>
        )}
      </div>

      <div className={styles.passwordContainer}>
        {password ? (
          <>
            <div className={styles.passwordField}>
              <div className={styles.passwordText}>
                {displayPassword}
              </div>
              
              <div className={styles.passwordActions}>
                <button
                  onClick={toggleVisibility}
                  className={styles.actionButton}
                  title={isVisible ? '隐藏密码' : '显示密码'}
                >
                  {isVisible ? '👁️' : '🙈'}
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className={`${styles.actionButton} ${styles.copyButton} ${styles[copyStatus]}`}
                  title="复制密码"
                  disabled={copyStatus !== 'idle'}
                >
                  {copyStatus === 'copied' ? '✅' :
                   copyStatus === 'error' ? '❌' : '📋'}
                </button>
              </div>
            </div>
            
            {copyStatus === 'copied' && (
              <div className={styles.copyFeedback}>
                密码已复制到剪贴板！
              </div>
            )}
            
            {copyStatus === 'error' && (
              <div className={styles.copyError}>
                复制失败，请手动选择密码
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎰</div>
            <div className={styles.emptyText}>
              点击"生成密码"按钮开始
            </div>
            <div className={styles.emptySubtext}>
              老虎机将为您生成安全的随机密码
            </div>
          </div>
        )}
      </div>

      {password && (
        <div className={styles.passwordStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>长度:</span>
            <span className={styles.statValue}>{password.length} 字符</span>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statLabel}>包含:</span>
            <div className={styles.typeIndicators}>
              {/[A-Z]/.test(password) && <span className={styles.typeIndicator}>大写</span>}
              {/[a-z]/.test(password) && <span className={styles.typeIndicator}>小写</span>}
              {/\d/.test(password) && <span className={styles.typeIndicator}>数字</span>}
              {/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) && <span className={styles.typeIndicator}>符号</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PasswordDisplay
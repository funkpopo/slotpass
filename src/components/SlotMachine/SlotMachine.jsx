import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import SlotReel from './SlotReel'
import { generateSecurePassword, generateRandomCharacters, generateRandomCharacter } from '../../utils/passwordGenerator'
import styles from './SlotMachine.module.css'

const SlotMachine = ({ 
  passwordLength = 8, 
  isSpinning = false, 
  onPasswordGenerated, 
  onLengthChange, 
  onGenerate,
  passwordOptions = {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  },
  onOptionsChange
}) => {
  const { t } = useTranslation()
  const [reelStates, setReelStates] = useState([])
  const [animationPhase, setAnimationPhase] = useState('idle') // 'idle', 'spinning', 'stopping', 'stopped'
  const [stoppingIndex, setStoppingIndex] = useState(-1) // 当前正在停止的轮盘索引
  const [securePassword, setSecurePassword] = useState(null) // 受保护的密码对象
  const [isPasswordVisible, setIsPasswordVisible] = useState(false) // 密码可见性
  const [copyStatus, setCopyStatus] = useState('idle') // 'idle', 'copied', 'error'

  // 初始化轮盘状态 - 性能优化
  useEffect(() => {
    const initialReels = Array.from({ length: passwordLength }, (_, index) => {
      // 优化：减少初始字符数量，提高加载速度
      const initialChar = generateRandomCharacter(passwordOptions)
      return {
        id: `reel-${index}`,
        characters: [], // 初始为空，在旋转时再生成
        finalCharacter: '',
        animationDelay: Math.random() * 200, // 减少随机延迟范围
        isSpinning: false,
        isStopping: false,
        isStopped: false,
        currentCharacter: initialChar,
        displayCharacters: [initialChar] // 只显示一个初始字符
      }
    })
    setReelStates(initialReels)
  }, [passwordLength, passwordOptions])

  // 逐个停止轮盘的序列
  const startStoppingSequence = useCallback((finalPassword, securePasswordObj) => {
    let currentIndex = 0
    
    const stopNextReel = () => {
      if (currentIndex >= passwordLength) {
        // 所有轮盘都已停止
        setTimeout(() => {
          setAnimationPhase('stopped')
          setSecurePassword(securePasswordObj)
          if (onPasswordGenerated) {
            onPasswordGenerated(finalPassword)
          }
          
          // 确保所有轮盘都显示最终字符
          setReelStates(prevReels => 
            prevReels.map((reel, index) => ({
              ...reel,
              isStopping: false,
              isStopped: true,
              isSpinning: false,
              currentCharacter: finalPassword[index],
              finalCharacter: finalPassword[index],
              displayCharacters: [finalPassword[index]]
            }))
          )
          
          // 不要重置状态为idle，保持stopped状态以显示密码
          // 只有在开始新的生成时才重置
        }, 100) // 进一步缩短最终延迟到100ms
        return
      }
      
      // 设置当前停止的轮盘索引
      setStoppingIndex(currentIndex)
      
      // 更新当前轮盘状态为停止中
      setReelStates(prevReels => 
        prevReels.map((reel, index) => {
          if (index === currentIndex) {
            // 当前要停止的轮盘
            return {
              ...reel,
              isStopping: true,
              isSpinning: false,
              currentCharacter: finalPassword[index],
              finalCharacter: finalPassword[index], // 确保设置finalCharacter
              displayCharacters: [
                ...generateRandomCharacters(3), // 减速时的随机字符
                finalPassword[index], 
                finalPassword[index]  // 重复目标字符增加停止概率
              ]
            }
          } else if (index < currentIndex) {
            // 已经停止的轮盘，确保保持停止状态和字符显示
            return {
              ...reel,
              isStopped: true,
              isSpinning: false,
              isStopping: false,
              currentCharacter: finalPassword[index],
              finalCharacter: finalPassword[index],
              displayCharacters: [finalPassword[index]]
            }
          }
          // 还在旋转的轮盘保持不变
          return reel
        })
      )
      
      // 延迟后停止下一个轮盘
      setTimeout(() => {
        // 设置轮盘为完全停止状态
        setReelStates(prevReels => 
          prevReels.map((reel, index) => {
            if (index === currentIndex) {
              // 当前刚停止的轮盘
              return {
                ...reel,
                isStopping: false,
                isStopped: true,
                isSpinning: false,
                currentCharacter: finalPassword[index],
                finalCharacter: finalPassword[index],
                displayCharacters: [finalPassword[index]] // 确保显示最终字符
              }
            } else if (index < currentIndex) {
              // 之前已经停止的轮盘，确保保持状态
              return {
                ...reel,
                isStopped: true,
                isSpinning: false,
                isStopping: false,
                currentCharacter: finalPassword[index],
                finalCharacter: finalPassword[index],
                displayCharacters: [finalPassword[index]]
              }
            }
            // 还在旋转的轮盘保持不变
            return reel
          })
        )
        
        currentIndex++
        setTimeout(stopNextReel, 80) // 进一步缩短间隔到80ms，更快的停止效果
      }, 250) // 减速时间缩短到250ms
    }
    
    stopNextReel()
  }, [passwordLength, onPasswordGenerated])

  // 监听外部旋转触发
  useEffect(() => {
    if (isSpinning && (animationPhase === 'idle' || animationPhase === 'stopped')) {
      // 直接在这里执行生成逻辑，避免循环依赖
      if (animationPhase === 'spinning' || animationPhase === 'stopping') return

      // 重置所有状态，开始新的生成
      setAnimationPhase('spinning')
      setStoppingIndex(-1)
      
      // 生成最终密码
      const securePasswordObj = generateSecurePassword(passwordLength, passwordOptions)
      const finalPassword = securePasswordObj.getValue()
      
      // 更新轮盘状态开始旋转 - 优化版本
      setReelStates(prevReels => 
        prevReels.map((reel, index) => ({
          ...reel,
          characters: generateRandomCharacters(60, passwordOptions), // 减少到60个字符
          displayCharacters: generateRandomCharacters(30, passwordOptions), // 减少到30个
          finalCharacter: finalPassword[index],
          isSpinning: true,
          isStopping: false,
          isStopped: false,
          animationDelay: index * 40 + Math.random() * 60, // 减少延迟，让轮盘更快启动
          currentCharacter: generateRandomCharacter(passwordOptions) // 使用单个字符生成
        }))
      )

      // 开始逐个停止轮盘的流程
      setTimeout(() => {
        setAnimationPhase('stopping')
        startStoppingSequence(finalPassword, securePasswordObj)
      }, 300) // 缩短旋转时间从500ms到300ms
    }
  }, [isSpinning, animationPhase, passwordLength, startStoppingSequence])

  // 密码显示相关函数
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const copyPasswordToClipboard = useCallback(async () => {
    if (!securePassword) return

    try {
      await navigator.clipboard.writeText(securePassword.getValue())
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (err) {
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }, [securePassword])

  const getPasswordStrengthInfo = (password) => {
    if (!password) return { level: 0, text: t('slotMachine.strengthLevels.none'), color: 'var(--text-muted)' }
    
    const length = password.length
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
    
    const typesCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length
    
    if (length >= 12 && typesCount >= 4) {
      return { level: 4, text: t('slotMachine.strengthLevels.strong'), color: 'var(--accent-primary)' }
    } else if (length >= 8 && typesCount >= 3) {
      return { level: 3, text: t('slotMachine.strengthLevels.good'), color: '#8bc34a' }
    } else if (length >= 6 && typesCount >= 2) {
      return { level: 2, text: t('slotMachine.strengthLevels.fair'), color: '#ffeb3b' }
    } else {
      return { level: 1, text: t('slotMachine.strengthLevels.weak'), color: 'var(--accent-danger)' }
    }
  }

  const actualPassword = securePassword ? securePassword.getValue() : ''
  const strengthInfo = getPasswordStrengthInfo(actualPassword)
  const displayPassword = actualPassword ? (isPasswordVisible ? actualPassword : '•'.repeat(actualPassword.length)) : ''

  return (
    <div 
      className={styles.slotMachine}
      style={{
        '--password-length': passwordLength
      }}
    >
      <div className={styles.machineHeader}>
        <div className={styles.machineLogo}>🎰</div>
        <div className={styles.machineTitle}>{t('slotMachine.title')}</div>
        <div className={styles.statusLight}>
          <div className={`${styles.light} ${
            animationPhase === 'spinning' ? styles.spinning :
            animationPhase === 'stopping' ? styles.stopping :
            animationPhase === 'stopped' ? styles.stopped :
            styles.idle
          }`}></div>
        </div>
        <div className={styles.generateButton}>
          <button
            onClick={onGenerate}
            disabled={
              animationPhase === 'spinning' || 
              animationPhase === 'stopping' ||
              !(passwordOptions.includeUppercase || passwordOptions.includeLowercase || passwordOptions.includeNumbers || passwordOptions.includeSymbols)
            }
            className={`${styles.button} ${animationPhase === 'spinning' || animationPhase === 'stopping' ? styles.generating : ''}`}
          >
            <span className={styles.buttonIcon}>
              {animationPhase === 'spinning' || animationPhase === 'stopping' ? '⏳' : '🎲'}
            </span>
            <span className={styles.buttonText}>
              {animationPhase === 'spinning' || animationPhase === 'stopping' ? t('slotMachine.generating') : t('slotMachine.generateButton')}
            </span>
          </button>
        </div>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.lengthControl}>
          <label htmlFor="passwordLength" className={styles.lengthLabel}>
            {t('slotMachine.lengthLabel')}
            <span className={styles.lengthValue}>{passwordLength}</span>
          </label>
          
          <div className={styles.lengthSlider}>
            <input
              id="passwordLength"
              type="range"
              min="3"
              max="20"
              value={passwordLength}
              onChange={(e) => onLengthChange && onLengthChange(parseInt(e.target.value, 10))}
              className={styles.slider}
              disabled={animationPhase === 'spinning' || animationPhase === 'stopping'}
            />
            <div className={styles.sliderLabels}>
              <span className={styles.sliderLabel}>3</span>
              <span className={styles.sliderLabel}>12</span>
              <span className={styles.sliderLabel}>20</span>
            </div>
          </div>
        </div>

        <div className={styles.optionsControl}>
          <div className={styles.optionsTitle}>{t('slotMachine.options.title')}</div>
          <div className={styles.optionsGrid}>
            <label className={styles.optionItem}>
              <input
                type="checkbox"
                checked={passwordOptions.includeUppercase}
                onChange={(e) => onOptionsChange && onOptionsChange({ ...passwordOptions, includeUppercase: e.target.checked })}
                className={styles.optionCheckbox}
                disabled={animationPhase === 'spinning' || animationPhase === 'stopping'}
              />
              <span className={styles.optionSlider}></span>
              <span className={styles.optionText}>{t('slotMachine.options.uppercase')}</span>
            </label>
            
            <label className={styles.optionItem}>
              <input
                type="checkbox"
                checked={passwordOptions.includeLowercase}
                onChange={(e) => onOptionsChange && onOptionsChange({ ...passwordOptions, includeLowercase: e.target.checked })}
                className={styles.optionCheckbox}
                disabled={animationPhase === 'spinning' || animationPhase === 'stopping'}
              />
              <span className={styles.optionSlider}></span>
              <span className={styles.optionText}>{t('slotMachine.options.lowercase')}</span>
            </label>
            
            <label className={styles.optionItem}>
              <input
                type="checkbox"
                checked={passwordOptions.includeNumbers}
                onChange={(e) => onOptionsChange && onOptionsChange({ ...passwordOptions, includeNumbers: e.target.checked })}
                className={styles.optionCheckbox}
                disabled={animationPhase === 'spinning' || animationPhase === 'stopping'}
              />
              <span className={styles.optionSlider}></span>
              <span className={styles.optionText}>{t('slotMachine.options.numbers')}</span>
            </label>
            
            <label className={styles.optionItem}>
              <input
                type="checkbox"
                checked={passwordOptions.includeSymbols}
                onChange={(e) => onOptionsChange && onOptionsChange({ ...passwordOptions, includeSymbols: e.target.checked })}
                className={styles.optionCheckbox}
                disabled={animationPhase === 'spinning' || animationPhase === 'stopping'}
              />
              <span className={styles.optionSlider}></span>
              <span className={styles.optionText}>{t('slotMachine.options.symbols')}</span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.reelsContainer}>
        <div 
          className={`${styles.reelsFrame} ${passwordLength > 12 ? styles.longPassword : ''}`}
          style={{
            '--password-length': passwordLength
          }}
        >
          {reelStates.map((reel, index) => (
            <SlotReel
              key={reel.id}
              characters={reel.characters}
              displayCharacters={reel.displayCharacters}
              finalCharacter={reel.finalCharacter}
              currentCharacter={reel.currentCharacter}
              isSpinning={reel.isSpinning}
              isStopping={reel.isStopping}
              isStopped={reel.isStopped}
              animationDelay={reel.animationDelay}
              reelIndex={index}
              passwordLength={passwordLength}
            />
          ))}
        </div>
        
        {/* 机器装饰线条 */}
        <div className={styles.machineLines}>
          <div className={styles.topLine}></div>
          <div className={styles.bottomLine}></div>
        </div>
      </div>

      <div className={styles.machineFooter}>
        <div className={styles.statusText}>
          {animationPhase === 'spinning' && t('slotMachine.status.generating')}
          {animationPhase === 'stopping' && t('slotMachine.status.stopping', { index: stoppingIndex + 1 })}
          {animationPhase === 'stopped' && t('slotMachine.status.completed')}
          {animationPhase === 'idle' && t('slotMachine.status.ready')}
        </div>
        
        <div className={styles.progressBar}>
          <div className={`${styles.progress} ${styles[animationPhase]}`}></div>
        </div>
      </div>

      {/* 密码显示区域 */}
      {securePassword && (
        <div className={styles.passwordDisplay}>
          <div className={styles.passwordField}>
            <div className={styles.passwordText}>
              {displayPassword}
            </div>
            
            <div className={styles.strengthIndicator}>
              <span className={styles.strengthLabel}>{t('slotMachine.password.strength')}</span>
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
            
            <div className={styles.passwordActions}>
              <button
                onClick={togglePasswordVisibility}
                className={styles.actionButton}
                title={isPasswordVisible ? t('slotMachine.password.hide') : t('slotMachine.password.show')}
              >
                {isPasswordVisible ? '👁️' : '🙈'}
              </button>
              
              <button
                onClick={copyPasswordToClipboard}
                className={`${styles.actionButton} ${styles.copyButton} ${styles[copyStatus]}`}
                title={t('slotMachine.password.copy')}
                disabled={copyStatus !== 'idle'}
              >
                {copyStatus === 'copied' ? '✅' :
                 copyStatus === 'error' ? '❌' : '📋'}
              </button>
            </div>
          </div>
          
          {copyStatus === 'copied' && (
            <div className={styles.copyFeedback}>
              {t('slotMachine.password.copied')}
            </div>
          )}
          
          {copyStatus === 'error' && (
            <div className={styles.copyError}>
              {t('slotMachine.password.copyError')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SlotMachine
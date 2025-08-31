import React, { memo } from 'react'
import { CHARACTER_SETS } from '../../utils/passwordGenerator'
import styles from './SlotReel.module.css'

const SlotReel = memo(({ 
  characters = [], 
  finalCharacter = '', 
  currentCharacter = '',
  displayCharacters = [],
  isSpinning = false,
  isStopping = false,
  isStopped = false,
  animationDelay = 0,
  reelIndex = 0,
  passwordLength = 8
}) => {
  // 创建显示字符列表
  const getDisplayContent = () => {
    if (isStopped && finalCharacter) {
      // 已停止，只显示最终字符
      return [finalCharacter]
    } else if (isStopping && finalCharacter) {
      // 停止中，显示减速过程
      const baseChars = displayCharacters.length > 0 ? displayCharacters : 
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
      return [...baseChars, finalCharacter]
    } else if (isSpinning) {
      // 旋转中，显示随机字符
      if (displayCharacters.length > 0) {
        return displayCharacters
      }
      // 生成默认字符
      const allChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
      const chars = []
      for (let i = 0; i < 20; i++) {
        chars.push(allChars[Math.floor(Math.random() * allChars.length)])
      }
      return chars
    } else {
      // 闲置状态
      return [currentCharacter || finalCharacter || 'A']
    }
  }
  
  const displayContent = getDisplayContent()
  
  return (
    <div 
      className={styles.slotReel}
      data-long-password={passwordLength > 12 ? "true" : "false"}
      style={{
        '--password-length': passwordLength
      }}
    >
      <div className={styles.reelWindow}>
        <div 
          className={`${styles.reelStrip} ${
            isSpinning ? styles.spinning :
            isStopping ? styles.stopping :
            isStopped ? styles.stopped :
            ''
          }`}
          style={{
            '--animation-delay': `${animationDelay}ms`,
            '--reel-index': reelIndex
          }}
        >
          {displayContent.map((char, index) => (
            <div 
              key={`${char}-${index}-${Date.now()}`}
              className={`${styles.reelCharacter} ${
                isStopped && index === 0 ? styles.finalCharacter :
                isStopping && char === finalCharacter ? styles.stoppingCharacter :
                styles.normalCharacter
              }`}
            >
              {char}
            </div>
          ))}
        </div>
      </div>
      
      {/* 轮盘边框装饰 */}
      <div className={`${
        isSpinning ? `${styles.reelBorder} ${styles.spinning}` :
        isStopping ? `${styles.reelBorder} ${styles.stopping}` :
        styles.reelBorder
      }`}></div>
      
      {/* 指示器 */}
      <div className={styles.reelIndicator}>
        <div className={styles.indicatorArrow}></div>
      </div>
    </div>
  )
})

SlotReel.displayName = 'SlotReel'

export default SlotReel
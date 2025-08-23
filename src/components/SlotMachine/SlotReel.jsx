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
  // 创建显示字符列表，确保始终有内容 - 性能优化版本
  const getDisplayContent = () => {
    if (isStopped) {
      // 已停止，显示最终字符，确保不为空
      const finalChar = finalCharacter || currentCharacter || 'A'
      return [finalChar]
    } else if (isStopping) {
      // 停止中，显示减速过程，包含目标字符和周围字符
      const targetChar = finalCharacter || currentCharacter || 'A'
      const baseChars = displayCharacters.length > 0 ? displayCharacters.slice(0, 8) : 
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] // 减少基础字符数量
      return [...baseChars, targetChar, targetChar]
    } else if (isSpinning) {
      // 旋转中，使用已有的displayCharacters或生成更少的字符
      const spinChars = displayCharacters.length > 0 ? displayCharacters : characters
      if (spinChars.length === 0) {
        // 优化：生成更少的字符，减少内存使用
        const allChars = CHARACTER_SETS.UPPERCASE + CHARACTER_SETS.LOWERCASE + CHARACTER_SETS.NUMBERS + CHARACTER_SETS.SYMBOLS
        const chars = []
        for (let i = 0; i < 50; i++) { // 从80减少到50
          chars.push(allChars[i % allChars.length])
        }
        return chars
      }
      // 使用现有字符，避免重复扩展
      return spinChars
    } else {
      // 闲置状态，显示当前字符
      const idleChar = currentCharacter || finalCharacter || 'A'
      return [idleChar]
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
            '--reel-index': reelIndex,
            '--final-transform': isStopped ? 'translateY(0)' : 'unset'
          }}
        >
          {displayContent.map((char, index) => (
            <div 
              key={`${char}-${index}-${isSpinning ? 'spinning' : isStopping ? 'stopping' : isStopped ? 'stopped' : 'idle'}`}
              className={`${styles.reelCharacter} ${
                isStopped ? styles.finalCharacter :
                isStopping && index >= displayContent.length - 2 ? styles.stoppingCharacter :
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
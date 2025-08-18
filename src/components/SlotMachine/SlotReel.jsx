import React, { memo } from 'react'
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
  // 创建显示字符列表，确保始终有内容
  const getDisplayContent = () => {
    if (isStopped) {
      // 已停止，显示最终字符，确保不为空
      const finalChar = finalCharacter || currentCharacter || (displayCharacters.length > 0 ? displayCharacters[0] : 'A')
      // 在最终字符前后添加一些字符，让轮盘看起来更真实
      return ['·', '·', finalChar, '·', '·']
    } else if (isStopping) {
      // 停止中，显示减速过程，包含目标字符和周围字符
      const targetChar = finalCharacter || currentCharacter || (displayCharacters.length > 0 ? displayCharacters[0] : 'A')
      const baseChars = displayCharacters.length > 0 ? displayCharacters.slice(0, 12) : 
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
      return [...baseChars, targetChar, targetChar, '·', '·'] // 逐渐聚焦到目标字符
    } else if (isSpinning) {
      // 旋转中，显示大量连续的字符流，确保窗口中始终有多个可见字符
      const spinChars = displayCharacters.length > 0 ? displayCharacters : characters
      if (spinChars.length === 0) {
        // 生成包含各种字符类型的序列
        const chars = []
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        const numbers = '0123456789'
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
        const allChars = letters + numbers + symbols
        
        for (let i = 0; i < 80; i++) {
          chars.push(allChars[i % allChars.length])
        }
        return chars
      }
      // 扩展字符列表，创建足够长的无缝滚动内容
      const extendedChars = []
      for (let i = 0; i < 100; i++) {
        extendedChars.push(spinChars[i % spinChars.length])
      }
      return extendedChars
    } else {
      // 闲置状态，显示当前字符和周围的装饰字符
      const idleChar = currentCharacter || finalCharacter || 
                      (displayCharacters.length > 0 ? displayCharacters[0] : 'A')
      return ['·', idleChar, '·']
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
          className={`${
            isSpinning ? `${styles.reelStrip} ${styles.spinning}` :
            isStopping ? `${styles.reelStrip} ${styles.stopping}` :
            isStopped ? `${styles.reelStrip} ${styles.stopped}` :
            styles.reelStrip
          }`}
          style={{
            '--animation-delay': `${animationDelay}ms`,
            '--reel-index': reelIndex
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
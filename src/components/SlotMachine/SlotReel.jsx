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
  reelIndex = 0 
}) => {
  // 创建显示字符列表，确保始终有内容
  const getDisplayContent = () => {
    if (isStopped) {
      // 已停止，显示最终字符，确保不为空
      const finalChar = finalCharacter || currentCharacter || (displayCharacters.length > 0 ? displayCharacters[0] : 'A')
      return [finalChar]
    } else if (isStopping) {
      // 停止中，显示减速过程
      const targetChar = finalCharacter || currentCharacter || (displayCharacters.length > 0 ? displayCharacters[0] : 'A')
      // 在减速过程中，逐渐减少显示的字符数量，最后聚焦到目标字符
      const baseChars = displayCharacters.length > 0 ? displayCharacters.slice(0, 5) : ['A', 'B', 'C', 'D', 'E']
      return [...baseChars, targetChar, targetChar] // 重复目标字符增加停止概率
    } else if (isSpinning) {
      // 旋转中，显示连续的字符流
      const spinChars = displayCharacters.length > 0 ? displayCharacters : characters
      if (spinChars.length === 0) {
        // 如果没有字符，生成默认的字符序列
        return Array.from({length: 20}, (_, i) => String.fromCharCode(65 + (i % 26)))
      }
      return spinChars.slice(0, Math.min(30, spinChars.length))
    } else {
      // 闲置状态，确保有内容显示
      const idleChar = currentCharacter || finalCharacter || 
                      (displayCharacters.length > 0 ? displayCharacters[0] : 'A')
      return [idleChar]
    }
  }
  
  const displayContent = getDisplayContent()
  
  return (
    <div className={styles.slotReel}>
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
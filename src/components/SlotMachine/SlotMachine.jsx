import React, { useState, useEffect, useCallback } from 'react'
import SlotReel from './SlotReel'
import { generateSecurePassword, generateRandomCharacters } from '../../utils/passwordGenerator'
import styles from './SlotMachine.module.css'

const SlotMachine = ({ passwordLength = 8, isSpinning = false, onPasswordGenerated }) => {
  const [reelStates, setReelStates] = useState([])
  const [animationPhase, setAnimationPhase] = useState('idle') // 'idle', 'spinning', 'stopping', 'stopped'
  const [stoppingIndex, setStoppingIndex] = useState(-1) // 当前正在停止的轮盘索引

  // 初始化轮盘状态
  useEffect(() => {
    const initialReels = Array.from({ length: passwordLength }, (_, index) => ({
      id: `reel-${index}`,
      characters: generateRandomCharacters(40), // 更多初始字符用于流畅动画
      finalCharacter: '',
      animationDelay: Math.random() * 300, // 0-300ms随机延迟
      isSpinning: false,
      isStopping: false,
      isStopped: false,
      currentCharacter: generateRandomCharacters(1)[0], // 当前显示的字符，确保不为空
      displayCharacters: generateRandomCharacters(20) // 始终保持显示的字符列表
    }))
    setReelStates(initialReels)
  }, [passwordLength])

  // 生成密码并启动动画
  const startSpinning = useCallback(() => {
    if (animationPhase === 'spinning' || animationPhase === 'stopping') return

    // 重置所有状态，开始新的生成
    setAnimationPhase('spinning')
    setStoppingIndex(-1)
    
    // 生成最终密码
    const finalPassword = generateSecurePassword(passwordLength)
    
    // 更新轮盘状态开始旋转
    setReelStates(prevReels => 
      prevReels.map((reel, index) => ({
        ...reel,
        characters: generateRandomCharacters(80), // 更多字符用于流畅旋转动画
        displayCharacters: generateRandomCharacters(40), // 保持显示字符的丰富性
        finalCharacter: finalPassword[index],
        isSpinning: true,
        isStopping: false,
        isStopped: false,
        animationDelay: index * 80 + Math.random() * 120, // 递增延迟 + 随机延迟
        currentCharacter: generateRandomCharacters(1)[0] // 开始时的字符
      }))
    )

    // 开始逐个停止轮盘的流程
    setTimeout(() => {
      setAnimationPhase('stopping')
      startStoppingSequence(finalPassword)
    }, 2000) // 2秒后开始逐个停止

  }, [passwordLength, animationPhase])

  // 逐个停止轮盘的序列
  const startStoppingSequence = useCallback((finalPassword) => {
    let currentIndex = 0
    
    const stopNextReel = () => {
      if (currentIndex >= passwordLength) {
        // 所有轮盘都已停止
        setTimeout(() => {
          setAnimationPhase('stopped')
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
        }, 500)
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
        setTimeout(stopNextReel, 200) // 缩短间隔到200ms，让停止效果更连贯
      }, 600) // 每个轮盘减速600ms
    }
    
    stopNextReel()
  }, [passwordLength, onPasswordGenerated])

  // 监听外部旋转触发
  useEffect(() => {
    if (isSpinning && (animationPhase === 'idle' || animationPhase === 'stopped')) {
      startSpinning()
    }
  }, [isSpinning, animationPhase, startSpinning])

  return (
    <div 
      className={styles.slotMachine}
      style={{
        '--password-length': passwordLength
      }}
    >
      <div className={styles.machineHeader}>
        <div className={styles.machineLogo}>🎰</div>
        <div className={styles.machineTitle}>密码轮盘</div>
        <div className={styles.statusLight}>
          <div className={`${styles.light} ${
            animationPhase === 'spinning' ? styles.spinning :
            animationPhase === 'stopping' ? styles.stopping :
            animationPhase === 'stopped' ? styles.stopped :
            styles.idle
          }`}></div>
        </div>
      </div>

      <div className={styles.reelsContainer}>
        <div 
          className={styles.reelsFrame}
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
          {animationPhase === 'spinning' && '正在生成密码...'}
          {animationPhase === 'stopping' && `正在确定第 ${stoppingIndex + 1} 位密码...`}
          {animationPhase === 'stopped' && '密码生成完成！查看轮盘中的密码'}
          {animationPhase === 'idle' && '准备就绪'}
        </div>
        
        <div className={styles.progressBar}>
          <div className={`${styles.progress} ${styles[animationPhase]}`}></div>
        </div>
      </div>
    </div>
  )
}

export default SlotMachine
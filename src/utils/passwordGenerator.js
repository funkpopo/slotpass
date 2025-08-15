// 密码字符集定义
export const CHARACTER_SETS = {
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz', 
  NUMBERS: '0123456789',
  SYMBOLS: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

// 完整字符集
export const ALL_CHARACTERS = 
  CHARACTER_SETS.UPPERCASE + 
  CHARACTER_SETS.LOWERCASE + 
  CHARACTER_SETS.NUMBERS + 
  CHARACTER_SETS.SYMBOLS

/**
 * 生成加密安全的随机密码
 * @param {number} length - 密码长度
 * @returns {string} 生成的密码
 */
export function generateSecurePassword(length) {
  if (length < 3) {
    throw new Error('密码长度不能少于3位')
  }

  // 使用crypto.getRandomValues生成真随机数
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = array[i] % ALL_CHARACTERS.length
    password += ALL_CHARACTERS[randomIndex]
  }
  
  return password
}

/**
 * 生成单个随机字符
 * @returns {string} 随机字符
 */
export function generateRandomCharacter() {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const randomIndex = array[0] % ALL_CHARACTERS.length
  return ALL_CHARACTERS[randomIndex]
}

/**
 * 生成随机字符序列（用于轮盘动画）
 * @param {number} count - 字符数量
 * @returns {string[]} 字符数组
 */
export function generateRandomCharacters(count) {
  const characters = []
  for (let i = 0; i < count; i++) {
    characters.push(generateRandomCharacter())
  }
  return characters
}
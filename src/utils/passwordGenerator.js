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
 * 创建受保护的密码对象，防止控制台访问
 */
class SecurePassword {
  constructor(value) {
    this._value = value
    
    // 防止控制台检查
    Object.defineProperty(this, '_value', {
      enumerable: false,
      configurable: false
    })
    
    // 添加混淆属性
    this.toString = () => '[Protected Password]'
    this.valueOf = () => '[Protected Password]'
    this[Symbol.toPrimitive] = () => '[Protected Password]'
    
    // 冻结对象防止修改
    Object.freeze(this)
  }
  
  getValue() {
    return this._value
  }
  
  clear() {
    this._value = null
  }
}

/**
 * 生成加密安全的随机密码
 * @param {number} length - 密码长度
 * @returns {SecurePassword} 受保护的密码对象
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
  
  // 清除原始数组
  array.fill(0)
  
  return new SecurePassword(password)
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
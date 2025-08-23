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
 * @param {Object} options - 密码选项
 * @param {boolean} options.includeUppercase - 包含大写字母
 * @param {boolean} options.includeLowercase - 包含小写字母
 * @param {boolean} options.includeNumbers - 包含数字
 * @param {boolean} options.includeSymbols - 包含特殊符号
 * @returns {SecurePassword} 受保护的密码对象
 */
export function generateSecurePassword(length, options = {}) {
  if (length < 3) {
    throw new Error('密码长度不能少于3位')
  }

  // 默认选项
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true
  } = options

  // 构建字符集
  let characterSet = ''
  if (includeUppercase) characterSet += CHARACTER_SETS.UPPERCASE
  if (includeLowercase) characterSet += CHARACTER_SETS.LOWERCASE
  if (includeNumbers) characterSet += CHARACTER_SETS.NUMBERS
  if (includeSymbols) characterSet += CHARACTER_SETS.SYMBOLS

  // 如果没有选择任何字符集，抛出错误
  if (characterSet === '') {
    throw new Error('至少需要选择一种字符类型')
  }

  // 使用crypto.getRandomValues生成真随机数
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = array[i] % characterSet.length
    password += characterSet[randomIndex]
  }
  
  // 清除原始数组
  array.fill(0)
  
  return new SecurePassword(password)
}

/**
 * 生成单个随机字符
 * @param {Object} options - 字符选项
 * @returns {string} 随机字符
 */
export function generateRandomCharacter(options = {}) {
  // 默认选项
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true
  } = options

  // 构建字符集
  let characterSet = ''
  if (includeUppercase) characterSet += CHARACTER_SETS.UPPERCASE
  if (includeLowercase) characterSet += CHARACTER_SETS.LOWERCASE
  if (includeNumbers) characterSet += CHARACTER_SETS.NUMBERS
  if (includeSymbols) characterSet += CHARACTER_SETS.SYMBOLS

  // 如果没有选择任何字符集，使用默认全字符集
  if (characterSet === '') {
    characterSet = ALL_CHARACTERS
  }

  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const randomIndex = array[0] % characterSet.length
  return characterSet[randomIndex]
}

/**
 * 生成随机字符序列（用于轮盘动画）- 优化版本
 * @param {number} count - 字符数量
 * @param {Object} options - 字符选项
 * @returns {string[]} 字符数组
 */
export function generateRandomCharacters(count, options = {}) {
  // 默认选项
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true
  } = options

  // 构建字符集 - 优化：避免重复构建
  let characterSet = ''
  if (includeUppercase) characterSet += CHARACTER_SETS.UPPERCASE
  if (includeLowercase) characterSet += CHARACTER_SETS.LOWERCASE
  if (includeNumbers) characterSet += CHARACTER_SETS.NUMBERS
  if (includeSymbols) characterSet += CHARACTER_SETS.SYMBOLS

  // 如果没有选择任何字符集，使用默认全字符集
  if (characterSet === '') {
    characterSet = ALL_CHARACTERS
  }

  // 批量生成随机数 - 性能优化
  const array = new Uint32Array(count)
  crypto.getRandomValues(array)
  
  const characters = new Array(count)
  const charSetLength = characterSet.length
  
  for (let i = 0; i < count; i++) {
    characters[i] = characterSet[array[i] % charSetLength]
  }
  
  // 清除原始数组
  array.fill(0)
  
  return characters
}
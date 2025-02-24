/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密碼
   */
  password: string;

  /**
   * 驗證碼缓存key
   */
  captchaKey?: string;

  /**
   * 驗證碼
   */
  captchaCode?: string;
}

/**
 * 登录响应
 */
export interface LoginResult {
  /**
   * 访问token
   */
  accessToken?: string;
  /**
   * 过期时间(单位：毫秒)
   */
  expires?: number;
  /**
   * 刷新token
   */
  refreshToken?: string;
  /**
   * token 类型
   */
  tokenType?: string;
}

/**
 * 驗證碼响应
 */
export interface CaptchaResult {
  /**
   * 驗證碼缓存key
   */
  captchaKey: string;
  /**
   * 驗證碼图片Base64字符串
   */
  captchaBase64: string;
}

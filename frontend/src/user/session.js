const SESSION_KEY = 'hiensach.customer'

export function getSessionUser() {
  try {
    const stored = window.localStorage.getItem(SESSION_KEY)
    if (!stored) return null
    const user = JSON.parse(stored)
    return typeof user.username === 'string' && user.username
      ? user
      : null
  } catch (error) {
    console.error('Không thể đọc thông tin phiên đăng nhập:', error)
    return null
  }
}

export function setSessionUser(user) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event('session-updated'))
}

export function clearSessionUser() {
  window.localStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('session-updated'))
}

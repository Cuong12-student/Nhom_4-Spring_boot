import { getSessionUser } from '../user/session'

const base = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/v1/staff`

export async function staffRequest(path, { method = 'GET', body, signal } = {}) {
  const session = getSessionUser()
  if (!session?.token || session.role !== 'STAFF') {
    throw new Error('Vui lòng đăng nhập bằng tài khoản nhân viên.')
  }
  const response = await fetch(`${base}${path}`, {
    method,
    signal,
    headers: {
      Authorization: `Bearer ${session.token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await response.text()
  let result = null
  if (text) {
    try {
      result = JSON.parse(text)
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error
      result = text
    }
  }
  if (!response.ok) {
    const message = typeof result === 'string' ? result : result?.detail || result?.message
    throw new Error(message || `Yêu cầu thất bại (HTTP ${response.status}).`)
  }
  return result
}

export async function logoutStaff(token) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? ''}/api/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Không thể đăng xuất. Vui lòng thử lại.')
}

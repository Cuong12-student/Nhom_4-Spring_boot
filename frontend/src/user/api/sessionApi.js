import { getSessionUser } from '../session'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export async function logout() {
  const token = getSessionUser()?.token
  if (!token) return
  const response = await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error(`Đăng xuất thất bại (HTTP ${response.status})`)
  }
}

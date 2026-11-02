import { getSessionUser } from '../session'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function request(path, { method = 'GET', body, signal } = {}) {
  const token = getSessionUser()?.token
  if (!token) throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!response.ok) {
    const bodyText = await response.text()
    let message = bodyText
    try {
      const problem = JSON.parse(bodyText)
      message = problem.detail || problem.message || problem.title || bodyText
    } catch (parseError) {
      if (!(parseError instanceof SyntaxError)) throw parseError
    }
    throw new Error(message || `Yêu cầu thất bại (HTTP ${response.status})`)
  }
  if (response.status === 204) return null
  return response.json()
}

export const fetchCart = (signal) => request('/api/v1/cart', { signal })

export const addCartItem = (variantId, quantity = 1) =>
  request('/api/v1/cart/items', {
    method: 'POST',
    body: { variantId, quantity },
  })

export const updateCartItem = (itemId, quantity) =>
  request(`/api/v1/cart/items/${itemId}`, {
    method: 'PATCH',
    body: { quantity },
  })

export const removeCartItem = (itemId) =>
  request(`/api/v1/cart/items/${itemId}`, {
    method: 'DELETE',
  })

export const checkoutCart = (itemIds) =>
  request('/api/v1/cart/checkout', {
    method: 'POST',
    body: { itemIds },
  })

export const fetchProfile = (signal) => request('/api/v1/profile', { signal })

export const fetchOrderHistory = (signal) => request('/api/v1/orders', { signal })

export function notifyCartUpdated() {
  window.dispatchEvent(new Event('cart-updated'))
}

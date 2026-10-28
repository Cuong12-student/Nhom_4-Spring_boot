// Gọi API trang cửa hàng của user.
// Trong dev, Vite proxy chuyển /api sang backend (xem vite.config.js).
// Khi deploy khác domain, đặt VITE_API_BASE_URL (ví dụ https://api.example.com).
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

const PRODUCTS_URL = `${API_BASE}/api/v1/store-page/products`
const FILTER_OPTIONS_URL = `${API_BASE}/api/v1/store-page/filters`

export class ApiError extends Error {
  constructor(status) {
    super(`HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
  }
}

async function getJson(url, signal) {
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new ApiError(response.status)
  return response.json()
}

/**
 * Chuyển state bộ lọc thành query string đúng với StorePageController:
 * q, minPrice, maxPrice, productId/categoryId (có thể lặp lại khi chọn nhiều),
 * attribute.<Tên>=<giá trị> (lặp lại nếu chọn nhiều giá trị), sort, direction, page, size.
 */
export function buildProductQuery(filters) {
  const params = new URLSearchParams()
  const keyword = filters.q.trim()

  if (keyword) params.set('q', keyword)
  filters.categoryIds.forEach((id) => params.append('categoryId', id))
  filters.productIds.forEach((id) => params.append('productId', id))
  if (filters.minPrice != null) params.set('minPrice', filters.minPrice)
  if (filters.maxPrice != null) params.set('maxPrice', filters.maxPrice)

  Object.entries(filters.attributes).forEach(([name, values]) => {
    values.forEach((value) => params.append(`attribute.${name}`, value))
  })

  params.set('sort', filters.sort)
  params.set('direction', filters.direction)
  params.set('page', filters.page)
  params.set('size', filters.size)
  return params.toString()
}

export function fetchStoreProducts(query, signal) {
  return getJson(`${PRODUCTS_URL}?${query}`, signal)
}

/**
 * Các lựa chọn của bộ lọc, lấy từ DB:
 * {
 *   categories: [{ idCategory, name }],
 *   products:   [{ idProduct, name, idCategory }],
 *   attributes: { Color: ['Blue', ...], Size: ['A4', ...] },
 *   minPrice, maxPrice
 * }
 */
export function fetchFilterOptions(signal) {
  return getJson(FILTER_OPTIONS_URL, signal)
}

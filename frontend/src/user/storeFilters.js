// Trạng thái và hằng số của bộ lọc trang cửa hàng.

export const INITIAL_FILTERS = {
  q: '',
  categoryIds: [],
  productIds: [],
  minPrice: null,
  maxPrice: null,
  attributes: {}, // { Color: ['Blue'], Size: ['A4', 'A5'] }
  sort: 'createdAt',
  direction: 'DESC',
  page: 0,
  size: 12,
}

// Backend chỉ chấp nhận tên thuộc tính gồm chữ, số, "_" và "-".
export const VALID_ATTRIBUTE_NAME = /^[A-Za-z0-9_-]+$/

export const SORT_OPTIONS = [
  { value: 'createdAt:DESC', label: 'Mới nhất', sort: 'createdAt', direction: 'DESC' },
  { value: 'createdAt:ASC', label: 'Cũ nhất', sort: 'createdAt', direction: 'ASC' },
  { value: 'popular:DESC', label: 'Phổ biến nhất', sort: 'popular', direction: 'DESC' },
  { value: 'popular:ASC', label: 'Ít phổ biến nhất', sort: 'popular', direction: 'ASC' },
  { value: 'price:ASC', label: 'Giá thấp đến cao', sort: 'price', direction: 'ASC' },
  { value: 'price:DESC', label: 'Giá cao đến thấp', sort: 'price', direction: 'DESC' },
  { value: 'name:ASC', label: 'Tên A đến Z', sort: 'name', direction: 'ASC' },
  { value: 'name:DESC', label: 'Tên Z đến A', sort: 'name', direction: 'DESC' },
]

export const PAGE_SIZES = [12, 24, 48]

const ATTRIBUTE_LABELS = {
  size: 'Kích thước',
  color: 'Màu sắc',
  colour: 'Màu sắc',
}

export function attributeLabel(name) {
  return ATTRIBUTE_LABELS[name.toLowerCase()] ?? name
}

export function isColorAttribute(name) {
  return ['color', 'colour'].includes(name.toLowerCase())
}

export function countActiveFilters(filters) {
  const attributeCount = Object.values(filters.attributes).reduce((sum, values) => sum + values.length, 0)
  return (
    (filters.q.trim() ? 1 : 0) +
    filters.categoryIds.length +
    filters.productIds.length +
    (filters.minPrice != null || filters.maxPrice != null ? 1 : 0) +
    attributeCount
  )
}

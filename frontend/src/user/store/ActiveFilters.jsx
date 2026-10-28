import { formatPrice } from '../format'
import { attributeLabel } from '../storeFilters'

export default function ActiveFilters({
  filters,
  options,
  onClearKeyword,
  onToggleCategory,
  onToggleProduct,
  onPriceChange,
  onToggleAttribute,
  onClear,
}) {
  const chips = []

  if (filters.q.trim()) {
    chips.push({ key: 'q', label: `Từ khóa: ${filters.q.trim()}`, remove: onClearKeyword })
  }

  filters.categoryIds.forEach((categoryId) => {
    const category = options?.categories.find((item) => item.idCategory === categoryId)
    chips.push({
      key: `category-${categoryId}`,
      label: `Danh mục: ${category?.name ?? `#${categoryId}`}`,
      remove: () => onToggleCategory(categoryId),
    })
  })

  filters.productIds.forEach((productId) => {
    const product = options?.products.find((item) => item.idProduct === productId)
    chips.push({
      key: `product-${productId}`,
      label: `Sản phẩm: ${product?.name ?? `#${productId}`}`,
      remove: () => onToggleProduct(productId),
    })
  })

  if (filters.minPrice != null || filters.maxPrice != null) {
    const from = filters.minPrice != null ? formatPrice(filters.minPrice) : null
    const to = filters.maxPrice != null ? formatPrice(filters.maxPrice) : null
    const label = from && to ? `${from} – ${to}` : from ? `Từ ${from}` : `Đến ${to}`
    chips.push({ key: 'price', label: `Giá: ${label}`, remove: () => onPriceChange({ min: null, max: null }) })
  }

  Object.entries(filters.attributes).forEach(([name, values]) => {
    values.forEach((value) => {
      chips.push({
        key: `attr-${name}-${value}`,
        label: `${attributeLabel(name)}: ${value}`,
        remove: () => onToggleAttribute(name, value),
      })
    })
  })

  if (chips.length === 0) return null

  return (
    <div className="us-active" aria-label="Bộ lọc đang áp dụng">
      {chips.map((chip) => (
        <button key={chip.key} type="button" className="us-tag" onClick={chip.remove}>
          {chip.label}
          <span aria-hidden="true">×</span>
          <span className="us-sr">Bỏ lọc</span>
        </button>
      ))}
      <button type="button" className="us-link-btn" onClick={onClear}>
        Xóa tất cả
      </button>
    </div>
  )
}

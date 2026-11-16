import PriceRange from './PriceRange'
import {
  VALID_ATTRIBUTE_NAME,
  attributeLabel,
  isColorAttribute,
} from '../storeFilters'

function swatchColor(value) {
  return typeof CSS !== 'undefined' && CSS.supports('color', value) ? value : null
}

function Section({ title, children }) {
  return (
    <details className="us-section" open>
      <summary>{title}</summary>
      <div className="us-section__body">{children}</div>
    </details>
  )
}

function PanelSkeleton() {
  return (
    <div className="us-skeleton-list" aria-hidden="true">
      {[70, 90, 60, 80, 50, 75].map((width, index) => (
        <span key={index} className="us-skeleton" style={{ width: `${width}%` }} />
      ))}
    </div>
  )
}

export default function FilterPanel({
  options,
  loading,
  error,
  onRetry,
  filters,
  activeCount,
  open,
  onClose,
  onToggleCategory,
  onToggleProduct,
  onPriceChange,
  onToggleAttribute,
  onClear,
}) {
  const products = options
    ? options.products.filter(
        (product) =>
          filters.categoryIds.length === 0 || filters.categoryIds.includes(product.idCategory),
      )
    : []

  const attributeEntries = options
    ? Object.entries(options.attributes ?? {}).filter(
        ([name, values]) => VALID_ATTRIBUTE_NAME.test(name) && values.length > 0,
      )
    : []

  const hasPriceRange =
    options && options.minPrice != null && options.maxPrice != null && options.minPrice < options.maxPrice

  return (
    <>
      <div
        className={`us-overlay${open ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`us-filters${open ? ' is-open' : ''}`} aria-label="Bộ lọc sản phẩm">
        <div className="us-filters__head">
          <h2>Bộ lọc</h2>
          {activeCount > 0 && (
            <button type="button" className="us-link-btn" onClick={onClear}>
              Xóa tất cả
            </button>
          )}
          <button type="button" className="us-filters__close" onClick={onClose} aria-label="Đóng bộ lọc">
            ×
          </button>
        </div>

        {loading && <PanelSkeleton />}

        {error && (
          <div className="us-notice" role="alert">
            <p>Không tải được các lựa chọn bộ lọc.</p>
            <button type="button" className="us-btn us-btn--small" onClick={onRetry}>
              Thử lại
            </button>
          </div>
        )}

        {options && (
          <>
            <Section title="Danh mục">
              <div className="us-options us-options--scroll" role="group" aria-label="Danh mục">
                {options.categories.map((category) => (
                  <button
                    key={category.idCategory}
                    type="button"
                    aria-pressed={filters.categoryIds.includes(category.idCategory)}
                    className={`us-option${filters.categoryIds.includes(category.idCategory) ? ' is-selected' : ''}`}
                    onClick={() => onToggleCategory(category.idCategory)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Sản phẩm">
              <div className="us-options us-options--scroll" role="group" aria-label="Sản phẩm">
                {products.map((product) => (
                  <button
                    key={product.idProduct}
                    type="button"
                    aria-pressed={filters.productIds.includes(product.idProduct)}
                    className={`us-option${filters.productIds.includes(product.idProduct) ? ' is-selected' : ''}`}
                    onClick={() => onToggleProduct(product.idProduct)}
                  >
                    {product.name}
                  </button>
                ))}
                {products.length === 0 && (
                  <p className="us-options__empty">Không có sản phẩm trong danh mục đã chọn.</p>
                )}
              </div>
            </Section>

            {hasPriceRange && (
              <Section title="Khoảng giá">
                <PriceRange
                  bounds={{ min: options.minPrice, max: options.maxPrice }}
                  value={{ min: filters.minPrice, max: filters.maxPrice }}
                  onCommit={onPriceChange}
                />
              </Section>
            )}

            {attributeEntries.map(([name, values]) => {
              const selected = filters.attributes[name] ?? []
              const colorGroup = isColorAttribute(name)
              return (
                <Section key={name} title={attributeLabel(name)}>
                  <div className="us-chips">
                    {values.map((value) => {
                      const isOn = selected.includes(value)
                      const color = colorGroup ? swatchColor(value) : null
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={isOn}
                          className={`us-chip${isOn ? ' is-selected' : ''}`}
                          onClick={() => onToggleAttribute(name, value)}
                        >
                          {color && <i className="us-chip__swatch" style={{ background: color }} />}
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </Section>
              )
            })}
          </>
        )}
      </aside>
    </>
  )
}

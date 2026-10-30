import { useState } from 'react'
import { formatPrice } from './format'
import './StoreProductDetailPage.css'

const STATUS_LABELS = {
  ACTIVE: 'Đang hoạt động',
  IN_STOCK: 'Còn hàng',
  LOW_STOCK: 'Sắp hết hàng',
  OUT_OF_STOCK: 'Hết hàng',
  INACTIVE: 'Ngừng hoạt động',
}

function formatDate(value) {
  if (!value) return 'Chưa có thông tin'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Chưa có thông tin'
    : new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)
}

function getAttributes(value) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return Object.entries(parsed)
    }
  } catch {
    return [['Thông tin biến thể', value]]
  }
  return [['Thông tin biến thể', JSON.stringify(value)]]
}

function formatAttributeValue(value) {
  if (value == null || value === '') return 'Chưa cập nhật'
  return typeof value === 'string' ? value : JSON.stringify(value)
}

function ProductImage({ product }) {
  const [broken, setBroken] = useState(false)
  const image = product.variantImage || product.mainImage

  if (!image || broken) {
    return (
      <div className="us-detail__placeholder" role="img" aria-label="Không có ảnh sản phẩm">
        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <circle cx="9" cy="10" r="1.8" />
          <path d="M4 18l5.5-5 3.5 3 3-2.5L20 17" />
        </svg>
        <span>Chưa có hình ảnh</span>
      </div>
    )
  }

  return (
    <img
      className="us-detail__image"
      src={image}
      alt={product.name}
      onError={() => setBroken(true)}
    />
  )
}

function DetailRows({ rows }) {
  return (
    <dl className="us-detail__rows">
      {rows.map(([label, value]) => (
        <div className="us-detail__row" key={label}>
          <dt>{label}</dt>
          <dd>{value == null || value === '' ? 'Chưa có thông tin' : value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function StoreProductDetailPage({
  product,
  loading,
  error,
  onRetry,
  onBack,
}) {
  const attributes = product ? getAttributes(product.attributes) : []

  return (
    <main className="us-container us-detail">
      <button type="button" className="us-link-btn us-detail__back" onClick={onBack}>
        <span aria-hidden="true">←</span> Quay lại cửa hàng
      </button>

      {loading ? (
        <div className="us-state" role="status" aria-live="polite">
          <h1>Đang tải thông tin sản phẩm...</h1>
        </div>
      ) : error ? (
        <div className="us-state" role="alert">
          <h1>Không tải được thông tin sản phẩm</h1>
          <p>
            {error.status === 404
              ? 'Sản phẩm không tồn tại hoặc hiện không được bày bán.'
              : 'Vui lòng kiểm tra kết nối và thử lại.'}
          </p>
          {error.status !== 404 && (
            <button type="button" className="us-btn" onClick={onRetry}>
              Thử lại
            </button>
          )}
        </div>
      ) : product ? (
        <>
          <nav className="us-detail__breadcrumb" aria-label="Điều hướng">
            <button type="button" onClick={onBack}>Cửa hàng</button>
            <span aria-hidden="true">/</span>
            <span>{product.categoryName}</span>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>

          <section className="us-detail__panel">
            <div className="us-detail__gallery">
              <ProductImage product={product} />
              {product.variantImage && product.mainImage && product.variantImage !== product.mainImage && (
                <p className="us-detail__image-note">Hình ảnh biến thể đang chọn</p>
              )}
            </div>

            <div className="us-detail__content">
              <span className="us-detail__category">{product.categoryName}</span>
              <h1>{product.name}</h1>
              <div className="us-detail__identity">
                <span>Mã SKU: <strong>{product.sku}</strong></span>
                <span>Mã biến thể: <strong>#{product.idVariant}</strong></span>
              </div>

              <p className="us-detail__price">{formatPrice(product.price)}</p>
              <p className="us-detail__stock">
                {product.inventoryQuantity == null
                  ? 'Tồn kho: Chưa cập nhật'
                  : product.inventoryQuantity > 0
                    ? `Còn ${product.inventoryQuantity} sản phẩm`
                    : 'Tạm hết hàng'}
              </p>

              <button type="button" className="us-btn us-detail__buy">
                Mua ngay
              </button>

              <section className="us-detail__section">
                <h2>Mô tả sản phẩm</h2>
                <p className="us-detail__description">
                  {product.description || 'Sản phẩm chưa có mô tả chi tiết.'}
                </p>
              </section>

              <section className="us-detail__section">
                <h2>Thông tin biến thể</h2>
                {attributes.length > 0 ? (
                  <DetailRows
                    rows={attributes.map(([name, value]) => [
                      name,
                      formatAttributeValue(value),
                    ])}
                  />
                ) : (
                  <p className="us-detail__muted">Sản phẩm không có thuộc tính biến thể.</p>
                )}
              </section>

              <section className="us-detail__section">
                <h2>Danh mục</h2>
                <DetailRows
                  rows={[
                    ['Tên danh mục', product.categoryName],
                    ['Mô tả danh mục', product.categoryDescription],
                    ['Mã danh mục', product.idCategory],
                  ]}
                />
              </section>

              <details className="us-detail__technical">
                <summary>Thông tin quản lý và cập nhật</summary>
                <DetailRows
                  rows={[
                    ['Mã sản phẩm', product.idProduct],
                    ['Đường dẫn sản phẩm', product.slug],
                    ['Trạng thái biến thể', STATUS_LABELS[product.variantStatus] || product.variantStatus],
                    ['Trạng thái sản phẩm', STATUS_LABELS[product.productStatus] || product.productStatus],
                    ['Trạng thái danh mục', STATUS_LABELS[product.categoryStatus] || product.categoryStatus],
                    ['Mã kho', product.idInventory],
                    ['Số lượng tồn kho', product.inventoryQuantity],
                    ['Tạo biến thể lúc', formatDate(product.createdAt)],
                    ['Cập nhật biến thể lúc', formatDate(product.updatedAt)],
                    ['Tạo sản phẩm lúc', formatDate(product.productCreatedAt)],
                    ['Cập nhật sản phẩm lúc', formatDate(product.productUpdatedAt)],
                    ['Tạo danh mục lúc', formatDate(product.categoryCreatedAt)],
                    ['Cập nhật danh mục lúc', formatDate(product.categoryUpdatedAt)],
                    ['Tạo thông tin kho lúc', formatDate(product.inventoryCreatedAt)],
                    ['Cập nhật thông tin kho lúc', formatDate(product.inventoryUpdatedAt)],
                  ]}
                />
              </details>
            </div>
          </section>
        </>
      ) : null}
    </main>
  )
}

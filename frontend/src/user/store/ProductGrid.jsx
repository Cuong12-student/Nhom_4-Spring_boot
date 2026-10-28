import ProductCard from './ProductCard'

function SkeletonCard() {
  return (
    <div className="us-card us-card--skeleton" aria-hidden="true">
      <div className="us-card__media us-skeleton" />
      <div className="us-card__body">
        <span className="us-skeleton" style={{ width: '80%' }} />
        <span className="us-skeleton" style={{ width: '40%' }} />
        <span className="us-skeleton" style={{ width: '55%' }} />
      </div>
    </div>
  )
}

export default function ProductGrid({ products, loading, skeletonCount }) {
  // Lần tải đầu tiên: chưa có dữ liệu nên hiện khung chờ.
  if (!products) {
    return (
      <div className="us-grid" aria-busy="true" aria-label="Đang tải sản phẩm">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className={`us-grid${loading ? ' is-loading' : ''}`} aria-busy={loading}>
      {products.map((product) => (
        <ProductCard key={product.idVariant} product={product} />
      ))}
    </div>
  )
}

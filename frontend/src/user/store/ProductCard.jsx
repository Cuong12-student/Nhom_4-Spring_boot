import { useState } from 'react'
import { formatPrice } from '../format'

function ImagePlaceholder() {
  return (
    <div className="us-card__placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <circle cx="9" cy="10" r="1.8" />
        <path d="M4 18l5.5-5 3.5 3 3-2.5L20 17" />
      </svg>
    </div>
  )
}

export default function ProductCard({ product }) {
  const [broken, setBroken] = useState(false)
  const showImage = product.mainImage && !broken

  return (
    <article className="us-card">
      <div className="us-card__media">
        {showImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            loading="lazy"
            onError={() => setBroken(true)}
          />
        ) : (
          <ImagePlaceholder />
        )}
        <span className="us-card__category">{product.categoryName}</span>
      </div>
      <div className="us-card__body">
        <h3 className="us-card__name" title={product.name}>
          {product.name}
        </h3>
        <p className="us-card__sku">{product.sku}</p>
        <p className="us-card__price">{formatPrice(product.price)}</p>
      </div>
    </article>
  )
}

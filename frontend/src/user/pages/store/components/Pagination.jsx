function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index)

  const items = [0]
  const start = Math.max(1, current - 1)
  const end = Math.min(total - 2, current + 1)
  if (start > 1) items.push('gap-left')
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < total - 2) items.push('gap-right')
  items.push(total - 1)
  return items
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className="us-pagination" aria-label="Phân trang">
      <button
        type="button"
        className="us-page"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        aria-label="Trang trước"
      >
        ‹
      </button>

      {pageItems(page, totalPages).map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="us-page-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`us-page${item === page ? ' is-current' : ''}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
          >
            {item + 1}
          </button>
        ),
      )}

      <button
        type="button"
        className="us-page"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
        aria-label="Trang sau"
      >
        ›
      </button>
    </nav>
  )
}

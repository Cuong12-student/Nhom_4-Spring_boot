import { useState } from 'react'
import { formatPrice } from '../format'

// Chọn bước nhảy "tròn" theo độ rộng khoảng giá (ví dụ 495.000 -> 1.000).
function niceStep(span) {
  if (span <= 0) return 1
  return Math.max(1, 10 ** (Math.floor(Math.log10(span)) - 2))
}

/**
 * Thanh chọn khoảng giá hai đầu. Giá trị min/max của thanh lấy từ DB (bounds).
 * Chỉ gọi onCommit khi người dùng thả tay/rời thanh để tránh gọi API liên tục.
 */
export default function PriceRange({ bounds, value, onCommit }) {
  const [draft, setDraft] = useState(null)

  const step = niceStep(bounds.max - bounds.min)
  const floor = Math.floor(bounds.min / step) * step
  const ceil = Math.ceil(bounds.max / step) * step
  const current = draft ?? {
    min: value.min ?? floor,
    max: value.max ?? ceil,
  }

  function commit() {
    setDraft(null)
    const min = current.min <= floor ? null : current.min
    const max = current.max >= ceil ? null : current.max
    if (min !== value.min || max !== value.max) onCommit({ min, max })
  }

  function handleMin(event) {
    const next = Math.min(Number(event.target.value), current.max - step)
    setDraft({ min: Math.max(floor, next), max: current.max })
  }

  function handleMax(event) {
    const next = Math.max(Number(event.target.value), current.min + step)
    setDraft({ min: current.min, max: Math.min(ceil, next) })
  }

  const span = ceil - floor
  const lowPct = ((current.min - floor) / span) * 100
  const highPct = ((current.max - floor) / span) * 100
  const handlers = {
    onPointerUp: commit,
    onPointerCancel: commit,
    onKeyUp: commit,
    onBlur: commit,
  }

  return (
    <div className="us-price">
      <div className="us-price__values">
        <span className="us-price__box">
          <small>Từ</small>
          {formatPrice(current.min)}
        </span>
        <span className="us-price__dash" aria-hidden="true" />
        <span className="us-price__box">
          <small>Đến</small>
          {formatPrice(current.max)}
        </span>
      </div>

      <div
        className="us-price__slider"
        style={{ '--low': `${lowPct}%`, '--high': `${highPct}%` }}
      >
        <div className="us-price__track" />
        <input
          type="range"
          min={floor}
          max={ceil}
          step={step}
          value={current.min}
          onChange={handleMin}
          aria-label="Giá thấp nhất"
          {...handlers}
        />
        <input
          type="range"
          min={floor}
          max={ceil}
          step={step}
          value={current.max}
          onChange={handleMax}
          aria-label="Giá cao nhất"
          {...handlers}
        />
      </div>

      <div className="us-price__bounds">
        <span>{formatPrice(floor)}</span>
        <span>{formatPrice(ceil)}</span>
      </div>
    </div>
  )
}

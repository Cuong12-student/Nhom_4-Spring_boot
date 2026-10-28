import { useEffect, useRef, useState } from 'react'

/**
 * Ô tìm kiếm theo tên sản phẩm. Gõ xong khoảng 0,4 giây sẽ tự tìm,
 * hoặc bấm Enter / nút tìm kiếm để tìm ngay.
 */
export default function SearchBox({ value, onCommit }) {
  const [draft, setDraft] = useState(null)
  const timer = useRef(null)
  const text = draft ?? value

  useEffect(() => () => clearTimeout(timer.current), [])

  function commit(next) {
    clearTimeout(timer.current)
    setDraft(null)
    if (next !== value) onCommit(next)
  }

  function handleChange(event) {
    const next = event.target.value
    setDraft(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => commit(next), 400)
  }

  return (
    <form
      className="us-search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        commit(text)
      }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={text}
        onChange={handleChange}
        placeholder="Tìm theo tên sản phẩm..."
        aria-label="Tìm kiếm sản phẩm"
      />
      <button type="submit" className="us-btn">
        Tìm kiếm
      </button>
    </form>
  )
}

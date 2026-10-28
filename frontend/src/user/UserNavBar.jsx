import { useState } from 'react'
import { USER_NAV_ITEMS } from './navItems'
import './userTheme.css'
import './UserNavBar.css'

/**
 * Thanh điều hướng dùng chung cho các trang user.
 *
 * @param {string}   activeKey   key của mục đang mở (khớp với navItems).
 * @param {Array}    items       danh sách mục { key, label, href }; mặc định lấy từ navItems.js.
 * @param {string}   brandName   tên hiển thị ở logo.
 * @param {string}   brandHref   đường dẫn khi bấm logo.
 * @param {Function} onNavigate  (tùy chọn) nếu truyền vào, bấm mục sẽ gọi hàm này thay vì
 *                               tải lại trang — dùng khi sau này gắn router.
 * @param {ReactNode} actions    (tùy chọn) vùng bên phải thanh nav cho các nút của trang sau.
 */
export default function UserNavBar({
  activeKey,
  items = USER_NAV_ITEMS,
  brandName = 'School Supplies',
  brandHref = '/',
  onNavigate,
  actions = null,
}) {
  const [open, setOpen] = useState(false)
  const collapsible = items.length > 1

  function handleClick(event, item) {
    setOpen(false)
    if (onNavigate) {
      event.preventDefault()
      onNavigate(item)
    }
  }

  return (
    <header className="un-bar">
      <div className="un-inner">
        <a
          className="un-brand"
          href={brandHref}
          onClick={(event) => handleClick(event, { key: 'home', href: brandHref })}
        >
          <span className="un-brand__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20l1.2-4.4L16.6 4.2a2 2 0 012.8 0l.4.4a2 2 0 010 2.8L8.4 18.8 4 20z" />
              <path d="M14.5 6.3l3.2 3.2" />
            </svg>
          </span>
          <span className="un-brand__name">{brandName}</span>
        </a>

        <nav
          id="un-links"
          className={`un-links${open ? ' is-open' : ''}`}
          aria-label="Điều hướng chính"
        >
          {items.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`un-link${item.key === activeKey ? ' is-active' : ''}`}
              aria-current={item.key === activeKey ? 'page' : undefined}
              onClick={(event) => handleClick(event, item)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="un-actions">{actions}</div>

        {collapsible && (
          <button
            type="button"
            className="un-toggle"
            aria-label={open ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={open}
            aria-controls="un-links"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </div>
    </header>
  )
}

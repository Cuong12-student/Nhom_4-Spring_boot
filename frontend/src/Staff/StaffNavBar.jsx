import StaffIcon from './StaffIcon'

const sections = [
  ['orders', 'Trạng thái đơn hàng'],
  ['inventory', 'Kho'],
  ['statistics', 'Thống kê'],
]

export default function StaffNavBar({ section, onSelect, username, onLogout }) {
  return (
    <header className="staff-header">
      <div className="staff-header-inner">
        <a className="staff-brand" href="/">
          <span className="staff-brand-mark"><StaffIcon name="book" /></span>
          <span><strong>Hiên Sách</strong><small>Không gian nhân viên</small></span>
        </a>
        <nav className="staff-nav" aria-label="Điều hướng nhân viên">
          {sections.map(([key, label]) => (
            <button key={key} type="button" className={section === key ? 'active' : ''}
              aria-current={section === key ? 'page' : undefined} onClick={() => onSelect(key)}>
              <StaffIcon name={key} />{label}
            </button>
          ))}
        </nav>
        <div className="staff-account"><span className="staff-account-avatar" aria-hidden="true">{username.slice(0, 1).toUpperCase()}</span>
          <span className="staff-account-name">{username}</span><button type="button" onClick={onLogout}>Đăng xuất</button></div>
      </div>
    </header>
  )
}


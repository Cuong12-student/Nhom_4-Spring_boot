import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCart, fetchOrderHistory, fetchProfile } from './api/cartApi'
import { logout } from './api/sessionApi'
import { formatPrice } from './format'
import UserFooter from './UserFooter'
import UserNavBar from './UserNavBar'
import { clearSessionUser, getSessionUser } from './session'
import './userTheme.css'
import './customerPages.css'

const ORDER_STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang chuẩn bị',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
}

function formatOrderDate(value) {
  if (!value) return 'Chưa có thông tin'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Chưa có thông tin'
    : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function displayValue(value) {
  return value == null || value === '' ? 'Chưa cập nhật' : value
}

export default function UserProfilePage() {
  const navigate = useNavigate()
  const user = getSessionUser()
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(Boolean(user))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.username) return undefined
    const controller = new AbortController()
    Promise.all([
      fetchProfile(controller.signal),
      fetchOrderHistory(controller.signal),
      fetchCart(controller.signal),
    ])
      .then(([customer, orderHistory, cart]) => {
        setProfile(customer)
        setOrders(orderHistory)
        setCartCount(cart.totalQuantity)
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          console.error('Không thể tải hồ sơ khách hàng:', requestError)
          setError('Không thể tải thông tin tài khoản. Vui lòng thử lại.')
        }
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [user?.username])

  async function handleLogout() {
    try {
      await logout()
    } catch (requestError) {
      console.error('Không thể kết thúc phiên đăng nhập trên máy chủ:', requestError)
    }
    clearSessionUser()
    navigate('/login')
  }

  return (
    <div className="cp-page">
      <UserNavBar activeKey="profile" />
      <main>
        <header className="cp-page-title">
          <div className="cp-container">
            <h1>Tài khoản của tôi</h1>
            <p>Thông tin cá nhân và các đơn hàng bạn đã đặt tại Hiên Sách.</p>
          </div>
        </header>
        <section className="cp-container cp-content">
          {!user ? (
            <div className="cp-panel cp-empty">
              <h2>Đăng nhập để xem hồ sơ</h2>
              <p>Thông tin tài khoản và lịch sử mua hàng chỉ hiển thị với bạn.</p>
              <a className="cp-button" href="/login">Đăng nhập</a>
            </div>
          ) : loading ? (
            <div className="cp-panel cp-message" role="status">Đang tải hồ sơ...</div>
          ) : error ? (
            <div className="cp-panel cp-empty" role="alert">
              <div className="cp-inline-alert">{error}</div>
              <button className="cp-button cp-button--light" type="button" onClick={() => window.location.reload()}>
                Tải lại trang
              </button>
            </div>
          ) : (
            <>
              <div className="cp-profile-grid">
                <aside className="cp-panel cp-profile-card">
                  <div className="cp-profile-avatar" aria-hidden="true">
                    {(profile?.name ?? user.username).slice(0, 1).toLocaleUpperCase('vi-VN')}
                  </div>
                  <h2>{displayValue(profile?.name)}</h2>
                  <p>@{profile?.username ?? user.username}</p>
                  <a className="cp-cart-profile-link" href="/cart">
                    <span>Giỏ hàng của tôi</span>
                    <span aria-label={`${cartCount} sản phẩm`}>{cartCount}</span>
                  </a>
                  <a className="cp-cart-profile-link" href="/store">
                    <span>Tiếp tục mua sắm</span>
                    <span aria-hidden="true">→</span>
                  </a>
                  <button className="cp-logout" type="button" onClick={handleLogout}>Đăng xuất</button>
                </aside>

                <section className="cp-panel cp-profile-details">
                  <h2>Thông tin cá nhân</h2>
                  <dl>
                    <div><dt>Họ và tên</dt><dd>{displayValue(profile?.name)}</dd></div>
                    <div><dt>Tên đăng nhập</dt><dd>{displayValue(profile?.username)}</dd></div>
                    <div><dt>Email</dt><dd>{displayValue(profile?.email)}</dd></div>
                    <div><dt>Số điện thoại</dt><dd>{displayValue(profile?.phone)}</dd></div>
                    <div><dt>Tuổi</dt><dd>{displayValue(profile?.age)}</dd></div>
                    <div><dt>Giới tính</dt><dd>{profile?.gender === 'Male' ? 'Nam' : profile?.gender === 'Female' ? 'Nữ' : displayValue(profile?.gender)}</dd></div>
                    <div><dt>Địa chỉ nhận hàng</dt><dd>{displayValue(profile?.address)}</dd></div>
                    <div><dt>Mã khách hàng</dt><dd>{displayValue(profile?.idCustomer)}</dd></div>
                  </dl>
                </section>
              </div>

              <section className="cp-panel cp-orders">
                <h2>Lịch sử đơn hàng ({orders.length})</h2>
                {orders.length ? orders.map((order) => (
                  <article className="cp-order-card" key={order.idOrder}>
                    <div className="cp-order-card__head">
                      <div>
                        <strong>Đơn hàng #{order.idOrder}</strong>
                        <p>{formatOrderDate(order.orderDate)}</p>
                      </div>
                      <span className="cp-order-status">{ORDER_STATUS_LABELS[order.status] || order.status}</span>
                    </div>
                    <p className="cp-order-card__items">
                      {order.items.map((item) => `${item.productName} × ${item.quantity}`).join(' · ')}
                    </p>
                    <div className="cp-order-card__total">
                      <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </article>
                )) : (
                  <div className="cp-empty">
                    <p>Bạn chưa có đơn hàng nào. Những đơn đã xác nhận sẽ được lưu tại đây.</p>
                    <a className="cp-button" href="/store">Khám phá cửa hàng</a>
                  </div>
                )}
              </section>
            </>
          )}
        </section>
      </main>
      <UserFooter />
    </div>
  )
}

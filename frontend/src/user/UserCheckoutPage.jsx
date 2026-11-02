import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { checkoutCart, fetchCart, fetchProfile, notifyCartUpdated } from './api/cartApi'
import { formatPrice } from './format'
import UserFooter from './UserFooter'
import UserNavBar from './UserNavBar'
import { getSessionUser } from './session'
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

export default function UserCheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const user = getSessionUser()
  const itemIds = useMemo(
    () => [...new Set(
      (searchParams.get('items') ?? '')
        .split(',')
        .map(Number)
        .filter((id) => Number.isSafeInteger(id) && id > 0),
    )],
    [searchParams],
  )
  const [items, setItems] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(Boolean(user?.username && itemIds.length))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (!user?.username || !itemIds.length) return undefined
    const controller = new AbortController()
    Promise.all([
      fetchCart(controller.signal),
      fetchProfile(controller.signal),
    ])
      .then(([cart, customer]) => {
        const selected = cart.items.filter((item) => itemIds.includes(item.idCartItem))
        setItems(selected)
        setProfile(customer)
        if (selected.length !== itemIds.length) {
          setError('Một số sản phẩm không còn trong giỏ. Vui lòng quay lại kiểm tra lựa chọn.')
        }
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          console.error('Không thể tải thông tin thanh toán:', requestError)
          setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại.')
        }
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [user?.username, itemIds])

  const total = items.reduce((sum, item) => sum + Number(item.lineTotal), 0)

  async function placeOrder(event) {
    event.preventDefault()
    if (!items.length || items.length !== itemIds.length) {
      setError('Vui lòng quay lại giỏ hàng và chọn lại sản phẩm cần thanh toán.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const result = await checkoutCart(itemIds)
      setOrder(result)
      notifyCartUpdated()
    } catch (requestError) {
      console.error('Không thể tạo đơn hàng:', requestError)
      setError(requestError.message || 'Chưa thể tạo đơn hàng. Vui lòng kiểm tra lại giỏ hàng.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="cp-page">
      <UserNavBar activeKey="cart" />
      <main>
        <header className="cp-page-title">
          <div className="cp-container">
            <h1>Thanh toán</h1>
            <p>Kiểm tra thông tin nhận hàng và xác nhận đơn mua của bạn.</p>
          </div>
        </header>
        <section className="cp-container cp-content">
          {!user ? (
            <div className="cp-panel cp-empty">
              <h2>Vui lòng đăng nhập</h2>
              <p>Đăng nhập để tiếp tục thanh toán và lưu lịch sử đơn hàng.</p>
              <a className="cp-button" href="/login">Đăng nhập</a>
            </div>
          ) : loading ? (
            <div className="cp-panel cp-message" role="status">Đang chuẩn bị thông tin thanh toán...</div>
          ) : order ? (
            <section className="cp-panel cp-order-complete" aria-live="polite">
              <div className="cp-order-complete__icon" aria-hidden="true">✓</div>
              <h2>Đặt hàng thành công</h2>
              <p>Mã đơn hàng <strong>#{order.idOrder}</strong> · {ORDER_STATUS_LABELS[order.status] || order.status}</p>
              <p>Đơn hàng có tổng giá trị {formatPrice(order.totalAmount)}. Đây là luồng thanh toán minh họa, chưa phát sinh giao dịch trực tuyến.</p>
              <button className="cp-button" type="button" onClick={() => navigate('/profile')}>
                Xem lịch sử đơn hàng
              </button>
            </section>
          ) : !itemIds.length ? (
            <div className="cp-panel cp-empty">
              <h2>Chưa có sản phẩm thanh toán</h2>
              <p>Hãy chọn ít nhất một sản phẩm từ giỏ hàng trước khi tiếp tục.</p>
              <a className="cp-button" href="/cart">Quay lại giỏ hàng</a>
            </div>
          ) : (
            <form className="cp-checkout-layout" onSubmit={placeOrder}>
              <section className="cp-panel cp-checkout-form">
                <h2>Thông tin nhận hàng</h2>
                <p>Thông tin được lấy từ hồ sơ tài khoản để cửa hàng liên hệ xác nhận.</p>
                {error && <div className="cp-inline-alert" role="alert">{error}</div>}
                <div className="cp-form-field">
                  <label htmlFor="checkout-name">Người nhận</label>
                  <input id="checkout-name" value={profile?.name ?? ''} readOnly />
                </div>
                <div className="cp-form-field">
                  <label htmlFor="checkout-phone">Số điện thoại</label>
                  <input id="checkout-phone" value={profile?.phone ?? ''} readOnly />
                </div>
                <div className="cp-form-field">
                  <label htmlFor="checkout-address">Địa chỉ giao hàng</label>
                  <textarea id="checkout-address" rows="3" value={profile?.address ?? ''} readOnly />
                </div>
                <h2>Phương thức thanh toán</h2>
                <label className="cp-payment-option">
                  <input type="radio" name="payment" checked readOnly />
                  <span>
                    <strong>Thanh toán khi nhận hàng</strong>
                    <small>Đơn hàng được ghi nhận ở trạng thái chờ xác nhận. Chưa có giao dịch thu tiền trực tuyến.</small>
                  </span>
                </label>
              </section>

              <aside className="cp-panel cp-checkout-summary">
                <h2>Sản phẩm đã chọn ({items.length})</h2>
                {items.map((item) => (
                  <div className="cp-checkout-summary__line" key={item.idCartItem}>
                    <span>{item.productName} × {item.quantity}</span>
                    <strong>{formatPrice(item.lineTotal)}</strong>
                  </div>
                ))}
                <div className="cp-summary-row cp-summary-row--total">
                  <span>Tổng cộng</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <button className="cp-button" type="submit" disabled={submitting || !items.length}>
                  {submitting ? 'Đang tạo đơn hàng...' : 'Xác nhận đặt hàng'}
                </button>
                <p className="cp-cart-summary__note">
                  Bằng cách xác nhận, bạn đồng ý để cửa hàng liên hệ về đơn hàng này.
                </p>
              </aside>
            </form>
          )}
        </section>
      </main>
      <UserFooter />
    </div>
  )
}

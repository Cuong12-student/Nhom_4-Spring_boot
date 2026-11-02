import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCart, notifyCartUpdated, removeCartItem, updateCartItem } from './api/cartApi'
import { formatPrice } from './format'
import UserFooter from './UserFooter'
import UserNavBar from './UserNavBar'
import { getSessionUser } from './session'
import './userTheme.css'
import './customerPages.css'

function productPath(item) {
  return `/store/${encodeURIComponent(item.slug)}/${encodeURIComponent(item.sku)}`
}

export default function UserCartPage() {
  const navigate = useNavigate()
  const user = getSessionUser()
  const [cart, setCart] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(Boolean(user))
  const [busyItem, setBusyItem] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.username) return undefined
    const controller = new AbortController()
    fetchCart(controller.signal)
      .then((result) => {
        setCart(result)
        setSelectedIds(result.items.map((item) => item.idCartItem))
        setError('')
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          console.error('Không thể tải giỏ hàng:', requestError)
          setError('Không thể tải giỏ hàng. Vui lòng kiểm tra kết nối và thử lại.')
        }
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [user?.username])

  const selectedItems = useMemo(
    () => (cart?.items ?? []).filter((item) => selectedIds.includes(item.idCartItem)),
    [cart, selectedIds],
  )
  const selectedTotal = selectedItems.reduce((sum, item) => sum + Number(item.lineTotal), 0)
  const selectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const allSelected = Boolean(cart?.items.length) && selectedIds.length === cart.items.length

  function applyCart(result) {
    setCart(result)
    setSelectedIds((previous) =>
      previous.filter((id) => result.items.some((item) => item.idCartItem === id)),
    )
    notifyCartUpdated()
  }

  async function changeQuantity(item, quantity) {
    setBusyItem(item.idCartItem)
    setError('')
    try {
      const result = await updateCartItem(item.idCartItem, quantity)
      applyCart(result)
    } catch (requestError) {
      console.error('Không thể cập nhật số lượng giỏ hàng:', requestError)
      setError(requestError.message || 'Không thể cập nhật số lượng sản phẩm.')
    } finally {
      setBusyItem(null)
    }
  }

  async function removeItem(item) {
    setBusyItem(item.idCartItem)
    setError('')
    try {
      const result = await removeCartItem(item.idCartItem)
      applyCart(result)
    } catch (requestError) {
      console.error('Không thể xóa sản phẩm khỏi giỏ:', requestError)
      setError(requestError.message || 'Không thể xóa sản phẩm khỏi giỏ hàng.')
    } finally {
      setBusyItem(null)
    }
  }

  function continueToCheckout() {
    const params = new URLSearchParams()
    params.set('items', selectedIds.join(','))
    navigate(`/checkout?${params.toString()}`)
  }

  return (
    <div className="cp-page">
      <UserNavBar activeKey="cart" />
      <main>
        <header className="cp-page-title">
          <div className="cp-container">
            <h1>Giỏ hàng của bạn</h1>
            <p>Kiểm tra sản phẩm, điều chỉnh số lượng và chọn món muốn đặt mua.</p>
          </div>
        </header>

        <section className="cp-container cp-content">
          {!user ? (
            <div className="cp-panel cp-empty">
              <div className="cp-empty__icon" aria-hidden="true">▢</div>
              <h2>Đăng nhập để xem giỏ hàng</h2>
              <p>Giỏ hàng được lưu theo tài khoản để bạn có thể xem lại bất cứ lúc nào.</p>
              <a className="cp-button" href="/login">Đăng nhập</a>
            </div>
          ) : loading ? (
            <div className="cp-panel cp-message" role="status">Đang tải giỏ hàng...</div>
          ) : error && !cart ? (
            <div className="cp-panel cp-empty" role="alert">
              <div className="cp-inline-alert">{error}</div>
              <button className="cp-button cp-button--light" type="button" onClick={() => window.location.reload()}>
                Tải lại trang
              </button>
            </div>
          ) : !cart?.items.length ? (
            <div className="cp-panel cp-empty">
              <div className="cp-empty__icon" aria-hidden="true">▢</div>
              <h2>Giỏ hàng đang trống</h2>
              <p>Hãy chọn những món đồ học tập bạn cần, chúng sẽ xuất hiện ở đây.</p>
              <a className="cp-button" href="/store">Đến cửa hàng</a>
            </div>
          ) : (
            <>
              {error && <div className="cp-inline-alert" role="alert">{error}</div>}
              <div className="cp-cart-layout">
                <div className="cp-cart-list">
                  <label className="cp-panel cp-cart-item">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(event) => setSelectedIds(
                        event.target.checked ? cart.items.map((item) => item.idCartItem) : [],
                      )}
                    />
                    <span className="cp-cart-item__info">
                      <strong>Chọn tất cả</strong>
                      <p>{cart.totalQuantity} sản phẩm trong giỏ hàng</p>
                    </span>
                  </label>

                  {cart.items.map((item) => (
                    <article className="cp-panel cp-cart-item" key={item.idCartItem}>
                      <input
                        type="checkbox"
                        aria-label={`Chọn ${item.productName} để thanh toán`}
                        checked={selectedIds.includes(item.idCartItem)}
                        onChange={(event) => setSelectedIds((previous) =>
                          event.target.checked
                            ? [...previous, item.idCartItem]
                            : previous.filter((id) => id !== item.idCartItem),
                        )}
                      />
                      <a className="cp-cart-item__image" href={productPath(item)} aria-label={`Xem ${item.productName}`}>
                        {item.image ? <img src={item.image} alt={item.productName} /> : <span aria-hidden="true">✎</span>}
                      </a>
                      <div className="cp-cart-item__info">
                        <a href={productPath(item)}>{item.productName}</a>
                        <p>{item.categoryName} · Mã: {item.sku}</p>
                        <span className="cp-cart-item__price">{formatPrice(item.price)}</span>
                        <div className="cp-quantity" aria-label="Điều chỉnh số lượng">
                          <button
                            type="button"
                            aria-label={`Giảm số lượng ${item.productName}`}
                            disabled={busyItem === item.idCartItem || item.quantity <= 1}
                            onClick={() => changeQuantity(item, item.quantity - 1)}
                          >−</button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Tăng số lượng ${item.productName}`}
                            disabled={busyItem === item.idCartItem || item.quantity >= Math.min(item.availableQuantity, 99)}
                            onClick={() => changeQuantity(item, item.quantity + 1)}
                          >+</button>
                        </div>
                        <button
                          className="cp-remove"
                          type="button"
                          disabled={busyItem === item.idCartItem}
                          onClick={() => removeItem(item)}
                        >
                          Xóa khỏi giỏ
                        </button>
                      </div>
                      <strong className="cp-cart-item__price">{formatPrice(item.lineTotal)}</strong>
                    </article>
                  ))}
                </div>

                <aside className="cp-panel cp-cart-summary">
                  <h2>Tóm tắt đơn hàng</h2>
                  <div className="cp-summary-row">
                    <span>Tổng số lượng trong giỏ</span>
                    <strong>{cart.totalQuantity}</strong>
                  </div>
                  <div className="cp-summary-row">
                    <span>Đã chọn thanh toán</span>
                    <strong>{selectedQuantity} sản phẩm</strong>
                  </div>
                  <div className="cp-summary-row cp-summary-row--total">
                    <span>Tạm tính đã chọn</span>
                    <strong>{formatPrice(selectedTotal)}</strong>
                  </div>
                  <button className="cp-button" type="button" disabled={!selectedItems.length} onClick={continueToCheckout}>
                    Tiến hành thanh toán
                  </button>
                  <p className="cp-cart-summary__note">
                    Phí giao hàng và xác nhận đơn sẽ được trao đổi khi cửa hàng xử lý đơn.
                  </p>
                </aside>
              </div>
            </>
          )}
        </section>
      </main>
      <UserFooter />
    </div>
  )
}

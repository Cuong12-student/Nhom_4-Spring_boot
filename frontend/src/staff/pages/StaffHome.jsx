import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSessionUser, getSessionUser } from '../../shared/auth/session'
import StaffIcon from '../components/StaffIcon'
import StaffNavBar from '../components/StaffNavBar'
import { logoutStaff, staffRequest } from '../api/staffApi'
import InventoryPage from './inventory/InventoryPage'
import OrdersPage from './orders/OrdersPage'
import StatisticsPage from './statistics/StatisticsPage'
import '../styles/staff.css'

const sectionTitles = {
  orders: 'Trạng thái đơn hàng',
  inventory: 'Kho hàng',
  statistics: 'Thống kê',
}

/** Khung trang staff: xác thực, tải dữ liệu và điều phối các màn hình chức năng. */
export default function StaffHome() {
  const navigate = useNavigate()
  const session = useMemo(() => getSessionUser(), [])
  const [section, setSection] = useState('orders')
  const [orders, setOrders] = useState([])
  const [variants, setVariants] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [range, setRange] = useState({ from: '', to: '' })
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!session?.token || session.role !== 'STAFF') {
      navigate('/login', { replace: true })
    }
  }, [navigate, session])

  useEffect(() => {
    if (!session?.token || session.role !== 'STAFF') return undefined

    const controller = new AbortController()
    const query = new URLSearchParams()
    if (range.from) query.set('from', range.from)
    if (range.to) query.set('to', range.to)

    const path = section === 'orders'
      ? '/orders'
      : section === 'inventory'
        ? '/variants'
        : `/statistics?${query}`

    staffRequest(path, { signal: controller.signal })
      .then((data) => {
        if (section === 'orders') setOrders(data)
        else if (section === 'inventory') setVariants(data)
        else setStatistics(data)
        setError('')
        setLoadFailed(false)
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message)
          setLoadFailed(true)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [section, reload, range, session])

  if (!session?.token || session.role !== 'STAFF') return null

  function changeSection(nextSection) {
    if (nextSection === section) return
    setSection(nextSection)
    setError('')
    setNotice('')
    setLoading(true)
  }

  async function decideOrder(id, action) {
    const confirmation = action === 'cancel'
      ? 'Hủy đơn hàng và hoàn lại hàng vào kho?'
      : 'Xác nhận duyệt đơn hàng này?'
    if (!window.confirm(confirmation)) return

    setBusy(true)
    setError('')
    setNotice('')
    try {
      await staffRequest(`/orders/${id}/${action}`, { method: 'POST' })
      setNotice(action === 'cancel' ? 'Đã hủy đơn và hoàn kho.' : 'Đã duyệt đơn hàng.')
      setReload((value) => value + 1)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  async function receiveStock(lines) {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const result = await staffRequest('/receipts', {
        method: 'POST',
        body: { lines },
      })
      setReceipt(result)
      setNotice('Đã nhập kho và lưu báo cáo.')
      setReload((value) => value + 1)
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    setError('')
    try {
      await logoutStaff(session.token)
      clearSessionUser()
      navigate('/login')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  function filterStatistics(from, to) {
    if (from && to && from > to) {
      setError('Ngày bắt đầu phải trước ngày kết thúc.')
      return
    }
    setLoading(true)
    setRange({ from, to })
  }

  function reloadSection() {
    setLoading(true)
    setReload((value) => value + 1)
  }

  function renderSection() {
    if (section === 'orders') {
      return <OrdersPage rows={orders} busy={busy} onDecision={decideOrder} />
    }
    if (section === 'inventory') {
      return (
        <InventoryPage
          variants={variants}
          busy={busy}
          onReceive={receiveStock}
          receipt={receipt}
        />
      )
    }
    if (statistics) {
      return (
        <StatisticsPage
          data={statistics}
          from={range.from}
          to={range.to}
          onFilter={filterStatistics}
        />
      )
    }
    return null
  }

  return (
    <div className="staff-page">
      <StaffNavBar
        section={section}
        onSelect={changeSection}
        username={session.username}
        onLogout={logout}
      />
      <div className="staff-hero">
        <div className="staff-wrap staff-hero-inner">
          <div className="staff-hero-copy">
            <p><span className="staff-hero-dot" /> HIÊN SÁCH / KHÔNG GIAN NHÂN VIÊN</p>
            <h1>{sectionTitles[section]}</h1>
            <span>Chăm chút từng đơn hàng, gìn giữ từng trang sách.</span>
          </div>
          <div className="staff-hero-art" aria-hidden="true">
            <div className="staff-hero-orbit" />
            <div className="staff-hero-book staff-hero-book-back" />
            <div className="staff-hero-book staff-hero-book-front">
              <StaffIcon name="book" />
            </div>
            <span className="staff-hero-sparkle">✦</span>
          </div>
        </div>
      </div>
      <main className="staff-wrap staff-main" key={section}>
        {error && <div className="staff-alert error" role="alert">{error}</div>}
        {notice && <div className="staff-alert" role="status">{notice}</div>}
        {loading
          ? <p className="staff-empty">Đang tải dữ liệu...</p>
          : loadFailed
            ? (
              <p className="staff-empty">
                <button type="button" className="staff-button secondary" onClick={reloadSection}>
                  Thử tải lại
                </button>
              </p>
            )
            : renderSection()}
      </main>
      <footer className="staff-footer">Hiên Sách · Cùng nhau gìn giữ niềm vui đọc sách</footer>
    </div>
  )
}

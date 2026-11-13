import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSessionUser, getSessionUser } from '../user/session'
import StoreSelect from '../user/store/StoreSelect'
import StaffNavBar from './StaffNavBar'
import StaffIcon from './StaffIcon'
import { logoutStaff, staffRequest } from './staffApi'
import '../user/userTheme.css'
import './staff.css'

const approvedStatuses = ['CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED']
const statusNames = {
  PENDING: 'Chờ duyệt', CONFIRMED: 'Đã duyệt', PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy',
}
const dateTime = (value) => value ? new Date(value).toLocaleString('vi-VN') : '—'
const day = (value) => value ? value.split('-').reverse().join('/') : '—'
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 2 })
const formatPrice = (value) => money.format(Number(value))

function Receipt({ receipt }) {
  return (
    <div className="staff-receipt">
      <div className="staff-receipt-head">
        <div><strong>Phiếu nhập #{receipt.id}</strong><p>{dateTime(receipt.receivedAt)} · {receipt.staffName}</p></div>
        <strong>{formatPrice(receipt.total)}</strong>
      </div>
      <div className="staff-table-wrap">
        <table><thead><tr><th>Sản phẩm / SKU</th><th>Số lượng</th><th>Đơn giá nhập</th><th>Thành tiền</th></tr></thead>
          <tbody>{receipt.lines.map((line) => <tr key={line.sku}>
            <td>{line.productName}<small>{line.sku}</small></td><td>{line.quantity}</td>
            <td>{formatPrice(line.unitCost)}</td><td>{formatPrice(line.total)}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}

function Orders({ rows, busy, onDecision }) {
  const [tab, setTab] = useState('pending')
  const counts = {
    approved: rows.filter((order) => approvedStatuses.includes(order.status)).length,
    cancelled: rows.filter((order) => order.status === 'CANCELLED').length,
    pending: rows.filter((order) => order.status === 'PENDING').length,
  }
  const tabs = [['approved', 'Đã duyệt'], ['cancelled', 'Đã hủy'], ['pending', 'Chờ duyệt']]
  const shown = rows.filter((order) => tab === 'approved' ? approvedStatuses.includes(order.status)
    : order.status === (tab === 'cancelled' ? 'CANCELLED' : 'PENDING'))
  return <>
    <div className="staff-summary">{tabs.map(([key, label]) => <button key={key} type="button"
      className={`staff-stat staff-stat--${key} ${tab === key ? 'active' : ''}`}
      aria-pressed={tab === key} onClick={() => setTab(key)}>
      <span className="staff-stat-top"><span>{label}</span><span className="staff-stat-icon"><StaffIcon name={key === 'approved' ? 'check' : key === 'cancelled' ? 'cancel' : 'pending'} /></span></span>
      <strong>{counts[key]}</strong><small>đơn hàng</small>
    </button>)}</div>
    <section className="staff-panel">
      <div className="staff-panel-title"><div><h2>Danh sách đơn hàng</h2><p>Xem chi tiết và xử lý đơn của khách hàng.</p></div></div>
      <div className="staff-tabs" role="tablist" aria-label="Trạng thái đơn hàng">
        {tabs.map(([key, label]) => <button key={key} type="button" role="tab"
          aria-selected={tab === key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
          {label} <span>{counts[key]}</span>
        </button>)}
      </div>
      <div className="staff-tab-content" key={tab}>{shown.length === 0 ? <p className="staff-empty">Chưa có đơn hàng trong mục này.</p> : shown.map((order) => (
        <article className="staff-order" key={order.id}>
          <div className="staff-order-heading">
            <div><strong>Đơn hàng #{order.id}</strong><span className={`staff-badge ${order.status === 'CANCELLED' ? 'muted' : ''}`}>{statusNames[order.status] || order.status}</span>
              <p>Đặt lúc {dateTime(order.orderedAt)}{order.approvedAt && ` · Duyệt lúc ${dateTime(order.approvedAt)}`}</p></div>
            <strong>{formatPrice(order.total)}</strong>
          </div>
          <p className="staff-customer">{order.customerName} · {order.phone} · {order.address}</p>
          <div className="staff-table-wrap"><table><thead><tr><th>Sản phẩm / SKU</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
            <tbody>{order.lines.map((line, index) => <tr key={`${line.sku}-${index}`}><td>{line.productName}<small>{line.sku}</small></td>
              <td>{line.quantity}</td><td>{formatPrice(line.price)}</td><td>{formatPrice(line.total)}</td></tr>)}</tbody></table></div>
          {order.status === 'PENDING' && <div className="staff-order-actions">
            <button type="button" className="staff-button secondary" disabled={busy} onClick={() => onDecision(order.id, 'cancel')}>Hủy đơn & hoàn kho</button>
            <button type="button" className="staff-button" disabled={busy} onClick={() => onDecision(order.id, 'approve')}>Duyệt đơn</button>
          </div>}
        </article>
      ))}</div>
    </section>
  </>
}

function InventoryPage({ variants, busy, onReceive, receipt }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [draft, setDraft] = useState({})
  const [draftError, setDraftError] = useState('')
  const categories = [...new Set(variants.map((item) => item.category))].sort()
  const stockOptions = [{ value: '', label: 'Tất cả' }, { value: 'available', label: 'Còn hàng' }, { value: 'empty', label: 'Hết hàng' }]
  const shown = variants.filter((item) => `${item.name} ${item.sku}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi'))
    && (!category || item.category === category)
    && (!stock || (stock === 'available' ? item.quantity > 0 : item.quantity === 0)))
  const selected = variants.filter((item) => draft[item.id])
  const update = (id, patch) => setDraft((previous) => ({
    ...previous, [id]: { ...previous[id], ...patch },
  }))
  const remove = (id) => setDraft((previous) => {
    const next = { ...previous }
    delete next[id]
    return next
  })
  async function submit(event) {
    event.preventDefault()
    setDraftError('')
    const lines = selected.map((item) => ({
      variantId: item.id, quantity: Number(draft[item.id].quantity), unitCost: Number(draft[item.id].unitCost),
    }))
    if (!lines.length || lines.some((line) => !Number.isSafeInteger(line.quantity) || line.quantity <= 0 || line.quantity > 2147483647
      || draft[line.variantId].unitCost === '' || !Number.isFinite(line.unitCost)
      || line.unitCost < 0 || !/^\d{1,13}(\.\d{1,2})?$/.test(draft[line.variantId].unitCost))) {
      setDraftError('Nhập số lượng nguyên dương và đơn giá hợp lệ (tối đa 2 chữ số thập phân) cho từng mặt hàng.')
      return
    }
    if (await onReceive(lines)) setDraft({})
  }
  return <>
    <section className="staff-panel">
      <div className="staff-panel-title"><div><h2>Sản phẩm trong kho</h2><p>Chọn các mặt hàng có sẵn để lập phiếu nhập.</p></div><span>{shown.length} mặt hàng</span></div>
      <div className="staff-filters">
        <label>Tìm kiếm<input type="search" placeholder="Tên sản phẩm hoặc SKU..." value={search} onChange={(e) => setSearch(e.target.value)} /></label>
        <div className="staff-filter staff-select">Danh mục
          <StoreSelect ariaLabel={`Danh mục: ${category || 'Tất cả danh mục'}`} fullWidth value={category} onChange={setCategory}
            options={[{ value: '', label: 'Tất cả danh mục' }, ...categories.map((value) => ({ value, label: value }))]} />
        </div>
        <div className="staff-filter staff-select">Tồn kho
          <StoreSelect ariaLabel={`Tồn kho: ${stockOptions.find((option) => option.value === stock).label}`} fullWidth
            value={stock} onChange={setStock} options={stockOptions} />
        </div>
      </div>
      {shown.length === 0 ? <p className="staff-empty">Không tìm thấy mặt hàng phù hợp.</p> : <div className="staff-product-grid">
        {shown.map((item) => <article className="staff-product" key={item.id}>
          <div className="staff-product-image">{item.image ? <img src={item.image} alt="" /> : <span className="staff-product-placeholder"><StaffIcon name="book" /></span>}</div>
          <div className="staff-product-body"><small>{item.category} · {item.sku}</small><h3>{item.name}</h3>
            <p>Giá bán: {formatPrice(item.sellingPrice)}</p><p>Tồn kho: <strong>{item.quantity}</strong> · {item.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngừng bán'}</p>
            <button type="button" className="staff-button secondary" disabled={Boolean(draft[item.id])}
              onClick={() => update(item.id, { quantity: '1', unitCost: '' })}>{draft[item.id] ? 'Đã chọn' : '+ Chọn nhập kho'}</button>
          </div>
        </article>)}
      </div>}
    </section>
    <section className="staff-panel">
      <div className="staff-panel-title"><div><h2>Phiếu nhập kho</h2><p>Nhập số lượng và giá nhập thực tế cho từng mặt hàng.</p></div></div>
      <form onSubmit={submit}>
        {selected.length === 0 ? <p className="staff-empty">Chưa chọn mặt hàng nào.</p> : <div className="staff-table-wrap"><table>
          <thead><tr><th>Sản phẩm / SKU</th><th>Số lượng</th><th>Đơn giá nhập (₫)</th><th>Thành tiền</th><th></th></tr></thead>
          <tbody>{selected.map((item) => <tr key={item.id}><td>{item.name}<small>{item.sku}</small></td>
            <td><input aria-label={`Số lượng ${item.sku}`} type="number" min="1" step="1" required value={draft[item.id].quantity}
              onChange={(e) => update(item.id, { quantity: e.target.value })} /></td>
            <td><input aria-label={`Đơn giá nhập ${item.sku}`} type="number" min="0" step="0.01" required value={draft[item.id].unitCost}
              onChange={(e) => update(item.id, { unitCost: e.target.value })} /></td>
            <td>{draft[item.id].unitCost === '' ? '—' : formatPrice(Number(draft[item.id].unitCost) * Number(draft[item.id].quantity))}</td>
            <td><button type="button" className="staff-link" onClick={() => remove(item.id)}>Xóa</button></td></tr>)}</tbody>
        </table></div>}
        {draftError && <p className="staff-error" role="alert">{draftError}</p>}
        <div className="staff-order-actions"><button type="submit" className="staff-button" disabled={busy || !selected.length}>Xác nhận nhập kho</button></div>
      </form>
    </section>
    {receipt && <section className="staff-panel staff-print-area"><div className="staff-panel-title"><div><h2>Báo cáo nhập kho vừa tạo</h2></div>
      <button type="button" className="staff-button secondary staff-no-print" onClick={() => window.print()}>In báo cáo</button></div><Receipt receipt={receipt} /></section>}
  </>
}

function StatisticsPage({ data, from, to, onFilter }) {
  const [tab, setTab] = useState('revenue')
  const [start, setStart] = useState(from)
  const [end, setEnd] = useState(to)
  return <>
    <section className="staff-panel">
      <form className="staff-filters" onSubmit={(event) => { event.preventDefault(); onFilter(start, end) }}>
        <label>Từ ngày<input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label>Đến ngày<input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
        <button className="staff-button" type="submit">Xem báo cáo</button>
      </form>
      <p className="staff-note">Doanh thu tính theo ngày duyệt. Chênh lệch thu–chi = doanh thu trừ tiền nhập kho cùng kỳ, không phải lãi gộp.</p>
      {data.historicalOrdersWithoutApprovalDate > 0 && <p className="staff-note">{data.historicalOrdersWithoutApprovalDate} đơn đã duyệt trước đây chưa có ngày duyệt nên không được tính vào doanh thu theo ngày.</p>}
      <div className="staff-summary staff-summary-finance">
        <div className="staff-stat"><span>Doanh thu</span><strong>{formatPrice(data.revenue)}</strong></div>
        <div className="staff-stat"><span>Chi nhập kho</span><strong>{formatPrice(data.expense)}</strong></div>
        <div className="staff-stat"><span>Chênh lệch thu–chi</span><strong>{formatPrice(data.difference)}</strong></div>
      </div>
      <div className="staff-tabs" role="tablist" aria-label="Báo cáo thống kê">
        <button type="button" role="tab" aria-selected={tab === 'revenue'} className={tab === 'revenue' ? 'active' : ''} onClick={() => setTab('revenue')}>Doanh thu theo ngày</button>
        <button type="button" role="tab" aria-selected={tab === 'receipts'} className={tab === 'receipts' ? 'active' : ''} onClick={() => setTab('receipts')}>Lịch sử nhập kho</button>
      </div>
      <div className="staff-tab-content" key={tab}>{tab === 'revenue' ? (data.dailyRevenue.length ? <div className="staff-table-wrap"><table><thead><tr><th>Ngày duyệt</th><th>Số đơn</th><th>Doanh thu</th></tr></thead>
        <tbody>{data.dailyRevenue.map((row) => <tr key={row.date}><td>{day(row.date)}</td><td>{row.orderCount}</td><td>{formatPrice(row.revenue)}</td></tr>)}</tbody></table></div>
        : <p className="staff-empty">Chưa có doanh thu trong khoảng này.</p>)
        : (data.receipts.length ? data.receipts.map((receipt) => <Receipt key={receipt.id} receipt={receipt} />)
          : <p className="staff-empty">Chưa có phiếu nhập kho trong khoảng này.</p>)}</div>
    </section>
  </>
}

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
    if (!session?.token || session.role !== 'STAFF') navigate('/login', { replace: true })
  }, [navigate, session])

  useEffect(() => {
    if (!session?.token || session.role !== 'STAFF') return
    const controller = new AbortController()
    const query = new URLSearchParams()
    if (range.from) query.set('from', range.from)
    if (range.to) query.set('to', range.to)
    const path = section === 'orders' ? '/orders' : section === 'inventory' ? '/variants' : `/statistics?${query}`
    staffRequest(path, { signal: controller.signal }).then((data) => {
      if (section === 'orders') setOrders(data)
      else if (section === 'inventory') setVariants(data)
      else setStatistics(data)
      setError('')
      setLoadFailed(false)
    }).catch((err) => {
      if (err.name !== 'AbortError') {
        setError(err.message)
        setLoadFailed(true)
      }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [section, reload, range, session])

  if (!session?.token || session.role !== 'STAFF') return null

  function changeSection(next) {
    if (next === section) return
    setSection(next)
    setError('')
    setNotice('')
    setLoading(true)
  }

  async function decision(id, action) {
    const message = action === 'cancel' ? 'Hủy đơn hàng và hoàn lại hàng vào kho?' : 'Xác nhận duyệt đơn hàng này?'
    if (!window.confirm(message)) return
    setBusy(true); setError(''); setNotice('')
    try {
      await staffRequest(`/orders/${id}/${action}`, { method: 'POST' })
      setNotice(action === 'cancel' ? 'Đã hủy đơn và hoàn kho.' : 'Đã duyệt đơn hàng.')
      setReload((value) => value + 1)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  async function receive(lines) {
    setBusy(true); setError(''); setNotice('')
    try {
      const result = await staffRequest('/receipts', { method: 'POST', body: { lines } })
      setReceipt(result)
      setNotice('Đã nhập kho và lưu báo cáo.')
      setReload((value) => value + 1)
      return true
    } catch (err) { setError(err.message); return false } finally { setBusy(false) }
  }

  async function logout() {
    setError('')
    try {
      await logoutStaff(session.token)
      clearSessionUser()
      navigate('/login')
    } catch (err) { setError(err.message) }
  }

  const title = { orders: 'Trạng thái đơn hàng', inventory: 'Kho hàng', statistics: 'Thống kê' }[section]
  return <div className="staff-page">
    <StaffNavBar section={section} onSelect={changeSection} username={session.username} onLogout={logout} />
    <div className="staff-hero"><div className="staff-wrap staff-hero-inner"><div className="staff-hero-copy">
      <p><span className="staff-hero-dot" /> HIÊN SÁCH / KHÔNG GIAN NHÂN VIÊN</p><h1>{title}</h1>
      <span>Chăm chút từng đơn hàng, gìn giữ từng trang sách.</span></div>
      <div className="staff-hero-art" aria-hidden="true"><div className="staff-hero-orbit" /><div className="staff-hero-book staff-hero-book-back" />
        <div className="staff-hero-book staff-hero-book-front"><StaffIcon name="book" /></div><span className="staff-hero-sparkle">✦</span></div></div></div>
    <main className="staff-wrap staff-main" key={section}>
      {error && <div className="staff-alert error" role="alert">{error}</div>}
      {notice && <div className="staff-alert" role="status">{notice}</div>}
      {loading ? <p className="staff-empty">Đang tải dữ liệu...</p> : loadFailed
        ? <p className="staff-empty"><button type="button" className="staff-button secondary" onClick={() => {
          setLoading(true); setReload((value) => value + 1)
        }}>Thử tải lại</button></p> : <>
        {section === 'orders' && <Orders rows={orders} busy={busy} onDecision={decision} />}
        {section === 'inventory' && <InventoryPage variants={variants} busy={busy} onReceive={receive} receipt={receipt} />}
        {section === 'statistics' && statistics && <StatisticsPage data={statistics} from={range.from} to={range.to} onFilter={(from, to) => {
          if (from && to && from > to) { setError('Ngày bắt đầu phải trước ngày kết thúc.'); return }
          setLoading(true); setRange({ from, to })
        }} />}
      </>}
    </main>
    <footer className="staff-footer">Hiên Sách · Cùng nhau gìn giữ niềm vui đọc sách</footer>
  </div>
}

import { useState } from 'react'
import StaffIcon from '../../components/StaffIcon'
import { formatStaffDateTime, formatStaffPrice } from '../../utils/format'

const approvedStatuses = ['CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED']
const statusNames = {
  PENDING: 'Chờ duyệt',
  CONFIRMED: 'Đã duyệt',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
}
const tabs = [
  ['approved', 'Đã duyệt'],
  ['cancelled', 'Đã hủy'],
  ['pending', 'Chờ duyệt'],
]

/** Màn hình lọc, xem và xử lý đơn hàng của nhân viên. */
export default function OrdersPage({ rows, busy, onDecision }) {
  const [tab, setTab] = useState('pending')
  const counts = {
    approved: rows.filter((order) => approvedStatuses.includes(order.status)).length,
    cancelled: rows.filter((order) => order.status === 'CANCELLED').length,
    pending: rows.filter((order) => order.status === 'PENDING').length,
  }
  const shown = rows.filter((order) => (
    tab === 'approved'
      ? approvedStatuses.includes(order.status)
      : order.status === (tab === 'cancelled' ? 'CANCELLED' : 'PENDING')
  ))

  return (
    <>
      <div className="staff-summary">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`staff-stat staff-stat--${key} ${tab === key ? 'active' : ''}`}
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
          >
            <span className="staff-stat-top">
              <span>{label}</span>
              <span className="staff-stat-icon">
                <StaffIcon name={key === 'approved' ? 'check' : key === 'cancelled' ? 'cancel' : 'pending'} />
              </span>
            </span>
            <strong>{counts[key]}</strong>
            <small>đơn hàng</small>
          </button>
        ))}
      </div>

      <section className="staff-panel">
        <div className="staff-panel-title">
          <div>
            <h2>Danh sách đơn hàng</h2>
            <p>Xem chi tiết và xử lý đơn của khách hàng.</p>
          </div>
        </div>
        <div className="staff-tabs" role="tablist" aria-label="Trạng thái đơn hàng">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={tab === key ? 'active' : ''}
              onClick={() => setTab(key)}
            >
              {label} <span>{counts[key]}</span>
            </button>
          ))}
        </div>
        <div className="staff-tab-content" key={tab}>
          {shown.length === 0
            ? <p className="staff-empty">Chưa có đơn hàng trong mục này.</p>
            : shown.map((order) => (
              <article className="staff-order" key={order.id}>
                <div className="staff-order-heading">
                  <div>
                    <strong>Đơn hàng #{order.id}</strong>
                    <span className={`staff-badge ${order.status === 'CANCELLED' ? 'muted' : ''}`}>
                      {statusNames[order.status] || order.status}
                    </span>
                    <p>
                      Đặt lúc {formatStaffDateTime(order.orderedAt)}
                      {order.approvedAt && ` · Duyệt lúc ${formatStaffDateTime(order.approvedAt)}`}
                    </p>
                  </div>
                  <strong>{formatStaffPrice(order.total)}</strong>
                </div>
                <p className="staff-customer">
                  {order.customerName} · {order.phone} · {order.address}
                </p>
                <div className="staff-table-wrap">
                  <table>
                    <thead>
                      <tr><th>Sản phẩm / SKU</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr>
                    </thead>
                    <tbody>
                      {order.lines.map((line, index) => (
                        <tr key={`${line.sku}-${index}`}>
                          <td>{line.productName}<small>{line.sku}</small></td>
                          <td>{line.quantity}</td>
                          <td>{formatStaffPrice(line.price)}</td>
                          <td>{formatStaffPrice(line.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {order.status === 'PENDING' && (
                  <div className="staff-order-actions">
                    <button
                      type="button"
                      className="staff-button secondary"
                      disabled={busy}
                      onClick={() => onDecision(order.id, 'cancel')}
                    >
                      Hủy đơn &amp; hoàn kho
                    </button>
                    <button
                      type="button"
                      className="staff-button"
                      disabled={busy}
                      onClick={() => onDecision(order.id, 'approve')}
                    >
                      Duyệt đơn
                    </button>
                  </div>
                )}
              </article>
            ))}
        </div>
      </section>
    </>
  )
}

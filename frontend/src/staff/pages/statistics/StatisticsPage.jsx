import { useState } from 'react'
import Receipt from '../../components/Receipt'
import { formatStaffDay, formatStaffPrice } from '../../utils/format'

/** Màn hình lọc và xem báo cáo doanh thu, chi phí nhập kho. */
export default function StatisticsPage({ data, from, to, onFilter }) {
  const [tab, setTab] = useState('revenue')
  const [start, setStart] = useState(from)
  const [end, setEnd] = useState(to)

  return (
    <section className="staff-panel">
      <form
        className="staff-filters"
        onSubmit={(event) => {
          event.preventDefault()
          onFilter(start, end)
        }}
      >
        <label>Từ ngày<input type="date" value={start} onChange={(event) => setStart(event.target.value)} /></label>
        <label>Đến ngày<input type="date" value={end} onChange={(event) => setEnd(event.target.value)} /></label>
        <button className="staff-button" type="submit">Xem báo cáo</button>
      </form>
      <p className="staff-note">
        Doanh thu tính theo ngày duyệt. Chênh lệch thu–chi = doanh thu trừ tiền nhập kho cùng kỳ, không phải lãi gộp.
      </p>
      {data.historicalOrdersWithoutApprovalDate > 0 && (
        <p className="staff-note">
          {data.historicalOrdersWithoutApprovalDate} đơn đã duyệt trước đây chưa có ngày duyệt nên không được tính vào doanh thu theo ngày.
        </p>
      )}
      <div className="staff-summary staff-summary-finance">
        <div className="staff-stat"><span>Doanh thu</span><strong>{formatStaffPrice(data.revenue)}</strong></div>
        <div className="staff-stat"><span>Chi nhập kho</span><strong>{formatStaffPrice(data.expense)}</strong></div>
        <div className="staff-stat"><span>Chênh lệch thu–chi</span><strong>{formatStaffPrice(data.difference)}</strong></div>
      </div>
      <div className="staff-tabs" role="tablist" aria-label="Báo cáo thống kê">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'revenue'}
          className={tab === 'revenue' ? 'active' : ''}
          onClick={() => setTab('revenue')}
        >
          Doanh thu theo ngày
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'receipts'}
          className={tab === 'receipts' ? 'active' : ''}
          onClick={() => setTab('receipts')}
        >
          Lịch sử nhập kho
        </button>
      </div>
      <div className="staff-tab-content" key={tab}>
        {tab === 'revenue'
          ? data.dailyRevenue.length
            ? (
              <div className="staff-table-wrap">
                <table>
                  <thead><tr><th>Ngày duyệt</th><th>Số đơn</th><th>Doanh thu</th></tr></thead>
                  <tbody>
                    {data.dailyRevenue.map((row) => (
                      <tr key={row.date}>
                        <td>{formatStaffDay(row.date)}</td>
                        <td>{row.orderCount}</td>
                        <td>{formatStaffPrice(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
            : <p className="staff-empty">Chưa có doanh thu trong khoảng này.</p>
          : data.receipts.length
            ? data.receipts.map((receipt) => <Receipt key={receipt.id} receipt={receipt} />)
            : <p className="staff-empty">Chưa có phiếu nhập kho trong khoảng này.</p>}
      </div>
    </section>
  )
}

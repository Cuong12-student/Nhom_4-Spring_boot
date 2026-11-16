import { formatStaffDateTime, formatStaffPrice } from '../utils/format'

/** Bảng chi tiết phiếu nhập dùng chung trong kho và báo cáo thống kê. */
export default function Receipt({ receipt }) {
  return (
    <div className="staff-receipt">
      <div className="staff-receipt-head">
        <div>
          <strong>Phiếu nhập #{receipt.id}</strong>
          <p>{formatStaffDateTime(receipt.receivedAt)} · {receipt.staffName}</p>
        </div>
        <strong>{formatStaffPrice(receipt.total)}</strong>
      </div>
      <div className="staff-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sản phẩm / SKU</th>
              <th>Số lượng</th>
              <th>Đơn giá nhập</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {receipt.lines.map((line) => (
              <tr key={line.sku}>
                <td>{line.productName}<small>{line.sku}</small></td>
                <td>{line.quantity}</td>
                <td>{formatStaffPrice(line.unitCost)}</td>
                <td>{formatStaffPrice(line.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { useState } from 'react'
import StoreSelect from '../../../shared/components/StoreSelect'
import Receipt from '../../components/Receipt'
import StaffIcon from '../../components/StaffIcon'
import { formatStaffPrice } from '../../utils/format'

/** Màn hình lọc hàng tồn và lập phiếu nhập kho. */
export default function InventoryPage({ variants, busy, onReceive, receipt }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [draft, setDraft] = useState({})
  const [draftError, setDraftError] = useState('')
  const categories = [...new Set(variants.map((item) => item.category))].sort()
  const stockOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'available', label: 'Còn hàng' },
    { value: 'empty', label: 'Hết hàng' },
  ]
  const shown = variants.filter((item) => (
    `${item.name} ${item.sku}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi'))
    && (!category || item.category === category)
    && (!stock || (stock === 'available' ? item.quantity > 0 : item.quantity === 0))
  ))
  const selected = variants.filter((item) => draft[item.id])

  const update = (id, patch) => setDraft((previous) => ({
    ...previous,
    [id]: { ...previous[id], ...patch },
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
      variantId: item.id,
      quantity: Number(draft[item.id].quantity),
      unitCost: Number(draft[item.id].unitCost),
    }))
    const hasInvalidLine = lines.some((line) => (
      !Number.isSafeInteger(line.quantity)
      || line.quantity <= 0
      || line.quantity > 2147483647
      || draft[line.variantId].unitCost === ''
      || !Number.isFinite(line.unitCost)
      || line.unitCost < 0
      || !/^\d{1,13}(\.\d{1,2})?$/.test(draft[line.variantId].unitCost)
    ))
    if (!lines.length || hasInvalidLine) {
      setDraftError('Nhập số lượng nguyên dương và đơn giá hợp lệ (tối đa 2 chữ số thập phân) cho từng mặt hàng.')
      return
    }
    if (await onReceive(lines)) setDraft({})
  }

  return (
    <>
      <section className="staff-panel">
        <div className="staff-panel-title">
          <div><h2>Sản phẩm trong kho</h2><p>Chọn các mặt hàng có sẵn để lập phiếu nhập.</p></div>
          <span>{shown.length} mặt hàng</span>
        </div>
        <div className="staff-filters">
          <label>
            Tìm kiếm
            <input
              type="search"
              placeholder="Tên sản phẩm hoặc SKU..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="staff-filter staff-select">
            Danh mục
            <StoreSelect
              ariaLabel={`Danh mục: ${category || 'Tất cả danh mục'}`}
              fullWidth
              value={category}
              onChange={setCategory}
              options={[
                { value: '', label: 'Tất cả danh mục' },
                ...categories.map((value) => ({ value, label: value })),
              ]}
            />
          </div>
          <div className="staff-filter staff-select">
            Tồn kho
            <StoreSelect
              ariaLabel={`Tồn kho: ${stockOptions.find((option) => option.value === stock).label}`}
              fullWidth
              value={stock}
              onChange={setStock}
              options={stockOptions}
            />
          </div>
        </div>
        {shown.length === 0
          ? <p className="staff-empty">Không tìm thấy mặt hàng phù hợp.</p>
          : (
            <div className="staff-product-grid">
              {shown.map((item) => (
                <article className="staff-product" key={item.id}>
                  <div className="staff-product-image">
                    {item.image
                      ? <img src={item.image} alt="" />
                      : <span className="staff-product-placeholder"><StaffIcon name="book" /></span>}
                  </div>
                  <div className="staff-product-body">
                    <small>{item.category} · {item.sku}</small>
                    <h3>{item.name}</h3>
                    <p>Giá bán: {formatStaffPrice(item.sellingPrice)}</p>
                    <p>
                      Tồn kho: <strong>{item.quantity}</strong>
                      {' · '}{item.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngừng bán'}
                    </p>
                    <button
                      type="button"
                      className="staff-button secondary"
                      disabled={Boolean(draft[item.id])}
                      onClick={() => update(item.id, { quantity: '1', unitCost: '' })}
                    >
                      {draft[item.id] ? 'Đã chọn' : '+ Chọn nhập kho'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
      <section className="staff-panel">
        <div className="staff-panel-title">
          <div><h2>Phiếu nhập kho</h2><p>Nhập số lượng và giá nhập thực tế cho từng mặt hàng.</p></div>
        </div>
        <form onSubmit={submit}>
          {selected.length === 0
            ? <p className="staff-empty">Chưa chọn mặt hàng nào.</p>
            : (
              <div className="staff-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Sản phẩm / SKU</th><th>Số lượng</th><th>Đơn giá nhập (₫)</th><th>Thành tiền</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}<small>{item.sku}</small></td>
                        <td>
                          <input
                            aria-label={`Số lượng ${item.sku}`}
                            type="number"
                            min="1"
                            step="1"
                            required
                            value={draft[item.id].quantity}
                            onChange={(event) => update(item.id, { quantity: event.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            aria-label={`Đơn giá nhập ${item.sku}`}
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={draft[item.id].unitCost}
                            onChange={(event) => update(item.id, { unitCost: event.target.value })}
                          />
                        </td>
                        <td>
                          {draft[item.id].unitCost === ''
                            ? '—'
                            : formatStaffPrice(Number(draft[item.id].unitCost) * Number(draft[item.id].quantity))}
                        </td>
                        <td>
                          <button type="button" className="staff-link" onClick={() => remove(item.id)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          {draftError && <p className="staff-error" role="alert">{draftError}</p>}
          <div className="staff-order-actions">
            <button type="submit" className="staff-button" disabled={busy || !selected.length}>
              Xác nhận nhập kho
            </button>
          </div>
        </form>
      </section>
      {receipt && (
        <section className="staff-panel staff-print-area">
          <div className="staff-panel-title">
            <div><h2>Báo cáo nhập kho vừa tạo</h2></div>
            <button
              type="button"
              className="staff-button secondary staff-no-print"
              onClick={() => window.print()}
            >
              In báo cáo
            </button>
          </div>
          <Receipt receipt={receipt} />
        </section>
      )}
    </>
  )
}

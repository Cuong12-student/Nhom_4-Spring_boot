import { PAGE_SIZES, SORT_OPTIONS } from '../storeFilters'
import StoreSelect from './StoreSelect'

export default function SortBar({
  summary,
  sortValue,
  size,
  activeCount,
  onSortChange,
  onSizeChange,
  onOpenFilters,
}) {
  return (
    <div className="us-toolbar">
      <button type="button" className="us-btn us-btn--ghost us-toolbar__filter" onClick={onOpenFilters}>
        Bộ lọc{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>

      <p className="us-toolbar__summary" aria-live="polite">
        {summary}
      </p>

      <label className="us-field">
        <span>Sắp xếp</span>
        <StoreSelect
          value={sortValue}
          options={SORT_OPTIONS.map(({ value, label }) => ({ value, label }))}
          onChange={onSortChange}
          ariaLabel="Sắp xếp sản phẩm"
        />
      </label>

      <label className="us-field">
        <span>Hiển thị</span>
        <StoreSelect
          value={size}
          options={PAGE_SIZES.map((option) => ({ value: option, label: `${option} / trang` }))}
          onChange={(value) => onSizeChange(Number(value))}
          ariaLabel="Số sản phẩm mỗi trang"
        />
      </label>
    </div>
  )
}

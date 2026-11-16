const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 2,
})

export function formatStaffPrice(value) {
  return money.format(Number(value))
}

export function formatStaffDateTime(value) {
  return value ? new Date(value).toLocaleString('vi-VN') : '—'
}

export function formatStaffDay(value) {
  return value ? value.split('-').reverse().join('/') : '—'
}

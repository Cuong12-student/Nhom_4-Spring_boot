// Danh sách mục điều hướng của khu vực user.
// Khi có trang mới (chi tiết sản phẩm, giỏ hàng, ...), chỉ cần thêm một phần tử
// vào mảng này: { key, label, href }. `key` dùng để so khớp với prop `activeKey`
// của <UserNavBar />. Hiện tại mới có trang cửa hàng nên chỉ có một mục.
export const USER_NAV_ITEMS = [
  { key: 'store', label: 'Cửa hàng', href: '/' },
]

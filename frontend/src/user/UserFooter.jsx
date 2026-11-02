import './userTheme.css'
import './UserFooter.css'

export default function UserFooter() {
  return (
    <footer className="uf-footer">
      <div className="uf-footer__inner">
        <section className="uf-footer__brand">
          <a className="uf-footer__logo" href="/" aria-label="Hiên Sách - trang chủ">
            <span aria-hidden="true">✎</span>
            <span>Hiên Sách</span>
          </a>
          <p>
            Góc nhỏ chuẩn bị hành trang học tập với những món đồ hữu ích,
            dễ chọn và phù hợp cho mỗi ngày đến lớp.
          </p>
        </section>

        <section className="uf-footer__section">
          <h2>Liên kết nhanh</h2>
          <a href="/">Trang chủ</a>
          <a href="/store">Cửa hàng</a>
          <a href="/cart">Giỏ hàng</a>
          <a href="/profile">Tài khoản của tôi</a>
        </section>

        <section className="uf-footer__section">
          <h2>Liên hệ</h2>
          <p>Địa chỉ mẫu: 15 Nguyễn Trãi, Thanh Xuân, Hà Nội</p>
          <a href="tel:19001234">Hotline: 1900 1234</a>
          <a href="mailto:hello@hiensach.vn">hello@hiensach.vn</a>
        </section>

        <section className="uf-footer__section">
          <h2>Hỗ trợ bạn</h2>
          <p>Đổi trả trong 7 ngày với sản phẩm còn nguyên vẹn.</p>
          <p>Đơn hàng được xác nhận trong giờ làm việc.</p>
        </section>
      </div>
      <div className="uf-footer__bottom">
        <span>© {new Date().getFullYear()} Hiên Sách</span>
        <span>Gieo cảm hứng học tập mỗi ngày</span>
      </div>
    </footer>
  )
}

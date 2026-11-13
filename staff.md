# Chức năng nhân viên

## Quy tắc và phạm vi

- Backend mới nằm trong `src/main/java/com/teamname/school_supplies_store/staff`;
  entity có thể nằm trong `entity`. Frontend mới nằm trong `frontend/src/Staff`,
  dùng tuyến `/staff` hiện có và phong cách Hiên Sách.
- Mọi API nhân viên kiểm tra phiên đăng nhập, tài khoản đang hoạt động và vai trò STAFF.
- Đơn mới của khách đang ở trạng thái `PENDING` và đã trừ kho khi đặt.
- Chỉ duyệt hoặc hủy đơn đang chờ. Hủy hoàn trả đúng số lượng một lần;
  duyệt ghi nhận nhân viên và thời điểm duyệt. Đơn đã duyệt không được hủy.

## Trạng thái đơn hàng

- Hiển thị ba chỉ số và ba tab: đã duyệt, đã hủy, đang chờ duyệt.
- Xem chi tiết khách hàng, mặt hàng, số lượng, đơn giá, tổng tiền và thời gian.
- Duyệt/hủy đơn đang chờ; thông báo lỗi và cập nhật số liệu sau thao tác.

## Kho

- Xem các biến thể hiện có, tìm kiếm/lọc, tình trạng và tồn kho; không tạo sản phẩm.
- Lập một phiếu nhập gồm một hoặc nhiều mặt hàng, số lượng và đơn giá nhập.
- Lưu phiếu và từng dòng chi tiết trong cơ sở dữ liệu, bao gồm ngày giờ,
  nhân viên, số lượng, đơn giá và thành tiền; tăng tồn kho trong cùng giao dịch.
- Hiển thị phiếu sau khi nhập và cho phép in báo cáo.

## Thống kê

- Hai tab: doanh thu theo ngày và lịch sử phiếu nhập chi tiết.
- Doanh thu chỉ tính đơn đã duyệt theo ngày duyệt; đơn lịch sử không có ngày
  duyệt không được tự suy đoán ngày và sẽ không có trong báo cáo theo ngày.
- Lọc theo khoảng ngày; hiển thị doanh thu, chi phí nhập kho và chênh lệch
  thu–chi = doanh thu trừ tiền nhập kho cùng kỳ. Đây không phải lãi gộp.

## Kiểm tra

- Kiểm tra xác thực/phân quyền, chuyển trạng thái, hoàn kho một lần, phiếu nhập,
  tính tiền và báo cáo theo ngày; kiểm tra build backend và frontend.
- Đối chiếu từng mục trên sau khi thực hiện, ghi rõ giới hạn nếu chưa kiểm chứng.

## Cập nhật cơ sở dữ liệu

- Khi ứng dụng khởi động, cấu hình Hibernate `ddl-auto: update` tạo bảng
  `stock_receipts`, `stock_receipt_lines`, cột ngày duyệt và cột phiên bản kho.
  Sao lưu cơ sở dữ liệu trước khi triển khai thay đổi lược đồ.
- Đơn đã duyệt từ trước chưa có thời điểm duyệt sẽ được thông báo riêng;
  không tự gán ngày vì điều đó làm sai báo cáo.

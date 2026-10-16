# 🛒 School Supplies Store

> Hệ thống quản lý và bán văn phòng phẩm trực tuyến dành cho các trường học.

## Guides

Các bước thực hiện khi giải nén file:
- Bước 1: Cần chuẩn bị công cụ: JDK 17, MySQL 8.0, Git, Node (v24.21.0 bằng lệnh node -v,kiểm tra bằng npm -v trên vscode)
- Bước 2: CREATE DATABASE school_supplies; trong MySQL
- Bước 3: Nhớ kiểm tra cấu hình application.yml
- Bước 4: Chạy các lệnh:
- git init
- git remote add origin https://github.com/Cuong12-student/Nhom_4-Spring_boot.git
- git fetch origin
- git switch -c main --track origin/main
- Bước 5: Mở terminal và chạy lệnh:
- mvnw.cmd clean verify hoặc .\mvnw.cmd clean verify
- mvnw.cmd spring-boot:run hoặc .\mvnw.cmd spring-boot:run
- Nếu có xảy ra lỗi gì thì đến lớp để xử lý lỗi nhé. @All

## 🌟 Tính năng chính
- **Quản lý sản phẩm:** Thêm, sửa, xóa, tìm kiếm dụng cụ học tập.
- **Quản lý nhân viên:** Điều phối, phân quyền và chấm công (Bộ phận đang phát triển).
- **Giỏ hàng & Thanh toán:** Tích hợp cổng thanh toán mô phỏng.

## 🛠️ Công nghệ sử dụng
- **Backend:** Java 17, Spring Boot 3.x, Spring Security
- **Database:** MySQL 8.0, Spring Data JPA
- **Build Tool:** Maven

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Máy đã cài **Java 17** và **Maven**.
- Cơ sở dữ liệu **MySQL** đang hoạt động.

### Các bước thực hiện
1. Clone dự án:
```bash
git clone https://github.com
cd school-supplies-store
```

2. Cấu hình Database trong `src/main/resources/application.properties`.

3. Build và chạy ứng dụng:
```bash
mvn clean test
mvn spring-boot:run
```

## 👥 Thành viên dự án
- [@Cuong12-student](https://github.com/Cuong12-student) - Developer (Phụ trách Module Nhân viên)

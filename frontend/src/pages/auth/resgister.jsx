import React, { useState } from "react";
import { register } from "/src/services/authService";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    username: "",
    password: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    const data = {
      fullName: formData.fullName.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      username: formData.username.trim(),
      password: formData.password,
    };

    if (!data.fullName) {
      setError("Vui lòng nhập họ và tên");
      return;
    }

    if (!data.age || data.age < 1 || data.age > 120) {
      setError("Tuổi phải từ 1 đến 120");
      return;
    }

    if (!data.gender) {
      setError("Vui lòng chọn giới tính");
      return;
    }

    if (!/^0[0-9]{9}$/.test(data.phone)) {
      setError("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("Email không hợp lệ");
      return;
    }

    if (!data.address) {
      setError("Vui lòng nhập địa chỉ");
      return;
    }

    if (!/^[a-zA-Z0-9_]{8,12}$/.test(data.username)) {
      setError(
        "Tên đăng nhập phải từ 8 đến 12 ký tự, chỉ gồm chữ, số và dấu gạch dưới",
      );
      return;
    }

    if (data.password.length < 8 || data.password.length > 12) {
      setError("Mật khẩu phải từ 8 đến 12 ký tự");
      return;
    }

    try {
      setLoading(true);

      console.log("Dữ liệu đăng ký:", data);

      await register(data);

      setSuccess("Đăng ký tài khoản thành công!");

      setFormData({
        fullName: "",
        age: "",
        gender: "Male",
        phone: "",
        email: "",
        address: "",
        username: "",
        password: "",
      });
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h2>Đăng ký tài khoản</h2>

      <form onSubmit={handleSubmit}>
        <div className="register-field">
          <label htmlFor="fullName">
            Họ và tên <span>*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nhập họ và tên"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-field">
          <label htmlFor="age">
            Tuổi <span>*</span>
          </label>
          <input
            id="age"
            name="age"
            type="number"
            placeholder="Nhập tuổi"
            min="1"
            max="120"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-field">
          <label htmlFor="gender">
            Giới tính <span>*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
        </div>

        <div className="register-field">
          <label htmlFor="phone">
            Số điện thoại <span>*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-field">
          <label htmlFor="email">
            Email <span>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-field">
          <label htmlFor="address">
            Địa chỉ <span>*</span>
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Nhập địa chỉ"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-field">
          <label htmlFor="username">
            Tên đăng nhập <span>*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-field">
          <label htmlFor="password">
            Mật khẩu <span>*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {success && <div className="success-message">{success}</div>}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}

export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./resgister";
import "/src/css/login.css";
import { login } from "/src/services/authService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dang-nhap");

  const navigate = useNavigate();

  // Chuyển tab đăng nhập / đăng ký
  const changeTab = (tab) => {
    setActiveTab(tab);
    setStatus("");
  };

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setStatus("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const response = await login({
        username: username.trim(),
        password: password,
      });

      switch (response.role) {
        case "CUSTOMER":
          navigate("/customer");
          break;

        case "STAFF":
          navigate("/staff");
          break;

        case "ADMIN":
          navigate("/admin");
          break;

        default:
          setStatus("Tài khoản không có quyền truy cập");
      }
    } catch (error) {
      setStatus("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="top">
        <div className="wrap">
          <form
            className="search"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              id="q"
              type="search"
              placeholder="Tìm kiếm sản phẩm"
              aria-label="Tìm kiếm sản phẩm"
            />

            <button type="submit" aria-label="Tìm">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7"></circle>
                <path d="m20 20-3.5-3.5"></path>
              </svg>
            </button>
          </form>

          <a
            className="logo"
            href="#trang-chu"
            aria-label="Hiên Sách, trang chủ"
            onClick={(e) => {
              e.preventDefault();
              changeTab("dang-nhap");
            }}
          >
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="12"
                fill="var(--amber)"
              ></rect>
              <path
                d="M12 33V16.5c0-.8.6-1.4 1.4-1.5 3.6-.4 7.2.2 10.6 2.4 3.4-2.2 7-2.8 10.6-2.4.8.1 1.4.7 1.4 1.5V33c0 .7-.6 1.2-1.3 1.1-3.5-.4-7 .2-10.7 2.4-3.7-2.2-7.2-2.8-10.7-2.4-.7.1-1.3-.4-1.3-1.1Z"
                fill="none"
                stroke="var(--on-amber)"
                strokeWidth="2.2"
                strokeLinejoin="round"
              ></path>
              <path
                d="M24 17.4v18"
                stroke="var(--on-amber)"
                strokeWidth="2.2"
              ></path>
            </svg>

            <span>
              <b>Hiên Sách</b>
              <small>Nhà sách trực tuyến</small>
            </span>
          </a>

          <div className="actions">
            <a
              href="#dang-nhap"
              onClick={(e) => {
                e.preventDefault();
                changeTab("dang-nhap");
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"></path>
                <path d="m9 8-4 4 4 4M5 12h10"></path>
              </svg>
              <span className="lbl">Đăng nhập</span>
            </a>

            <a
              href="#dang-ky"
              onClick={(e) => {
                e.preventDefault();
                changeTab("dang-ky");
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path>
                <path d="M18.4 3.6a1.9 1.9 0 0 1 2.7 2.7L12 15.4l-4 1 1-4 9.4-8.8Z"></path>
              </svg>
              <span className="lbl">Đăng ký</span>
            </a>

            <button type="button" aria-label="Yêu thích, 0 sản phẩm">
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              >
                <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z"></path>
              </svg>
              <span className="badge">0</span>
            </button>

            <button type="button" aria-label="Giỏ hàng, 0 sản phẩm">
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 4h2.5l2.2 10.5h9.6L19.5 8H6.4"></path>
                <circle cx="9" cy="19" r="1.4"></circle>
                <circle cx="17" cy="19" r="1.4"></circle>
              </svg>
              <span className="badge">0</span>
            </button>
          </div>
        </div>
      </header>

      {/* MENU */}
      <nav className="nav" aria-label="Menu chính">
        <div className="wrap">
          <button
            className="cat-btn"
            id="catBtn"
            type="button"
            aria-expanded="false"
            aria-controls="catPanel"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"></path>
            </svg>
            Danh mục sản phẩm
          </button>

          <a className="nav-link" href="#tin-tuc">
            Tin tức
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </a>

          <a className="nav-link" href="#gioi-thieu">
            Giới thiệu
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </a>
        </div>

        <div className="cat-panel" id="catPanel" hidden={true}>
          <div className="wrap">
            <ul>
              <li>
                <a href="#sach-thieu-nhi">Sách thiếu nhi</a>
              </li>
              <li>
                <a href="#truyen-tranh">Truyện tranh</a>
              </li>
              <li>
                <a href="#van-hoc">Văn học</a>
              </li>
              <li>
                <a href="#ky-nang-song">Kỹ năng sống</a>
              </li>
              <li>
                <a href="#sach-giao-khoa">Sách giáo khoa</a>
              </li>
              <li>
                <a href="#ngoai-ngu">Ngoại ngữ</a>
              </li>
              <li>
                <a href="#khoa-hoc">Khoa học – Công nghệ</a>
              </li>
              <li>
                <a href="#van-phong-pham">Văn phòng phẩm</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* BANNER */}
      <section className="hero" aria-labelledby="pageTitle">
        <svg
          className="books"
          viewBox="0 0 1200 360"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <rect width="1200" height="360" fill="#2f1d12"></rect>

          <g>
            <rect
              x="560"
              y="250"
              width="560"
              height="44"
              rx="3"
              fill="#7a4b2a"
            ></rect>
            <rect x="560" y="258" width="548" height="6" fill="#ead3ae"></rect>
            <rect x="560" y="272" width="548" height="6" fill="#ead3ae"></rect>

            <rect
              x="610"
              y="206"
              width="480"
              height="44"
              rx="3"
              fill="#a8472a"
            ></rect>
            <rect x="610" y="214" width="468" height="6" fill="#f3dccb"></rect>
            <rect x="610" y="228" width="468" height="6" fill="#f3dccb"></rect>

            <rect
              x="650"
              y="162"
              width="420"
              height="44"
              rx="3"
              fill="#d98a2b"
            ></rect>
            <rect x="650" y="170" width="408" height="6" fill="#f7e6c8"></rect>
            <rect x="650" y="184" width="408" height="6" fill="#f7e6c8"></rect>

            <rect
              x="700"
              y="118"
              width="350"
              height="44"
              rx="3"
              fill="#e8b45a"
            ></rect>
            <rect x="700" y="126" width="338" height="6" fill="#fbf0d9"></rect>
            <rect x="700" y="140" width="338" height="6" fill="#fbf0d9"></rect>
          </g>

          <g>
            <rect
              x="40"
              y="276"
              width="420"
              height="40"
              rx="3"
              fill="#6b3f28"
            ></rect>
            <rect x="40" y="283" width="408" height="6" fill="#ecd4b8"></rect>
            <rect x="40" y="296" width="408" height="6" fill="#ecd4b8"></rect>

            <rect
              x="90"
              y="236"
              width="360"
              height="40"
              rx="3"
              fill="#b5532f"
            ></rect>
            <rect x="90" y="243" width="348" height="6" fill="#f6dfce"></rect>
            <rect x="90" y="256" width="348" height="6" fill="#f6dfce"></rect>

            <rect
              x="130"
              y="196"
              width="320"
              height="40"
              rx="3"
              fill="#c98b3c"
            ></rect>
            <rect x="130" y="203" width="308" height="6" fill="#f8ecd0"></rect>
            <rect x="130" y="216" width="308" height="6" fill="#f8ecd0"></rect>
          </g>

          <rect y="316" width="1200" height="44" fill="#21130b"></rect>
        </svg>

        <div className="wrap">
          <h1 id="pageTitle">
            {activeTab === "dang-nhap"
              ? "Đăng nhập tài khoản"
              : "Đăng ký tài khoản"}
          </h1>

          <div className="crumbs">
            <a href="#trang-chu">Trang chủ</a>
            <span aria-hidden="true">/</span>
            <span id="crumb">
              {activeTab === "dang-nhap"
                ? "Đăng nhập tài khoản"
                : "Đăng ký tài khoản"}
            </span>
          </div>
        </div>
      </section>

      {/* NỘI DUNG */}
      <main>
        <div className="card">
          {/* TABS */}
          <div className="tabs" role="tablist" aria-label="Tài khoản">
            <button
              className={`tab ${activeTab === "dang-nhap" ? "active" : ""}`}
              role="tab"
              id="tab-dang-nhap"
              aria-controls="p-dang-nhap"
              aria-selected={activeTab === "dang-nhap"}
              type="button"
              onClick={() => changeTab("dang-nhap")}
            >
              Đăng nhập
            </button>

            <button
              className={`tab ${activeTab === "dang-ky" ? "active" : ""}`}
              role="tab"
              id="tab-dang-ky"
              aria-controls="p-dang-ky"
              aria-selected={activeTab === "dang-ky"}
              type="button"
              onClick={() => changeTab("dang-ky")}
            >
              Đăng ký
            </button>
          </div>

          {/* FORM ĐĂNG NHẬP */}
          {activeTab === "dang-nhap" && (
            <section
              className="panel"
              id="p-dang-nhap"
              role="tabpanel"
              aria-labelledby="tab-dang-nhap"
            >
              <form id="loginForm" noValidate onSubmit={handleLogin}>
                <div className="field">
                  <label htmlFor="l-user">
                    Tên đăng nhập <i>*</i>
                  </label>

                  <div className="ctl">
                    <input
                      id="l-user"
                      name="username"
                      type="text"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck="false"
                      placeholder="Nhập tên đăng nhập"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </div>

                  <p className="err" id="l-user-err" role="alert"></p>
                </div>

                <div className="field">
                  <label htmlFor="l-pass">
                    Mật khẩu <i>*</i>
                  </label>

                  <div className="ctl has-eye">
                    <input
                      id="l-pass"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />

                    <button
                      className="eye"
                      type="button"
                      data-eye="l-pass"
                      aria-label="Hiện mật khẩu"
                    ></button>
                  </div>

                  <p className="err" id="l-pass-err" role="alert"></p>
                </div>

                <div className="meta">
                  <label>
                    <input type="checkbox" id="remember" />
                    Ghi nhớ đăng nhập
                  </label>

                  <a href="#quen-mat-khau" id="forgot">
                    Quên mật khẩu?
                  </a>
                </div>

                <button className="submit" type="submit" disabled={loading}>
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <p
                  className="status"
                  id="l-status"
                  role="status"
                  hidden={!status}
                >
                  {status}
                </p>
              </form>
            </section>
          )}

          {/* FORM ĐĂNG KÝ ĐÃ TÁCH COMPONENT */}
          {activeTab === "dang-ky" && (
            <section
              className="panel"
              id="p-dang-ky"
              role="tabpanel"
              aria-labelledby="tab-dang-ky"
            >
              <Register />
            </section>
          )}

          {/* ĐĂNG NHẬP / ĐĂNG KÝ QUA MẠNG XÃ HỘI */}
          <div className="or">
            {activeTab === "dang-nhap"
              ? "hoặc đăng nhập qua"
              : "hoặc đăng ký qua"}
          </div>

          <div className="social">
            <a
              className="fb"
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3Z"></path>
              </svg>
              Facebook
            </a>

            <a
              className="gg"
              href="https://www.google.com/"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8a6.1 6.1 0 0 1 0-12.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5A9.7 9.7 0 0 0 12 2.3a9.7 9.7 0 1 0 0 19.4c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.300-.2-2H12Z"></path>
              </svg>
              Google
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

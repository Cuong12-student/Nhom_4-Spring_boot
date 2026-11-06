import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminRequest, logoutAdminSession } from "./adminApi";
import { clearSessionUser, getSessionUser } from "../user/session";
import "./admin.css";

const sections = [
  ["dashboard", "Tổng quan"],
  ["products", "Sản phẩm"],
  ["categories", "Danh mục"],
  ["orders", "Đơn hàng"],
  ["staff", "Nhân viên"],
];

const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return money.format(Number(value) || 0);
}

function AdminHome() {
  const navigate = useNavigate();
  const session = useMemo(() => getSessionUser(), []);
  const [section, setSection] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadedKey, setLoadedKey] = useState("");
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  const [categoryEditor, setCategoryEditor] = useState(null);
  const [productEditor, setProductEditor] = useState(null);
  const [variantEditor, setVariantEditor] = useState(null);
  const [staffEditor, setStaffEditor] = useState(null);
  const [variantProductId, setVariantProductId] = useState(null);
  const [busy, setBusy] = useState(false);
  const requestKey = `${section}:${refreshKey}`;
  const loading = loadedKey !== requestKey;
  const variantProduct = products.find((product) => product.idProduct === variantProductId) ?? null;
  const hasModal = Boolean(categoryEditor || productEditor || variantEditor || staffEditor || variantProduct);

  useEffect(() => {
    if (!session || session.role !== "ADMIN") {
      navigate("/login", { replace: true });
    }
  }, [navigate, session]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        if (section === "dashboard") {
          const result = await adminRequest("/dashboard");
          if (active) setDashboard(result);
        } else if (section === "categories") {
          const result = await adminRequest("/categories");
          if (active) setCategories(result);
        } else if (section === "products") {
          const [productRows, categoryRows] = await Promise.all([
            adminRequest("/products"),
            adminRequest("/categories"),
          ]);
          if (active) {
            setProducts(productRows);
            setCategories(categoryRows);
          }
        } else if (section === "orders") {
          const result = await adminRequest("/orders");
          if (active) setOrders(result);
        } else if (section === "staff") {
          const result = await adminRequest("/staff");
          if (active) setStaff(result);
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoadedKey(requestKey);
      }
    };

    if (session?.role === "ADMIN") load();
    return () => {
      active = false;
    };
  }, [requestKey, section, refreshKey, session]);

  const pageTitle = useMemo(
    () => sections.find(([key]) => key === section)?.[1] ?? "Admin",
    [section],
  );

  if (!session || session.role !== "ADMIN") return null;

  const reload = () => {
    setError("");
    setRefreshKey((key) => key + 1);
  };
  const runAction = async (action, successMessage) => {
    setBusy(true);
    setError("");
    try {
      await action();
      if (successMessage) window.alert(successMessage);
      reload();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAdminSession();
    } catch (requestError) {
      setError(`Không thể kết thúc phiên trên máy chủ: ${requestError.message}`);
    } finally {
      clearSessionUser();
      navigate("/login", { replace: true });
    }
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    const body = {
      name: categoryEditor.name,
      description: categoryEditor.description,
      status: categoryEditor.status,
    };
    const path = categoryEditor.id ? `/categories/${categoryEditor.id}` : "/categories";
    const saved = await runAction(
      () => adminRequest(path, {
        method: categoryEditor.id ? "PUT" : "POST",
        body: JSON.stringify(body),
      }),
      "Đã lưu danh mục.",
    );
    if (saved) setCategoryEditor(null);
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    const body = {
      name: productEditor.name,
      slug: productEditor.slug,
      description: productEditor.description,
      mainImage: productEditor.mainImage,
      categoryId: Number(productEditor.categoryId),
      status: productEditor.status,
    };
    const path = productEditor.id ? `/products/${productEditor.id}` : "/products";
    const saved = await runAction(
      () => adminRequest(path, {
        method: productEditor.id ? "PUT" : "POST",
        body: JSON.stringify(body),
      }),
      "Đã lưu sản phẩm.",
    );
    if (saved) setProductEditor(null);
  };

  const saveVariant = async (event) => {
    event.preventDefault();
    const body = {
      sku: variantEditor.sku,
      price: Number(variantEditor.price),
      image: variantEditor.image,
      attributes: variantEditor.attributes,
      quantity: Number(variantEditor.quantity),
      status: variantEditor.status,
    };
    const path = variantEditor.id
      ? `/products/${variantEditor.productId}/variants/${variantEditor.id}`
      : `/products/${variantEditor.productId}/variants`;
    const saved = await runAction(
      () => adminRequest(path, {
        method: variantEditor.id ? "PUT" : "POST",
        body: JSON.stringify(body),
      }),
      "Đã lưu biến thể.",
    );
    if (saved) {
      setVariantEditor(null);
    }
  };

  const saveStaff = async (event) => {
    event.preventDefault();
    const body = {
      name: staffEditor.name,
      age: Number(staffEditor.age),
      gender: staffEditor.gender,
      phone: staffEditor.phone,
      email: staffEditor.email,
      address: staffEditor.address,
      username: staffEditor.username,
    };
    if (staffEditor.id) {
      body.active = staffEditor.active;
      if (staffEditor.password) body.password = staffEditor.password;
    } else {
      body.password = staffEditor.password;
    }
    const path = staffEditor.id ? `/staff/${staffEditor.id}` : "/staff";
    const saved = await runAction(
      () => adminRequest(path, {
        method: staffEditor.id ? "PUT" : "POST",
        body: JSON.stringify(body),
      }),
      staffEditor.id ? "Đã cập nhật nhân viên." : "Đã tạo nhân viên và tài khoản đăng nhập.",
    );
    if (saved) setStaffEditor(null);
  };

  const deactivate = (path, description) => {
    if (!window.confirm(`Bạn có chắc muốn ngừng hoạt động ${description}? Dữ liệu lịch sử sẽ được giữ lại.`)) return;
    runAction(() => adminRequest(path, { method: "DELETE" }), "Đã ngừng hoạt động.");
  };

  const sectionContent = () => {
    if (loading) return <div className="admin-empty">Đang tải dữ liệu...</div>;
    if (error && !hasModal) {
      return (
        <div className="admin-error" role="alert">
          <span>{error}</span>
          <button type="button" className="admin-button secondary" onClick={reload}>Thử lại</button>
        </div>
      );
    }

    if (section === "dashboard") {
      const maxRevenue = Math.max(1, ...(dashboard?.revenueByMonth ?? []).map((point) => Number(point.revenue) || 0));
      return (
        <>
          <div className="admin-stats">
            <StatCard label="Doanh thu 12 tháng" value={formatMoney(dashboard?.totalRevenue)} />
            <StatCard label="Đơn hàng" value={dashboard?.orderCount ?? 0} />
            <StatCard label="Sản phẩm" value={dashboard?.productCount ?? 0} />
            <StatCard label="Nhân viên" value={dashboard?.staffCount ?? 0} />
            <StatCard label="Khách hàng" value={dashboard?.customerCount ?? 0} />
          </div>
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Doanh thu theo tháng</h2>
                <p>Chỉ tính các đơn hàng đã hoàn thành.</p>
              </div>
            </div>
            <div className="revenue-chart" aria-label="Biểu đồ doanh thu 12 tháng gần nhất">
              {(dashboard?.revenueByMonth ?? []).map((point) => (
                <div className="revenue-column" key={point.month} title={`${point.month}: ${formatMoney(point.revenue)}`}>
                  <span className="revenue-value">{formatMoney(point.revenue)}</span>
                  <div className="revenue-bar-wrap">
                    <div className="revenue-bar" style={{ height: `${Math.max(3, (Number(point.revenue) / maxRevenue) * 100)}%` }} />
                  </div>
                  <span className="revenue-month">{point.month.slice(5)}/{point.month.slice(0, 4)}</span>
                </div>
              ))}
            </div>
          </section>
          <p className="admin-note">Thông tin khách hàng trong lịch sử đơn hàng chỉ được xem, không thể chỉnh sửa.</p>
        </>
      );
    }

    if (section === "categories") {
      return (
        <section className="admin-panel">
          <PanelHeading title="Danh mục" action="Thêm danh mục" onAction={() => setCategoryEditor({ name: "", description: "", status: "ACTIVE" })} />
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Tên</th><th>Mô tả</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.idCategory}>
                    <td>{category.name}</td><td>{category.description || "—"}</td>
                    <td><StatusBadge status={category.status} /></td>
                    <td className="admin-actions">
                      <button className="admin-button secondary" onClick={() => setCategoryEditor({ ...category, id: category.idCategory })}>Sửa</button>
                      {category.status === "ACTIVE" && (
                        <button className="admin-button danger" disabled={busy} onClick={() => deactivate(`/categories/${category.idCategory}`, `danh mục “${category.name}”`)}>Ngừng</button>
                      )}
                    </td>
                  </tr>
                ))}
                {!categories.length && <EmptyRow columns={4} />}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (section === "products") {
      return (
        <>
          <section className="admin-panel">
            <PanelHeading title="Sản phẩm" action="Thêm sản phẩm" onAction={() => setProductEditor({ name: "", slug: "", description: "", mainImage: "", categoryId: categories.find((item) => item.status === "ACTIVE")?.idCategory ?? "", status: "ACTIVE" })} />
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Biến thể</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.idProduct}>
                      <td><strong>{product.name}</strong><small>{product.slug}</small></td>
                      <td>{product.categoryName}</td>
                      <td>{product.variants.length}</td>
                      <td><StatusBadge status={product.status} /></td>
                      <td className="admin-actions">
                        <button className="admin-button secondary" onClick={() => setProductEditor({ ...product, id: product.idProduct, categoryId: product.categoryId })}>Sửa</button>
                        <button className="admin-button secondary" onClick={() => setVariantProductId(product.idProduct)}>Biến thể</button>
                        {product.status === "ACTIVE" && <button className="admin-button danger" disabled={busy} onClick={() => deactivate(`/products/${product.idProduct}`, `sản phẩm “${product.name}”`)}>Ngừng</button>}
                      </td>
                    </tr>
                  ))}
                  {!products.length && <EmptyRow columns={5} />}
                </tbody>
              </table>
            </div>
          </section>
        </>
      );
    }

    if (section === "orders") {
      return (
        <section className="admin-panel">
          <PanelHeading title="Lịch sử đơn hàng" />
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Mã đơn</th><th>Ngày đặt</th><th>Khách hàng</th><th>Trạng thái</th><th>Tổng tiền</th><th>Chi tiết</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.idOrder}>
                    <td>#{order.idOrder}</td>
                    <td>{order.orderDate ? new Date(order.orderDate).toLocaleString("vi-VN") : "—"}</td>
                    <td><strong>{order.customerName || "—"}</strong><small>{order.customerAge ? `${order.customerAge} tuổi · ${order.customerGender || ""}` : order.customerGender || ""}</small><small>{order.customerPhone || "—"} · {order.customerEmail || "—"}</small><small>{order.customerAddress || ""}</small></td>
                    <td><StatusBadge status={order.status} /></td>
                    <td>{formatMoney(order.totalAmount)}</td>
                    <td><details className="order-details"><summary>Xem sản phẩm</summary>
                      <ul>{order.items.map((item, index) => <li key={`${order.idOrder}-${index}`}>{item.productName || item.sku} × {item.quantity} — {formatMoney(item.price)}</li>)}</ul>
                    </details></td>
                  </tr>
                ))}
                {!orders.length && <EmptyRow columns={6} />}
              </tbody>
            </table>
          </div>
          <p className="admin-note">Trang này chỉ xem đơn hàng và thông tin liên hệ của khách; không cho phép sửa thông tin khách hoặc trạng thái đơn.</p>
        </section>
      );
    }

    return (
      <section className="admin-panel">
        <PanelHeading title="Nhân viên" action="Thêm nhân viên" onAction={() => setStaffEditor({ name: "", age: "", gender: "MALE", phone: "", email: "", address: "", username: "", password: "", active: true })} />
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Nhân viên</th><th>Liên hệ</th><th>Tài khoản</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {staff.map((employee) => (
                <tr key={employee.idStaff}>
                  <td><strong>{employee.name}</strong><small>{employee.age} tuổi · {employee.gender}</small></td>
                  <td>{employee.phone}<small>{employee.email}</small><small>{employee.address}</small></td>
                  <td>{employee.username}</td>
                  <td><StatusBadge status={employee.active ? "ACTIVE" : "INACTIVE"} /></td>
                  <td className="admin-actions">
                    <button className="admin-button secondary" onClick={() => setStaffEditor({ ...employee, id: employee.idStaff, age: String(employee.age), password: "" })}>Sửa</button>
                    {employee.active && <button className="admin-button danger" disabled={busy} onClick={() => deactivate(`/staff/${employee.idStaff}`, `tài khoản nhân viên ${employee.name}`)}>Ngừng</button>}
                  </td>
                </tr>
              ))}
              {!staff.length && <EmptyRow columns={5} />}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span className="admin-brand-icon">HS</span><span>Hiên Sách<small>Quản trị cửa hàng</small></span></div>
        <nav className="admin-nav" aria-label="Điều hướng Admin">
          {sections.map(([key, title]) => (
            <button key={key} className={section === key ? "active" : ""} onClick={() => { setError(""); setSection(key); }}>
              <span className="admin-nav-dot" />{title}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <span>Đăng nhập: <strong>{session.username}</strong></span>
          <button className="admin-logout" onClick={logout}>Đăng xuất</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-eyebrow">KHU VỰC QUẢN TRỊ</span><h1>{pageTitle}</h1></div>
          <span className="admin-role-chip">ADMIN</span>
        </header>
        <div className="admin-content">{sectionContent()}</div>
      </main>

      {categoryEditor && (
        <Modal title={categoryEditor.id ? "Sửa danh mục" : "Thêm danh mục"} onClose={() => setCategoryEditor(null)}>
          <form className="admin-form" onSubmit={saveCategory}>
            <Field label="Tên danh mục" value={categoryEditor.name} required onChange={(name) => setCategoryEditor({ ...categoryEditor, name })} />
            <Field label="Mô tả" value={categoryEditor.description || ""} onChange={(description) => setCategoryEditor({ ...categoryEditor, description })} />
            {categoryEditor.id && <SelectField label="Trạng thái" value={categoryEditor.status} options={[["ACTIVE", "Đang hoạt động"], ["INACTIVE", "Ngừng hoạt động"]]} onChange={(status) => setCategoryEditor({ ...categoryEditor, status })} />}
            <FormButtons busy={busy} onCancel={() => setCategoryEditor(null)} />
          </form>
        </Modal>
      )}

      {productEditor && (
        <Modal title={productEditor.id ? "Sửa sản phẩm" : "Thêm sản phẩm"} onClose={() => setProductEditor(null)} wide>
          <form className="admin-form" onSubmit={saveProduct}>
            <Field label="Tên sản phẩm" value={productEditor.name} required onChange={(name) => setProductEditor({ ...productEditor, name })} />
            <Field label="Slug" value={productEditor.slug} required onChange={(slug) => setProductEditor({ ...productEditor, slug })} />
            <SelectField label="Danh mục" value={productEditor.categoryId} options={categories.filter((item) => item.status === "ACTIVE").map((item) => [item.idCategory, item.name])} required onChange={(categoryId) => setProductEditor({ ...productEditor, categoryId })} />
            <Field label="Ảnh đại diện (URL)" value={productEditor.mainImage || ""} onChange={(mainImage) => setProductEditor({ ...productEditor, mainImage })} />
            <Field label="Mô tả" value={productEditor.description || ""} multiline onChange={(description) => setProductEditor({ ...productEditor, description })} />
            {productEditor.id && <SelectField label="Trạng thái" value={productEditor.status} options={[["ACTIVE", "Đang hoạt động"], ["INACTIVE", "Ngừng hoạt động"]]} onChange={(status) => setProductEditor({ ...productEditor, status })} />}
            <FormButtons busy={busy} onCancel={() => setProductEditor(null)} />
          </form>
        </Modal>
      )}

      {variantProduct && (
        <Modal title={`Biến thể · ${variantProduct.name}`} onClose={() => setVariantProductId(null)} wide>
          <div className="variant-toolbar"><p>Quản lý SKU, thuộc tính, giá và tồn kho.</p><button className="admin-button primary" onClick={() => setVariantEditor({ productId: variantProduct.idProduct, sku: "", price: "", image: "", attributes: "{}", quantity: "0", status: "ACTIVE" })}>Thêm biến thể</button></div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>SKU</th><th>Thuộc tính</th><th>Giá</th><th>Tồn kho</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
              <tbody>
                {variantProduct.variants.map((variant) => (
                  <tr key={variant.idVariant}>
                    <td>{variant.sku}</td><td>{variant.attributes || "—"}</td><td>{formatMoney(variant.price)}</td><td>{variant.quantity}</td><td><StatusBadge status={variant.status} /></td>
                    <td className="admin-actions">
                      <button className="admin-button secondary" onClick={() => setVariantEditor({ ...variant, id: variant.idVariant, productId: variantProduct.idProduct, price: String(variant.price), quantity: String(variant.quantity) })}>Sửa</button>
                      {variant.status === "ACTIVE" && <button className="admin-button danger" disabled={busy} onClick={() => deactivate(`/products/${variantProduct.idProduct}/variants/${variant.idVariant}`, `biến thể ${variant.sku}`)}>Ngừng</button>}
                    </td>
                  </tr>
                ))}
                {!variantProduct.variants.length && <EmptyRow columns={6} />}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {variantEditor && (
        <Modal title={variantEditor.id ? "Sửa biến thể" : "Thêm biến thể"} onClose={() => setVariantEditor(null)}>
          <form className="admin-form" onSubmit={saveVariant}>
            <Field label="Mã SKU" value={variantEditor.sku} required onChange={(sku) => setVariantEditor({ ...variantEditor, sku })} />
            <Field label="Giá (VND)" type="number" min="0" step="1" value={variantEditor.price} required onChange={(price) => setVariantEditor({ ...variantEditor, price })} />
            <Field label="Số lượng tồn kho" type="number" min="0" step="1" value={variantEditor.quantity} required onChange={(quantity) => setVariantEditor({ ...variantEditor, quantity })} />
            <Field label="Ảnh biến thể (URL)" value={variantEditor.image || ""} onChange={(image) => setVariantEditor({ ...variantEditor, image })} />
            <Field label="Thuộc tính (JSON object)" value={variantEditor.attributes || ""} multiline onChange={(attributes) => setVariantEditor({ ...variantEditor, attributes })} />
            {variantEditor.id && <SelectField label="Trạng thái" value={variantEditor.status} options={[["ACTIVE", "Đang hoạt động"], ["INACTIVE", "Ngừng hoạt động"]]} onChange={(status) => setVariantEditor({ ...variantEditor, status })} />}
            <FormButtons busy={busy} onCancel={() => setVariantEditor(null)} />
          </form>
        </Modal>
      )}

      {staffEditor && (
        <Modal title={staffEditor.id ? "Sửa nhân viên" : "Thêm nhân viên và cấp tài khoản"} onClose={() => setStaffEditor(null)} wide>
          <form className="admin-form admin-form-grid" onSubmit={saveStaff}>
            <Field label="Họ và tên" value={staffEditor.name} required onChange={(name) => setStaffEditor({ ...staffEditor, name })} />
            <Field label="Tuổi" type="number" min="1" max="120" value={staffEditor.age} required onChange={(age) => setStaffEditor({ ...staffEditor, age })} />
            <SelectField label="Giới tính" value={staffEditor.gender} options={[["Male", "Nam"], ["Female", "Nữ"]]} required onChange={(gender) => setStaffEditor({ ...staffEditor, gender })} />
            <Field label="Số điện thoại (10 số)" value={staffEditor.phone} required onChange={(phone) => setStaffEditor({ ...staffEditor, phone })} />
            <Field label="Email" type="email" value={staffEditor.email} required onChange={(email) => setStaffEditor({ ...staffEditor, email })} />
            <Field label="Địa chỉ" value={staffEditor.address} required onChange={(address) => setStaffEditor({ ...staffEditor, address })} />
            <Field label="Tên đăng nhập (8–12 ký tự)" value={staffEditor.username} required onChange={(username) => setStaffEditor({ ...staffEditor, username })} />
            <Field label={staffEditor.id ? "Mật khẩu mới (để trống nếu giữ nguyên)" : "Mật khẩu ban đầu (ít nhất 8 ký tự)"} type="password" value={staffEditor.password} required={!staffEditor.id} onChange={(password) => setStaffEditor({ ...staffEditor, password })} />
            {staffEditor.id && <SelectField label="Trạng thái tài khoản" value={staffEditor.active ? "true" : "false"} options={[["true", "Đang hoạt động"], ["false", "Đã ngừng"]]} onChange={(value) => setStaffEditor({ ...staffEditor, active: value === "true" })} />}
            <FormButtons busy={busy} onCancel={() => setStaffEditor(null)} />
          </form>
        </Modal>
      )}
      {error && hasModal && (
        <div className="admin-floating-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} aria-label="Đóng thông báo">×</button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return <article className="admin-stat-card"><span>{label}</span><strong>{value}</strong></article>;
}

function PanelHeading({ title, action, onAction }) {
  return <div className="admin-panel-heading"><h2>{title}</h2>{action && <button className="admin-button primary" onClick={onAction}>{action}</button>}</div>;
}

function StatusBadge({ status }) {
  return <span className={`admin-status ${status === "ACTIVE" || status === "COMPLETED" ? "good" : status === "INACTIVE" || status === "CANCELLED" ? "muted" : "pending"}`}>{status}</span>;
}

function EmptyRow({ columns }) {
  return <tr><td colSpan={columns} className="admin-empty">Chưa có dữ liệu.</td></tr>;
}

function Modal({ title, onClose, wide = false, children }) {
  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`admin-modal${wide ? " wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <header><h2 id="admin-modal-title">{title}</h2><button type="button" onClick={onClose} aria-label="Đóng">×</button></header>
        {children}
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false, multiline = false, ...props }) {
  const id = `admin-${label.replace(/[^a-zA-Z0-9]/g, "-")}`;
  return (
    <label className="admin-field" htmlFor={id}>
      <span>{label}</span>
      {multiline
        ? <textarea id={id} value={value} required={required} onChange={(event) => onChange(event.target.value)} rows="3" {...props} />
        : <input id={id} type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} {...props} />}
    </label>
  );
}

function SelectField({ label, value, options, onChange, required = false }) {
  const id = `admin-${label.replace(/[^a-zA-Z0-9]/g, "-")}`;
  return (
    <label className="admin-field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} required={required} onChange={(event) => onChange(event.target.value)}>
        {!required && <option value="">— Chọn —</option>}
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function FormButtons({ busy, onCancel }) {
  return <div className="admin-form-actions"><button type="button" className="admin-button secondary" onClick={onCancel}>Hủy</button><button type="submit" className="admin-button primary" disabled={busy}>{busy ? "Đang lưu..." : "Lưu"}</button></div>;
}

export default AdminHome;

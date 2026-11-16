import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/login";
import StaffHome from "./staff/pages/StaffHome";
import AdminHome from "./Admin/AdminHome";
import HomePage from "./user/pages/home/HomePage";
import UserStorePage from "./user/pages/store/StorePage";
import UserCartPage from "./user/pages/cart/CartPage";
import UserCheckoutPage from "./user/pages/checkout/CheckoutPage";
import UserProfilePage from "./user/pages/profile/ProfilePage";

import { getSessionUser, validateSession } from "./shared/auth/session";

function AppContent() {
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const user = getSessionUser();

      if (!user?.token) {
        if (active) {
          setCheckingSession(false);
        }
        return;
      }

      await validateSession();

      if (active) {
        setCheckingSession(false);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  if (checkingSession) {
    return <div>Đang kiểm tra phiên đăng nhập...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/store" element={<UserStorePage />} />
      <Route path="/store/:slug/:sku" element={<UserStorePage />} />
      <Route path="/cart" element={<UserCartPage />} />
      <Route path="/checkout" element={<UserCheckoutPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/:slug/:sku" element={<UserStorePage />} />
      <Route path="/staff" element={<StaffHome />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

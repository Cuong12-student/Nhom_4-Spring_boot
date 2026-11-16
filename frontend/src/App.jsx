import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/login";
import StaffHome from "./Staff/StaffHome";
import AdminHome from "./Admin/AdminHome";
import HomePage from "./user/home/HomePage";
import UserStorePage from "./user/UserStorePage";
import UserCartPage from "./user/UserCartPage";
import UserCheckoutPage from "./user/UserCheckoutPage";
import UserProfilePage from "./user/UserProfilePage";

import { getSessionUser, validateSession } from "./user/session";

function AppContent() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const user = getSessionUser();

      if (!user?.token) {
        if (active) {
          setSessionValid(false);
          setCheckingSession(false);
        }
        return;
      }

      const valid = await validateSession();

      if (active) {
        setSessionValid(valid);
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

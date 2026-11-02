import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import StaffHome from "./Staff/StaffHome";
import AdminHome from "./Admin/AdminHome";
import HomePage from "./user/home/HomePage";
import UserStorePage from "./user/UserStorePage";
import UserCartPage from "./user/UserCartPage";
import UserCheckoutPage from "./user/UserCheckoutPage";
import UserProfilePage from "./user/UserProfilePage";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
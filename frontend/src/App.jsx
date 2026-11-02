import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import CustomerHome from "./Customer/CustomerHome";
import StaffHome from "./Staff/StaffHome";
import AdminHome from "./Admin/AdminHome";
import UserStorePage from "./user/UserStorePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/store" element={<UserStorePage />} />

        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/staff" element={<StaffHome />} />
        <Route path="/admin" element={<AdminHome />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
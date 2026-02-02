import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";

function App() {
  const [user, setUser] = useState(localStorage.getItem("userName") || null);

  const handleLogin = (name, token) => {
    setUser(name);
    localStorage.setItem("userName", name);
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route path="/" element={<MainLayout user={user} onLogout={handleLogout} />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="billing" element={<Billing />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/:id" element={<InvoiceDetails />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

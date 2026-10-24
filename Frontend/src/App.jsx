import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layout/DashboardLayout";
import UserGuard from "./components/UserGuard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import { Login, Register, UpdateUser, UserProfile } from "./pages/User";

import {
  SupplierDashboard,
  CreateSupplier,
  GetSupplierById,
  UpdateSupplierById,
  DeleteSupplierById,
} from "./pages/Supplier";

import {
  ProductDashboard,
  CreateProduct,
  GetProductById,
  UpdateProductById,
  DeleteProductById,
} from "./pages/Product";

import {
  CustomerDashboard,
  CreateCustomer,
  GetCustomerById,
  UpdateCustomerById,
  DeleteCustomerById,
} from "./pages/Customer";

import {
  CreateSales,
  SalesDashboard,
  GetSalesById,
  UpdateSalesById,
  DeleteSalesById,
} from "./pages/Sales";

import {
  ExpenseDashboard,
  CreateExpense,
  GetExpensesById,
  UpdateExpenseById,
  DeleteExpenseById,
} from "./pages/Expense";

import AdminDashboard from "./pages/AdminDashboard";
import InvoicePage from "./pages/InvoicePage";
import Complaint from "./pages/Complaint";

// Smart root redirect
const RootRedirect = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      {/* ROOT & AUTH */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN OVERVIEW */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </AdminRoute>
        }
      />

      {/* USER PROFILE & SETTINGS */}
      <Route
        path="/user"
        element={
          <UserGuard>
            <DashboardLayout>
              <UserProfile />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/updateUser/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <UpdateUser />
            </DashboardLayout>
          </UserGuard>
        }
      />

      {/* SUPPLIER */}
      <Route
        path="/supplier"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SupplierDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier/create"
        element={
          <UserGuard>
            <DashboardLayout>
              <CreateSupplier />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/supplier/get/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <GetSupplierById />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/supplier/update/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <UpdateSupplierById />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/supplier/delete/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <DeleteSupplierById />
            </DashboardLayout>
          </UserGuard>
        }
      />

      {/* PRODUCT / INVENTORY */}
      <Route
        path="/product"
        element={
          <UserGuard>
            <DashboardLayout>
              <ProductDashboard />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/product/create"
        element={
          <UserGuard>
            <DashboardLayout>
              <CreateProduct />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/product/get/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <GetProductById />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/product/update/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <UpdateProductById />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/product/delete/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <DeleteProductById />
            </DashboardLayout>
          </UserGuard>
        }
      />

      {/* CUSTOMER */}
      <Route
        path="/customer"
        element={
          <UserGuard>
            <DashboardLayout>
              <CustomerDashboard />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/customer/create"
        element={
          <UserGuard>
            <DashboardLayout>
              <CreateCustomer />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/customer/get/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <GetCustomerById />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/customer/update/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <UpdateCustomerById />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/customer/delete/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <DeleteCustomerById />
            </DashboardLayout>
          </UserGuard>
        }
      />

      {/* SALES / POS */}
      <Route
        path="/sales"
        element={
          <UserGuard>
            <DashboardLayout>
              <SalesDashboard />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/sales/create"
        element={
          <UserGuard>
            <DashboardLayout>
              <CreateSales />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/sales/get/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <GetSalesById />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/sales/update/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <UpdateSalesById />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/sales/delete/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <DeleteSalesById />
            </DashboardLayout>
          </UserGuard>
        }
      />

      {/* EXPENSE */}
      <Route
        path="/expense"
        element={
          <UserGuard>
            <DashboardLayout>
              <ExpenseDashboard />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/expense/create"
        element={
          <UserGuard>
            <DashboardLayout>
              <CreateExpense />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/expense/get/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <GetExpensesById />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/expense/update/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <UpdateExpenseById />
            </DashboardLayout>
          </UserGuard>
        }
      />
      <Route
        path="/expense/delete/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <DeleteExpenseById />
            </DashboardLayout>
          </UserGuard>
        }
      />

      {/* INVOICE */}
      <Route
        path="/invoice/:id"
        element={
          <UserGuard>
            <DashboardLayout>
              <InvoicePage />
            </DashboardLayout>
          </UserGuard>
        }
      />

      {/* GRIEVANCES & WELFARE */}
      <Route
        path="/complaints"
        element={
          <UserGuard>
            <DashboardLayout>
              <Complaint />
            </DashboardLayout>
          </UserGuard>
        }
      />

      {/* CATCH ALL FALLBACK */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};

export default App;
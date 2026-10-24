import axios from "axios";

const Base_url = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const API = axios.create({
  baseURL: Base_url,
});

const AUTH_API = axios.create({
  baseURL: Base_url,
});

const attachAuth = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let the browser set multipart boundary if payload is FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
};

API.interceptors.request.use(attachAuth, (error) => Promise.reject(error));
AUTH_API.interceptors.request.use(attachAuth, (error) => Promise.reject(error));

const handleResponse = (res) => {
  if (res.data && res.data.success === false) {
    const error = new Error(res.data.message || "Operation failed");
    error.response = res;
    return Promise.reject(error);
  }
  return res;
};

const handleError = (error) => {
  let message =
    error.response?.data?.message ||
    error.message ||
    "Something went wrong";

  if (
    typeof error.response?.data === "string" &&
    (error.response.data.includes("<!DOCTYPE") || error.response.data.includes("<pre>Cannot"))
  ) {
    message = `Backend endpoint returned ${error.response.status}. Please ensure Shopkeeper backend is running on port 3000.`;
  } else if (
    message.includes("buffering timed out") ||
    message.includes("MongoServerError") ||
    message.includes("bad auth")
  ) {
    message =
      "Database connection failed: MongoDB Atlas rejected your login credentials (bad auth). Please check your password in Backend/.env.";
  }

  console.error("API ERROR:", message, error.response?.data || error.message);

  if (error.response?.status === 401) {
    // Only redirect to login if not already on auth pages
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/register"
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  return Promise.reject({
    success: false,
    message: message,
    status: error.response?.status,
    response: error.response,
  });
};

API.interceptors.response.use(handleResponse, handleError);
AUTH_API.interceptors.response.use(handleResponse, handleError);

// ============ Dashboard Stats ============ //
export const getDashboardStats = async () => {
  return await AUTH_API.get("/dashboard/stats");
};

// ============ User Auth & Profile ============ //
export const register = (data) => API.post("/user/register", data);

export const login = (data) => API.post("/user/login", data);

export const getUserById = (id) => API.get(`/user/get/${id}`);

export const updateUserById = (id, data) =>
  AUTH_API.put(`/user/update/${id}`, data);

// ============ Supplier ============ //
export const createSupplier = (data) => API.post("/supplier/create", data);

export const getSupplier = (page = 1, limit = 8, search = "") =>
  API.get(`/supplier/get?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const getSupplierById = (id) => API.get(`/supplier/get/${id}`);

export const updateSupplierById = (id, data) =>
  API.put(`/supplier/update/${id}`, data);

export const deleteSupplierById = (id) =>
  API.delete(`/supplier/delete/${id}`);

// ============ Product / Inventory ============ //
export const createProduct = (data) => API.post("/product/create", data);

export const getProduct = (page = 1, limit = 8, search = "") =>
  API.get(`/product/get?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const getProductById = (id) => API.get(`/product/get/${id}`);

export const updateProductById = (id, data) =>
  API.put(`/product/update/${id}`, data);

export const deleteProductById = (id) =>
  API.delete(`/product/delete/${id}`);

// ============ Customer ============ //
export const createCustomer = (data) => API.post("/customer/create", data);

export const getCustomer = (page = 1, limit = 100, search = "") =>
  API.get(`/customer/get?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const getCustomerById = (id) => API.get(`/customer/get/${id}`);

export const updateCustomerById = (id, data) =>
  API.put(`/customer/update/${id}`, data);

export const deleteCustomerById = (id) =>
  API.delete(`/customer/delete/${id}`);

// ============ Sales & POS ============ //
export const createSales = (data) => API.post("/sales/create", data);

export const getSales = (page = 1, limit = 8, search = "") =>
  API.get(`/sales/get?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const getSalesById = (id) => API.get(`/sales/get/${id}`);

export const updateSalesById = (id, data) =>
  API.put(`/sales/update/${id}`, data);

export const deleteSalesById = (id) =>
  API.delete(`/sales/delete/${id}`);

// ============ Expenses ============ //
export const createExpense = (data) => API.post("/expense/create", data);

export const getExpenses = (page = 1, limit = 8, search = "") =>
  API.get(`/expense/get?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const getExpensesById = (id) => API.get(`/expense/get/${id}`);

export const updateExpensesById = (id, data) =>
  API.put(`/expense/update/${id}`, data);

export const deleteExpenseById = (id) =>
  API.delete(`/expense/delete/${id}`);

// ============ Invoices ============ //
export const createInvoice = (data) => AUTH_API.post("/invoice", data);

export const getInvoiceById = (id) => AUTH_API.get(`/invoice/${id}`);

export default API;

import axios from "axios";

const Base_url = "http://localhost:3000/api";

const API = axios.create({
    baseURL : Base_url,
    headers: {
        "Content-Type": "application/json",
    },
});

const AUTH_API = axios.create({
    baseURL: Base_url,
});

AUTH_API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        console.log("TOKEN SENT:", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const handleResponse = (res) => res;

const handleError = (error) => {
    const message = 
    error.response?.data?.message ||
    error.message ||
    "Something went wrong";

    console.error("API ERROR:", error.response?.data || error.message);

    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = "/login";
    }
    return Promise.reject({
        success : false,
        message: error.response?.data?.message || error.message,
        status : error.response?.status,
    });
};

API.interceptors.response.use(handleResponse, handleError);
AUTH_API.interceptors.response.use(handleResponse,handleError);

export const register = (data) => 
    API.post("/user/register", data);

export const login = (data) => 
    API.post("/user/login",data);

export const getUserById = (id) =>
    API.get(`/user/get/${id}`);

export const updateUserById = (id, data) =>
    AUTH_API.put(`/user/update/${id}`, data);

// ============ supplier ===========//
export const createSupplier = (data) => 
    API.post("/supplier/create", data);

export const getSupplier = (page = 1, limit = 2, search="") =>
  API.get(`/supplier/get?page=${page}&limit=${limit}&search=${search}`);

export const getSupplierById = (id) =>
    API.get(`/supplier/get/${id}`);

export const updateSupplierById = (id,data) =>
    API.put(`/supplier/update/${id}`, data);

export const deleteSupplierById = (id) =>
    API.delete(`/supplier/delete/${id}`);

//====================Product =================//
export const createProduct = (data) => 
    API.post("/product/create", data);

export const getProduct = (page = 1, limit = 2, search="") =>
  API.get(`/product/get?page=${page}&limit=${limit}&search=${search}`);

export const getProductById = (id) =>
    API.get(`/product/get/${id}`);

export const updateProductById = (id,data) =>
    API.put(`/product/update/${id}`, data);

export const deleteProductById = (id) =>
    API.delete(`/product/delete/${id}`);

//============sales============//
export const createCustomer = (data) => 
    API.post("/customer/create", data);

export const getCustomer = (page = 1, limit = 100, search="") =>
  API.get(`/customer/get?page=${page}&limit=${limit}&search=${search}`);

export const getCustomerById = (id) =>
    API.get(`/customer/get/${id}`);

export const updateCustomerById = (id,data) =>
    API.put(`/customer/update/${id}`, data);

export const deleteCustomerById = (id) =>
    API.delete(`/customer/delete/${id}`);

//============sales============//
export const createSales = (data) => 
    API.post("/sales/create", data);

export const getSales = (page = 1, limit = 2, search="") =>
  API.get(`/sales/get?page=${page}&limit=${limit}&search=${search}`);

export const getSalesById = (id) =>
    API.get(`/sales/get/${id}`);

export const updateSalesById = (id,data) =>
    API.put(`/sales/update/${id}`, data);

export const deleteSalesById = (id) =>
    API.delete(`/sales/delete/${id}`);

//============Expenses============//
export const createExpense = (data) => 
    API.post("/expense/create", data);

export const getExpenses = (page = 1, limit = 2, search="") =>
  API.get(`/expense/get?page=${page}&limit=${limit}&search=${search}`);

export const getExpensesById = (id) =>
    API.get(`/expense/get/${id}`);

export const updateExpensesById = (id,data) =>
    API.put(`/expense/update/${id}`, data);

export const deleteExpenseById = (id) =>
    API.delete(`/expense/delete/${id}`);




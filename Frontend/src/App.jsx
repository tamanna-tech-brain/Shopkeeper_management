import React from 'react'
import { Routes, Route , Navigate, Router } from "react-router-dom";
import Navbar from "./components/Navbar";

import UserGuard from "./components/UserGuard";
import {Login, Register, UpdateUser} from "./pages/User";
import {SupplierDashboard, CreateSupplier, GetSupplierById, UpdateSupplierById, DeleteSupplierById} from "./pages/Supplier";
import { ProductDashboard, CreateProduct , GetAllProduct, GetProductById, UpdateProductById, DeleteProductById} from './pages/Product';
import {CustomerDashboard, CreateCustomer,GetAllCustomer, GetCustomerById, UpdateCustomerById, DeleteCustomerById} from "./pages/Customer";
import {CreateSales, SalesDashboard, GetAllSales, GetSalesById, UpdateSalesById, DeleteSalesById} from "./pages/Sales"
import { ExpenseDashboard, CreateExpense, GetAllExpense, GetExpensesById, UpdateExpenseById, DeleteExpenseById } from './pages/Expense';


const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/updateUser/:id"
         element={
         <UserGuard>
          <UpdateUser/>
         </UserGuard>} />
        <Route
          path="/supplier"
            element={
                <UserGuard>
                    <SupplierDashboard />
                </UserGuard>
            }
        />
        <Route path="/supplier/create"
        element={
          <UserGuard>
            <CreateSupplier/>
          </UserGuard>
        }/>
        
        <Route
          path="/supplier/get/:id"
          element={
          <UserGuard>
            <GetSupplierById />
          </UserGuard>
          }
        />
        <Route path='/supplier/update/:id'
         element={
         <UserGuard>
         <UpdateSupplierById/>
         </UserGuard>
         }
         />
         <Route
          path="/supplier/delete/:id"
          element={
            <UserGuard>
              <DeleteSupplierById />
            </UserGuard>
          }
         />
        
        <Route
          path="/product"
          element={
            <UserGuard>
              <ProductDashboard/>
            </UserGuard>
          }
        />

        <Route
        path='/product/create'
        element={
          <UserGuard>
            <CreateProduct/>
          </UserGuard>
        }
        />
        <Route
        path='/product/get/:id'
        element={
          <UserGuard>
            <GetProductById/>
          </UserGuard>
        }
        />
        <Route
        path='/product/update/:id'
        element={
          <UserGuard>
            <UpdateProductById/>
          </UserGuard>
        }
        />
        <Route
        path="/product/delete/:id"
        element={<DeleteProductById/>} 
        />
        
        <Route
        path='/customer'
        element={
          <UserGuard>
            <CustomerDashboard/>
          </UserGuard>
        }
        />

        <Route
        path='/customer/create'
        element={
           <UserGuard>
            <CreateCustomer/>
           </UserGuard>
        }
        />
        
       <Route
        path='/customer/get/:id'
        element={
           <UserGuard>
            <GetCustomerById/>
           </UserGuard>
        }
        />

        <Route
        path='/customer/update/:id'
        element={
           <UserGuard>
            <UpdateCustomerById/>
           </UserGuard>
        }
        />

        <Route
        path='/customer/delete/:id'
        element={
           <UserGuard>
            <DeleteCustomerById/>
           </UserGuard>
        }
        />

        <Route
        path="/sales"
        element={
            <UserGuard>
              <SalesDashboard />
            </UserGuard>
        }
        />

        <Route
        path="/sales/create"
        element={
            <UserGuard>
              <CreateSales />
            </UserGuard>
        }
        />

        <Route
        path="/sales/get/:id"
        element={
            <UserGuard>
                <GetSalesById />
            </UserGuard>
        }
        />

        <Route
          path="/sales/update/:id"
          element={
              <UserGuard>
                  <UpdateSalesById />
              </UserGuard>
          }
        />

        <Route
        path="/sales/delete/:id"
        element={
            <UserGuard>
               <DeleteSalesById />
            </UserGuard>
        }
        />

        <Route
        path="/expense"
        element={
            <UserGuard>
              <ExpenseDashboard />
            </UserGuard>
        }
        />

        <Route
        path="/expense/create"
        element={
            <UserGuard>
              <CreateExpense />
            </UserGuard>
        }
        />

        <Route
        path="/expense/get/:id"
        element={
            <UserGuard>
                <GetExpensesById/>
            </UserGuard>
        }
        />

        <Route
          path="/expense/update/:id"
          element={
              <UserGuard>
                  <UpdateExpenseById />
              </UserGuard>
          }
        />

        <Route
        path="/expense/delete/:id"
        element={
            <UserGuard>
               <DeleteExpenseById />
            </UserGuard>
        }
        />

        <Route     
          path="/user" 
          element={
            <UserGuard>
            <h1 className="text-white text-center mt-10">User Dashboard</h1>
            </UserGuard>
          } 
        />
      </Routes>
    </>
  )
}

export default App
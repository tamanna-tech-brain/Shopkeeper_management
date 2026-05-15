import React from 'react'
import { Routes, Route , Navigate, Router } from "react-router-dom";
import Navbar from "./components/Navbar";

import UserGuard from "./components/UserGuard";
import {Login, Register, UpdateUser} from "./pages/User";
import {SupplierDashboard, CreateSupplier, GetSupplierById, UpdateSupplierById, DeleteSupplierById} from "./pages/Supplier";
import { ProductDashboard, CreateProduct , GetAllProduct, GetProductById, UpdateProductById, DeleteProductById} from './pages/Product';


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
import React from "react";
import { Link, useLocation } from "react-router-dom";

// Backward-compatible fallback navbar if used standalone
function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Don't render redundant top navbar on auth pages or when inside DashboardLayout
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    token
  ) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 backdrop-blur-md text-white flex items-center justify-between px-6 py-3 border-b border-slate-800">
      <Link to="/" className="font-bold text-lg text-indigo-400">
        ShopKeeper Pro
      </Link>
      <div className="flex gap-4 text-sm font-medium">
        <Link to="/login" className="text-slate-300 hover:text-white transition">
          Login
        </Link>
        <Link
          to="/register"
          className="px-3 py-1 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
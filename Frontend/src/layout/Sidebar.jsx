import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import toast from "react-hot-toast";
import {
  FaChartPie,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaTruckLoading,
  FaReceipt,
  FaSignOutAlt,
  FaStore,
  FaUserCog,
  FaPlus,
  FaHandsHelping,
} from "react-icons/fa";

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user) ||
    JSON.parse(localStorage.getItem("user") || "null") || {
      name: "Shopkeeper",
      email: "admin@shop.com",
      role: localStorage.getItem("role") || "admin",
    };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaChartPie className="w-4 h-4" />,
    },
    {
      name: "Products & Stock",
      path: "/product",
      icon: <FaBoxOpen className="w-4 h-4" />,
      createPath: "/product/create",
    },
    {
      name: "Sales & Billing",
      path: "/sales",
      icon: <FaShoppingCart className="w-4 h-4" />,
      createPath: "/sales/create",
    },
    {
      name: "Customers",
      path: "/customer",
      icon: <FaUsers className="w-4 h-4" />,
      createPath: "/customer/create",
    },
    {
      name: "Suppliers",
      path: "/supplier",
      icon: <FaTruckLoading className="w-4 h-4" />,
      createPath: "/supplier/create",
    },
    {
      name: "Expenses",
      path: "/expense",
      icon: <FaReceipt className="w-4 h-4" />,
      createPath: "/expense/create",
    },
    {
      name: "Grievances & Welfare",
      path: "/complaints",
      icon: <FaHandsHelping className="w-4 h-4" />,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950/95 lg:bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-slate-800/60">
            <Link
              to="/admin"
              className="flex items-center gap-3 group"
              onClick={onClose}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition duration-200">
                <FaStore className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-300 transition">
                    ShopKeeper
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Retail & Inventory Hub
                </p>
              </div>
            </Link>
          </div>

          {/* Quick POS Shortcut */}
          <div className="px-4 pt-5 pb-2">
            <Link
              to="/sales/create"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 transition active:scale-[0.98]"
            >
              <FaPlus className="w-3 h-3" />
              <span>NEW SALE / POS</span>
            </Link>
          </div>

          {/* Main Navigation Links */}
          <nav className="px-3 py-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)]">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Main Menu
            </div>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between group"
                >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                      active
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <span
                      className={`${
                        active
                          ? "text-white"
                          : "text-slate-400 group-hover:text-indigo-400"
                      } transition`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>

                  {item.createPath && (
                    <Link
                      to={item.createPath}
                      onClick={onClose}
                      title={`Add ${item.name}`}
                      className="ml-1 p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-900/80 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaPlus className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3">
            <Link
              to="/user"
              onClick={onClose}
              className="flex items-center gap-3 overflow-hidden flex-1 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate group-hover:text-indigo-400 transition">
                  {user?.name || "Shopkeeper"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.role === "admin" ? "Store Administrator" : "Sales Executive"}
                </p>
              </div>
            </Link>

            <Link
              to="/user"
              onClick={onClose}
              title="Profile Settings"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <FaUserCog className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition"
          >
            <FaSignOutAlt className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

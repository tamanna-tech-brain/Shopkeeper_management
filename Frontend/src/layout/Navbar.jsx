import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import socket from "../socket";
import {
  FaBars,
  FaPlus,
  FaBell,
  FaCircle,
  FaUserCircle,
  FaReceipt,
  FaBox,
} from "react-icons/fa";

const Navbar = ({ onOpenSidebar }) => {
  const location = useLocation();
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null") || {
    name: "Admin",
    role: localStorage.getItem("role") || "admin",
  };

  useEffect(() => {
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    const handleNewOrder = (order) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          text: `New Sale Recorded: ₹${order.totalAmount || "0"}`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev.slice(0, 7),
      ]);
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("new-order", handleNewOrder);
    };
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return { title: "Admin Overview", category: "Analytics" };
    if (path.startsWith("/product/create"))
      return { title: "Add New Product", category: "Inventory" };
    if (path.startsWith("/product/update"))
      return { title: "Update Product", category: "Inventory" };
    if (path.startsWith("/product/get"))
      return { title: "Product Details", category: "Inventory" };
    if (path.startsWith("/product"))
      return { title: "Product Inventory", category: "Inventory" };
    if (path.startsWith("/sales/create"))
      return { title: "Create Sale / POS", category: "Billing" };
    if (path.startsWith("/sales/update"))
      return { title: "Edit Sales Record", category: "Billing" };
    if (path.startsWith("/sales/get"))
      return { title: "Sale Details", category: "Billing" };
    if (path.startsWith("/sales"))
      return { title: "Sales & Billing", category: "Billing" };
    if (path.startsWith("/customer/create"))
      return { title: "Add New Customer", category: "CRM" };
    if (path.startsWith("/customer"))
      return { title: "Customer Directory", category: "CRM" };
    if (path.startsWith("/supplier/create"))
      return { title: "Add New Supplier", category: "Vendors" };
    if (path.startsWith("/supplier"))
      return { title: "Supplier Directory", category: "Vendors" };
    if (path.startsWith("/expense/create"))
      return { title: "Record Expense", category: "Finance" };
    if (path.startsWith("/expense"))
      return { title: "Expense Tracker", category: "Finance" };
    if (path.startsWith("/complaints"))
      return { title: "Grievances & Welfare", category: "Support" };
    if (path.startsWith("/user"))
      return { title: "Account & Settings", category: "Profile" };
    if (path.startsWith("/invoice"))
      return { title: "Retail Invoice", category: "Billing" };
    return { title: "Dashboard", category: "ShopKeeper" };
  };

  const { title, category } = getPageTitle();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
        >
          <FaBars className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>{category}</span>
            <span>/</span>
            <span className="text-indigo-400 font-semibold">{title}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Live Sync, Notifications, Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Real-time Socket Indicator */}
        <div
          title={
            socketConnected
              ? "Live WebSocket connected"
              : "WebSocket connecting..."
          }
          className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-slate-800"
        >
          <FaCircle
            className={`w-2 h-2 ${
              socketConnected ? "text-emerald-400 animate-pulse" : "text-amber-400"
            }`}
          />
          <span className="text-slate-300">
            {socketConnected ? "Live Sync" : "Syncing"}
          </span>
        </div>

        {/* Quick Action Button */}
        <Link
          to="/sales/create"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition active:scale-95"
        >
          <FaPlus className="w-2.5 h-2.5" />
          <span>New Sale</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            <FaBell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 glass-panel">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Notifications
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="text-[10px] text-slate-400 hover:text-indigo-400"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No new live notifications
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-xl bg-slate-800/50 border border-slate-750 text-xs"
                    >
                      <p className="text-slate-200 font-medium">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Mini Avatar */}
        <Link
          to="/user"
          className="flex items-center gap-2 p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-slate-200">
            {user?.name || "User"}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

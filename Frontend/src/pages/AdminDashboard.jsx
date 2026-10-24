import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import socket from "../socket";
import StatsCard from "../components/analytics/StatsCard";
import SalesChart from "../components/analytics/SalesChart";
import PieChartBox from "../components/analytics/PieChartBox";
import { getDashboardStats, getSales, getProduct } from "../apis/api.js";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaBoxOpen,
  FaMoneyBillWave,
  FaShoppingCart,
  FaPlus,
  FaArrowRight,
  FaReceipt,
  FaTruckLoading,
  FaExclamationTriangle,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null") || {
    name: "Shopkeeper",
  };

  const salesData = [
    { month: "Jan", sales: 18000 },
    { month: "Feb", sales: 24000 },
    { month: "Mar", sales: 32000 },
    { month: "Apr", sales: 29000 },
    { month: "May", sales: 45000 },
    { month: "Jun", sales: 52000 },
  ];

  const pieData = [
    { name: "Products", value: stats?.totalProducts || 12 },
    { name: "Sales", value: stats?.totalSales || 8 },
    { name: "Users", value: stats?.totalUsers || 4 },
  ];

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data.data);
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSales = async () => {
    try {
      const res = await getSales(1, 5);
      setRecentSales(res.data.data || []);
    } catch (error) {
      console.error("Recent sales error:", error);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await getProduct(1, 50);
      const items = res.data?.data || [];
      const low = items.filter((p) => Number(p.stock) < 10);
      setLowStockItems(low);
    } catch (err) {
      console.warn("Could not check inventory thresholds:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentSales();
    fetchLowStock();

    const handleNewOrder = (order) => {
      toast.success(
        `🎉 New Sale Recorded! ₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}`,
        { duration: 4000 }
      );
      fetchStats();
      fetchRecentSales();
      fetchLowStock();
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Overview & Analytics
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Welcome back, {user?.name || "Shopkeeper"} 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Monitor live sales volume, manage inventory stock, track customer
              billing, and keep expenses organized in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/sales/create"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <FaPlus className="w-3 h-3" />
              <span>Create Sale / POS</span>
            </Link>
            <Link
              to="/product/create"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
            >
              <FaBoxOpen className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-500/30 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <FaExclamationTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-100 text-sm">
                Low Inventory Alert ({lowStockItems.length} product{lowStockItems.length > 1 ? "s" : ""} under 10 units)
              </h4>
              <p className="text-xs text-amber-200/80 mt-0.5">
                {lowStockItems
                  .slice(0, 3)
                  .map((p) => `${p.name} (${p.stock} left)`)
                  .join(" • ")}
                {lowStockItems.length > 3 && ` +${lowStockItems.length - 3} more`}
              </p>
            </div>
          </div>
          <Link
            to="/product"
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold whitespace-nowrap transition"
          >
            Manage Products &rarr;
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Revenue"
          value={`₹${Number(stats?.revenue || 0).toLocaleString("en-IN")}`}
          icon={<FaMoneyBillWave />}
          color="green"
          trend={14.8}
          trendLabel="vs last month"
        />

        <StatsCard
          title="Completed Sales"
          value={stats?.totalSales || 0}
          icon={<FaShoppingCart />}
          color="yellow"
          trend={8.2}
          trendLabel="sales volume"
        />

        <StatsCard
          title="Catalog Products"
          value={stats?.totalProducts || 0}
          icon={<FaBoxOpen />}
          color="indigo"
          trend={4.5}
          trendLabel="active items"
        />

        <StatsCard
          title="Store Customers"
          value={stats?.totalUsers || 0}
          icon={<FaUsers />}
          color="pink"
          trend={12.0}
          trendLabel="accounts"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={salesData} />
        </div>
        <div>
          <PieChartBox data={pieData} />
        </div>
      </div>

      {/* Recent Sales Table & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Recent Sales Transactions
              </h3>
              <p className="text-xs text-slate-400">
                Latest customer purchases processed through POS
              </p>
            </div>
            <Link
              to="/sales"
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>View All</span>
              <FaArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          {recentSales.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No sales recorded yet. Start by generating your first sale.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Customer</th>
                    <th className="pb-3">Product / Item</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentSales.map((sale) => (
                    <tr
                      key={sale._id}
                      className="hover:bg-slate-800/30 transition"
                    >
                      <td className="py-3 pl-2 font-medium text-white">
                        {sale?.customerId?.name || "Walk-in Customer"}
                      </td>
                      <td className="py-3 text-slate-300">
                        {sale?.items?.[0]?.productId?.name || "Product"}
                        {sale?.items?.length > 1
                          ? ` (+${sale.items.length - 1} more)`
                          : ""}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {sale?.paymentMethod || "Cash"}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-400">
                        ₹{Number(sale.totalAmount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <Link
                          to={`/sales/get/${sale._id}`}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Module Shortcuts */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 tracking-tight">
              Quick Management
            </h3>
            <div className="space-y-2.5">
              <Link
                to="/sales/create"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <FaShoppingCart className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-indigo-400 transition">
                      Point of Sale (POS)
                    </p>
                    <p className="text-[11px] text-slate-400">Record customer billing</p>
                  </div>
                </div>
                <FaArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/product/create"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
                    <FaBoxOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-pink-400 transition">
                      Add New Product
                    </p>
                    <p className="text-[11px] text-slate-400">Expand store inventory</p>
                  </div>
                </div>
                <FaArrowRight className="w-3 h-3 text-slate-400 group-hover:text-pink-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/customer/create"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <FaUsers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-amber-400 transition">
                      Add Customer
                    </p>
                    <p className="text-[11px] text-slate-400">Save client contact details</p>
                  </div>
                </div>
                <FaArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/expense/create"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <FaReceipt className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-rose-400 transition">
                      Record Expense
                    </p>
                    <p className="text-[11px] text-slate-400">Track utility & store costs</p>
                  </div>
                </div>
                <FaArrowRight className="w-3 h-3 text-slate-400 group-hover:text-rose-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/supplier/create"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <FaTruckLoading className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-cyan-400 transition">
                      Add Supplier
                    </p>
                    <p className="text-[11px] text-slate-400">Register new vendor source</p>
                  </div>
                </div>
                <FaArrowRight className="w-3 h-3 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
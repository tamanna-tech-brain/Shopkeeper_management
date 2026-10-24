import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createSales,
  getSales,
  getSalesById,
  updateSalesById,
  deleteSalesById,
  getCustomer,
  getProduct,
  createInvoice,
} from "../apis/api";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import StatusBadge from "../ui/StatusBadge";
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaFileInvoiceDollar,
  FaTrashAlt,
  FaEdit,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaBoxOpen,
  FaArrowLeft,
  FaMoneyBillWave,
  FaCreditCard,
  FaMobileAlt,
  FaDownload,
} from "react-icons/fa";

// ======================== SALES DASHBOARD ======================== //
const SalesDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sales & Billing (POS)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Process counter sales, manage invoices, and inspect transaction histories.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/sales/create")}
          icon={<FaPlus className="w-3.5 h-3.5" />}
        >
          New Sale / POS
        </Button>
      </div>

      <GetAllSales />
    </div>
  );
};

// ======================== GET ALL SALES ======================== //
const GetAllSales = () => {
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 8;

  const fetchSales = async (currentPage) => {
    try {
      setLoading(true);
      const res = await getSales(currentPage, limit, search);
      const fetched = Array.isArray(res.data.data) ? res.data.data : [];
      setSales(fetched);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sales history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(page);
  }, [page, search]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteSalesById(deleteId);
      toast.success("Sales record deleted successfully");
      setDeleteId(null);
      fetchSales(page);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete sale");
    } finally {
      setDeleting(false);
    }
  };

  // Client-side search enhancement
  const filteredSales = sales.filter((sale) => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return true;
    const customerName = sale?.customerId?.name?.toLowerCase() || "";
    const productName = sale?.items?.[0]?.productId?.name?.toLowerCase() || "";
    const payment = sale?.paymentMethod?.toLowerCase() || "";
    const totalAmount = String(sale?.totalAmount || "");

    return (
      customerName.includes(keyword) ||
      productName.includes(keyword) ||
      payment.includes(keyword) ||
      totalAmount.includes(keyword)
    );
  });

  const getPaymentBadge = (method) => {
    switch (method?.toLowerCase()) {
      case "upi":
        return <StatusBadge status="UPI" variant="info" />;
      case "card":
        return <StatusBadge status="Card" variant="purple" />;
      default:
        return <StatusBadge status="Cash" variant="success" />;
    }
  };

  const handleExportCSV = () => {
    if (!filteredSales || !filteredSales.length) {
      toast.error("No sales records to export");
      return;
    }
    const headers = [
      "Date",
      "Customer Name",
      "Customer Phone",
      "Items Count",
      "Items Detail",
      "Payment Method",
      "Total Amount (INR)",
    ];
    const rows = filteredSales.map((s) => [
      s.date ? new Date(s.date).toLocaleDateString("en-IN") : "N/A",
      s.customerId?.name || "Walk-in Customer",
      s.customerId?.phone || "N/A",
      s.items?.length || 1,
      (s.items || [])
        .map((i) => `${i.productId?.name || "Product"} (x${i.quantity})`)
        .join("; "),
      s.paymentMethod || "Cash",
      s.totalAmount || 0,
    ]);
    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((r) =>
        r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sales_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredSales.length} sales to CSV!`);
  };

  return (
    <div className="space-y-6">
      {/* Search Toolbar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by customer, product, or payment method..."
          className="w-full sm:flex-1"
        />

        <Button
          variant="outline"
          onClick={handleExportCSV}
          icon={<FaDownload className="w-3.5 h-3.5" />}
          className="w-full sm:w-auto text-xs"
        >
          Export CSV
        </Button>
      </div>

      {/* Main List */}
      {loading ? (
        <Loader text="Loading sales transactions..." />
      ) : filteredSales.length === 0 ? (
        <EmptyState
          icon={<FaShoppingCart className="w-8 h-8 opacity-80" />}
          title="No Sales Transactions"
          description={
            search
              ? "No sales matched your search keywords."
              : "No sales have been recorded yet. Click 'New Sale' to bill your first customer."
          }
          actionText={search ? "Clear Search" : "+ New Sale"}
          onAction={() => {
            if (search) setSearch("");
            else navigate("/sales/create");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredSales.map((sale) => {
            const firstItem = sale?.items?.[0];
            const extraItems = (sale?.items?.length || 1) - 1;

            return (
              <div
                key={sale._id}
                className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/30"
              >
                <div className="space-y-3">
                  {/* Card Header: Amount and Payment badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                    <span className="text-xl font-extrabold text-emerald-400">
                      ₹{Number(sale.totalAmount || 0).toLocaleString("en-IN")}
                    </span>
                    {getPaymentBadge(sale.paymentMethod)}
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                      <FaUser className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white truncate">
                        {sale?.customerId?.name || "Walk-in Customer"}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {sale?.customerId?.phone || "No phone"}
                      </p>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center justify-between font-medium">
                      <span className="truncate max-w-[140px] text-white">
                        {firstItem?.productId?.name || "Custom Item"}
                      </span>
                      <span className="text-slate-400 font-mono">
                        x{firstItem?.quantity || 1}
                      </span>
                    </div>
                    {extraItems > 0 && (
                      <p className="text-[10px] text-indigo-400">
                        +{extraItems} more items in order
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <FaCalendarAlt className="w-3 h-3 text-slate-400" />
                    <span>
                      {sale.date
                        ? new Date(sale.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Today"}
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
                  <Link
                    to={`/sales/get/${sale._id}`}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-center text-slate-200 transition"
                  >
                    View Sale
                  </Link>
                  <Link
                    to={`/sales/update/${sale._id}`}
                    className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition"
                    title="Edit Sale"
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => setDeleteId(sale._id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete Sale"
                  >
                    <FaTrashAlt className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages || 1}
        onPageChange={(p) => setPage(p)}
        totalItems={pagination.total}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Sale Record"
        message="Are you sure you want to delete this sales transaction? This will permanently remove the record."
        confirmText="Yes, Delete"
        loading={deleting}
      />
    </div>
  );
};

// ======================== CREATE SALE (POS TERMINAL) ======================== //
const CreateSales = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [custRes, prodRes] = await Promise.all([
        getCustomer(1, 100),
        getProduct(1, 100),
      ]);
      setCustomers(custRes.data.data || []);
      setProducts(prodRes.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers or products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Auto-fill price and check stock when product changes
  const handleProductSelect = (selectedId) => {
    setProductId(selectedId);
    const prod = products.find((p) => String(p._id) === String(selectedId));
    if (prod) {
      setPrice(String(prod.price || ""));
    }
  };

  const selectedProduct = products.find(
    (p) => String(p._id) === String(productId)
  );

  const handleAddToCart = () => {
    if (!productId) {
      toast.error("Please select a product first");
      return;
    }
    const prod = products.find((p) => String(p._id) === String(productId));
    if (!prod) return;

    const qty = Number(quantity);
    if (!qty || qty < 1) {
      toast.error("Quantity must be at least 1 unit");
      return;
    }
    const unitPrice = Number(price);
    if (unitPrice < 0 || isNaN(unitPrice)) {
      toast.error("Please enter a valid price");
      return;
    }

    const existingIndex = cartItems.findIndex(
      (item) => String(item.productId) === String(productId)
    );
    const alreadyInCart = existingIndex > -1 ? cartItems[existingIndex].quantity : 0;
    const totalRequested = alreadyInCart + qty;

    if (totalRequested > prod.stock) {
      toast.error(
        `Insufficient stock! Only ${prod.stock} available (${alreadyInCart} already in cart)`
      );
      return;
    }

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity = totalRequested;
      updated[existingIndex].price = unitPrice;
      setCartItems(updated);
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: prod._id,
          name: prod.name,
          quantity: qty,
          price: unitPrice,
          stock: prod.stock,
        },
      ]);
    }

    toast.success(`Added ${prod.name} (x${qty}) to cart`);
    setProductId("");
    setQuantity("1");
    setPrice("");
  };

  const handleUpdateCartQty = (index, delta) => {
    setCartItems((prev) => {
      const copy = [...prev];
      const item = copy[index];
      const newQty = item.quantity + delta;
      if (newQty < 1) return prev;
      if (newQty > item.stock) {
        toast.error(`Only ${item.stock} units available in stock`);
        return prev;
      }
      item.quantity = newQty;
      return copy;
    });
  };

  const handleRemoveFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
    toast.success("Item removed from cart");
  };

  // Calculate bill total from cart, or single selected product if cart is empty
  const effectiveItems =
    cartItems.length > 0
      ? cartItems
      : productId && Number(quantity) > 0 && Number(price) >= 0
      ? [
          {
            productId,
            name: selectedProduct?.name || "Product",
            quantity: Number(quantity),
            price: Number(price),
          },
        ]
      : [];

  const totalAmount = effectiveItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!customerId) {
        return toast.error("Please select a customer");
      }

      let finalItems = [...cartItems];
      if (finalItems.length === 0) {
        if (!productId) {
          return toast.error("Please add at least one item to the order");
        }
        if (!quantity || Number(quantity) < 1) {
          return toast.error("Quantity must be at least 1 unit");
        }
        if (selectedProduct && Number(quantity) > Number(selectedProduct.stock)) {
          return toast.error(`Only ${selectedProduct.stock} units available in stock`);
        }
        if (price === "" || Number(price) < 0) {
          return toast.error("Price must be 0 or higher");
        }
        finalItems = [
          {
            productId,
            name: selectedProduct?.name || "Product",
            quantity: Number(quantity),
            price: Number(price),
          },
        ];
      }

      setSubmitting(true);

      const payload = {
        customerId,
        items: finalItems.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
        totalAmount,
        paymentMethod,
        date: date || new Date().toISOString(),
      };

      const res = await createSales(payload);
      toast.success("Sale processed successfully!");

      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const userId = storedUser?._id || localStorage.getItem("userId");

      if (userId && res.data?.data?._id) {
        try {
          const invRes = await createInvoice({
            orderId: res.data.data._id,
            userId: userId,
            items: finalItems.map((i) => ({
              productName: i.name || "Item",
              quantity: Number(i.quantity),
              price: Number(i.price),
            })),
            totalAmount: totalAmount,
            tax: 0,
          });

          if (invRes.data?.data?._id) {
            navigate(`/invoice/${invRes.data.data._id}`);
            return;
          }
        } catch (invErr) {
          console.warn("Invoice creation skipped or failed:", invErr);
        }
      }

      navigate("/sales");
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to create sales record");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading POS register data..." />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/sales")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Point of Sale (POS) Terminal
            </h1>
            <p className="text-xs text-slate-400">
              Select customer, add products to cart, and record retail payment.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Entry Form */}
        <form
          onSubmit={handleCreate}
          className="lg:col-span-2 glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-6"
        >
          {/* Customer Selection */}
          <div className="text-left">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Customer <span className="text-rose-400">*</span>
              </label>
              <Link
                to="/customer/create"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                + New Customer
              </Link>
            </div>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
              className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 text-slate-200 bg-slate-900"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.phone || "No phone"})
                </option>
              ))}
            </select>
          </div>

          {/* Product Entry Box */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Add Items To Cart
              </span>
              {selectedProduct && (
                <span className="text-xs text-slate-400">
                  Stock:{" "}
                  <strong
                    className={
                      selectedProduct.stock < 5
                        ? "text-rose-400 font-bold"
                        : "text-emerald-400 font-bold"
                    }
                  >
                    {selectedProduct.stock} units
                  </strong>
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Product
              </label>
              <select
                value={productId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 text-slate-200 bg-slate-900"
              >
                <option value="">-- Choose Product to add --</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — ₹{p.price} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />

              <Input
                label="Unit Price (₹)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition active:scale-95"
              >
                <FaPlus className="w-3 h-3" />
                <span>+ Add Item to Order</span>
              </button>
            </div>
          </div>

          {/* Multi-Item Cart Table */}
          {cartItems.length > 0 && (
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Order Items ({cartItems.length})
              </label>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3">Subtotal</th>
                      <th className="py-2.5 px-3 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {cartItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-2.5 px-3 font-semibold text-white">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          ₹{item.price}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(idx, -1)}
                              className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                            >
                              <FaMinus className="w-2.5 h-2.5" />
                            </button>
                            <span className="font-mono font-bold text-white w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(idx, 1)}
                              className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                            >
                              <FaPlus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-400">
                          ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(idx)}
                            className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition"
                          >
                            <FaTrashAlt className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Payment Method <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "Cash", icon: <FaMoneyBillWave className="w-4 h-4" /> },
                { id: "UPI", icon: <FaMobileAlt className="w-4 h-4" /> },
                { id: "Card", icon: <FaCreditCard className="w-4 h-4" /> },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold border transition ${
                    paymentMethod === m.id
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {m.icon}
                  <span>{m.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <Input
            label="Transaction Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/sales")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              icon={<FaShoppingCart className="w-3.5 h-3.5" />}
            >
              Complete Sale & Print
            </Button>
          </div>
        </form>

        {/* Live Bill Receipt Preview */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bill Summary
              </span>
              <span className="text-xs font-mono text-indigo-400">Preview</span>
            </div>

            <div className="py-4 space-y-3 text-xs">
              {effectiveItems.length === 0 ? (
                <p className="text-slate-500 italic py-4">No items added yet</p>
              ) : (
                effectiveItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span className="truncate max-w-[140px]">
                      {item.name} <span className="text-slate-500">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-white">
                      ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))
              )}

              <div className="pt-2 border-t border-slate-800/60 flex justify-between text-slate-400">
                <span>Payment Mode</span>
                <span className="text-slate-200 font-semibold">{paymentMethod}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Grand Total:</span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
            💡 Completing this sale will record revenue, auto-decrement inventory stock, and generate an invoice.
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================== GET SALES BY ID ======================== //
const GetSalesById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchSale = async () => {
    try {
      setLoading(true);
      const res = await getSalesById(id);
      setSale(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sale details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSale();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteSalesById(id);
      toast.success("Sales record removed");
      navigate("/sales");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete sales record");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading sale transaction..." />;
  }

  if (!sale) {
    return (
      <EmptyState
        title="Sale Record Not Found"
        description="This transaction does not exist or was deleted."
        actionText="Back to Sales"
        onAction={() => navigate("/sales")}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/sales")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Sale Transaction
            </h1>
            <p className="text-xs text-slate-400 font-mono">ID: {sale._id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/sales/update/${sale._id}`)}
            icon={<FaEdit className="w-3.5 h-3.5" />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowDelete(true)}
            icon={<FaTrashAlt className="w-3.5 h-3.5" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Sale Details Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Amount
            </span>
            <h2 className="text-4xl font-extrabold text-emerald-400 mt-1">
              ₹{Number(sale.totalAmount || 0).toLocaleString("en-IN")}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-200 border border-slate-700">
              Payment: {sale.paymentMethod}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(sale.date || sale.createdAt).toLocaleDateString("en-IN")}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div>
            <p className="text-xs text-slate-400 font-medium">Customer</p>
            <p className="text-base font-bold text-white mt-1">
              {sale?.customerId?.name || "Walk-in Customer"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Contact Phone</p>
            <p className="text-sm font-mono text-slate-200 mt-1">
              {sale?.customerId?.phone || "N/A"}
            </p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
            Items in Order
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sale?.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-white">
                      {item?.productId?.name || "Product"}
                    </td>
                    <td className="p-3 text-center font-mono">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-right font-mono">
                      ₹{item.price}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-400 font-mono">
                      ₹{item.quantity * item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Sale Transaction"
        message="Are you sure you want to delete this sale record? It cannot be recovered."
        confirmText="Yes, Delete"
        loading={deleting}
      />
    </div>
  );
};

// ======================== UPDATE SALES BY ID ======================== //
const UpdateSalesById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSaleData = async () => {
    try {
      setLoading(true);
      const [saleRes, custRes, prodRes] = await Promise.all([
        getSalesById(id),
        getCustomer(1, 100),
        getProduct(1, 100),
      ]);

      const sale = saleRes.data.data;
      if (sale) {
        setCustomerId(sale.customerId?._id || sale.customerId || "");
        const item = sale.items?.[0];
        if (item) {
          setProductId(item.productId?._id || item.productId || "");
          setQuantity(String(item.quantity || "1"));
          setPrice(String(item.price || "0"));
        }
        setPaymentMethod(sale.paymentMethod || "Cash");
        if (sale.date) {
          setDate(new Date(sale.date).toISOString().split("T")[0]);
        }
      }

      setCustomers(custRes.data.data || []);
      setProducts(prodRes.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sale details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleData();
  }, [id]);

  const totalAmount =
    Number(quantity || 0) * Number(price || 0);

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!customerId) {
        return toast.error("Please select a customer");
      }
      if (!productId) {
        return toast.error("Please select a product");
      }
      if (!quantity || Number(quantity) < 1) {
        return toast.error("Quantity must be at least 1 unit");
      }
      if (price === "" || Number(price) < 0) {
        return toast.error("Price must be 0 or higher");
      }

      setSaving(true);
      const payload = {
        customerId,
        items: [
          {
            productId,
            quantity: Number(quantity),
            price: Number(price),
          },
        ],
        totalAmount,
        paymentMethod,
        date: date || new Date().toISOString(),
      };

      await updateSalesById(id, payload);
      toast.success("Sale updated successfully");
      navigate(`/sales/get/${id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to update sale");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading sale transaction..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={() => navigate(`/sales/get/${id}`)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Edit Sales Transaction
          </h1>
          <p className="text-xs text-slate-400 font-mono">ID: {id}</p>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-5"
      >
        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Customer
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 text-slate-200 bg-slate-900"
          >
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Product
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 text-slate-200 bg-slate-900"
          >
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
          />

          <Input
            label="Price (₹)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Payment Mode
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 text-slate-200 bg-slate-900"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="p-3 rounded-xl bg-slate-950 flex items-center justify-between border border-slate-800">
          <span className="text-xs text-slate-400">Total Calculated:</span>
          <span className="text-xl font-bold text-emerald-400">
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => navigate(`/sales/get/${id}`)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

// ======================== DELETE SALES BY ID (Fallback Route) ======================== //
const DeleteSalesById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchSale = async () => {
    try {
      setLoading(true);
      const res = await getSalesById(id);
      setSale(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sale");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSale();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteSalesById(id);
      toast.success("Sales record deleted successfully");
      navigate("/sales");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete sales record");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading sale transaction..." />;
  }

  if (!sale) {
    return (
      <EmptyState
        title="Sale Record Not Found"
        description="This sale transaction was deleted or does not exist."
        actionText="Back to Sales"
        onAction={() => navigate("/sales")}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto pt-10">
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-rose-500/30 bg-slate-900/80 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <FaTrashAlt className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Delete Sale #{sale._id.slice(-6)}?
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Are you sure you want to delete this sales transaction of ₹
            {sale.totalAmount}?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/sales")}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={handleDelete}
            loading={deleting}
          >
            Delete Sale
          </Button>
        </div>
      </div>
    </div>
  );
};

export {
  SalesDashboard,
  CreateSales,
  GetAllSales,
  GetSalesById,
  UpdateSalesById,
  DeleteSalesById,
};
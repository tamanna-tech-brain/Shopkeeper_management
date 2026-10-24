import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createExpense,
  getExpenses,
  getExpensesById,
  updateExpensesById,
  deleteExpenseById,
} from "../apis/api.js";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import StatusBadge from "../ui/StatusBadge";
import {
  FaReceipt,
  FaPlus,
  FaCalendarAlt,
  FaTag,
  FaEdit,
  FaTrashAlt,
  FaArrowLeft,
  FaMoneyBillWave,
  FaEye,
  FaDownload,
} from "react-icons/fa";

// ======================== EXPENSE DASHBOARD ======================== //
const ExpenseDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Store Expense Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track utility bills, staff payroll, rent, and miscellaneous retail expenditures.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/expense/create")}
          icon={<FaPlus className="w-3.5 h-3.5" />}
        >
          Record Expense
        </Button>
      </div>

      <GetAllExpense />
    </div>
  );
};

// ======================== GET ALL EXPENSES ======================== //
const GetAllExpense = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 8;

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpenses(page, limit, search);
      const fetched = Array.isArray(res.data.data) ? res.data.data : [];
      setExpenses(fetched);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error(error);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, search]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteExpenseById(deleteId);
      toast.success("Expense record removed");
      setDeleteId(null);
      fetchExpenses();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    } finally {
      setDeleting(false);
    }
  };

  const totalSum = expenses.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0
  );

  const getCategoryBadge = (cat) => {
    switch (cat?.toLowerCase()) {
      case "rent":
        return <StatusBadge status={cat} variant="purple" />;
      case "salary":
      case "salaries":
        return <StatusBadge status={cat} variant="info" />;
      case "electricity":
      case "utilities":
        return <StatusBadge status={cat} variant="warning" />;
      case "supplies":
      case "inventory":
        return <StatusBadge status={cat} variant="primary" />;
      default:
        return <StatusBadge status={cat || "General"} variant="default" />;
    }
  };

  const handleExportCSV = () => {
    if (!expenses || !expenses.length) {
      toast.error("No expense records to export");
      return;
    }
    const headers = ["Date", "Title", "Category", "Amount (INR)", "Description"];
    const rows = expenses.map((e) => [
      e.date ? new Date(e.date).toLocaleDateString("en-IN") : "N/A",
      e.title || "Expense",
      e.category || "General",
      e.amount || 0,
      e.description || "",
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
      `expenses_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${expenses.length} expenses to CSV!`);
  };

  return (
    <div className="space-y-6">
      {/* Mini Summary & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2 p-4 rounded-2xl glass-card border border-slate-800 bg-slate-900/60 flex items-center">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by title, category, or note..."
            className="w-full"
          />
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Page Total
            </span>
            <p className="text-2xl font-extrabold text-rose-400 mt-0.5">
              ₹{totalSum.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <FaReceipt className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 bg-slate-900/60 flex items-center justify-center">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            icon={<FaDownload className="w-3.5 h-3.5" />}
            className="w-full text-xs"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading expense ledger..." />
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={<FaReceipt className="w-8 h-8 opacity-80" />}
          title="No Expenses Logged"
          description={
            search
              ? "No expenses matched your search."
              : "No expenditures have been recorded yet. Track your first expense."
          }
          actionText={search ? "Clear Search" : "+ Record Expense"}
          onAction={() => {
            if (search) setSearch("");
            else navigate("/expense/create");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {expenses.map((exp) => (
            <div
              key={exp._id}
              className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/30"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                  <span className="text-xl font-extrabold text-rose-400">
                    ₹{Number(exp.amount || 0).toLocaleString("en-IN")}
                  </span>
                  {getCategoryBadge(exp.category)}
                </div>

                <div className="mt-3 space-y-2">
                  <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
                    {exp.title}
                  </h3>

                  {exp.receiptImage && (
                    <div className="pt-1">
                      <a
                        href={exp.receiptImage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:text-white"
                      >
                        <FaImage className="w-3 h-3" />
                        <span>View Attached Bill</span>
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <FaCalendarAlt className="w-3 h-3 text-slate-400" />
                    <span>
                      {exp.date
                        ? new Date(exp.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Today"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <Link
                  to={`/expense/get/${exp._id}`}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-center text-slate-200 transition"
                >
                  Details
                </Link>
                <Link
                  to={`/expense/update/${exp._id}`}
                  className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition"
                  title="Edit Expense"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setDeleteId(exp._id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                  title="Delete Expense"
                >
                  <FaTrashAlt className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
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
        title="Delete Expense Entry"
        message="Are you sure you want to remove this expense record from the ledger?"
        confirmText="Yes, Delete"
        loading={deleting}
      />
    </div>
  );
};

// ======================== CREATE EXPENSE ======================== //
const CreateExpense = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Utilities");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const titleRef = useRef();

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const categories = [
    "Rent",
    "Utilities",
    "Salaries",
    "Inventory & Stock",
    "Maintenance",
    "Marketing",
    "Transportation",
    "Packaging",
    "Other",
  ];

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!title || amount === "" || !category) {
        return toast.error("Please fill all required fields");
      }

      if (title.trim().length < 4 || title.trim().length > 60) {
        return toast.error("Expense title must be between 4 and 60 characters");
      }

      if (Number(amount) < 0) {
        return toast.error("Amount must be greater than or equal to 0");
      }

      if (category.trim().length < 3 || category.trim().length > 60) {
        return toast.error("Category must be between 3 and 60 characters");
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("amount", Number(amount));
      formData.append("category", category.trim());
      formData.append("date", date || new Date().toISOString());
      if (receiptFile) {
        formData.append("receiptImage", receiptFile);
      }

      await createExpense(formData);

      toast.success("Expense logged successfully!");
      navigate("/expense");
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={() => navigate("/expense")}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Record New Store Expense
          </h1>
          <p className="text-xs text-slate-400">
            Log financial outlays for accurate profit and loss tracking.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleCreate}
        className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-5"
      >
        <Input
          ref={titleRef}
          label="Expense Title / Description"
          placeholder="e.g. Electricity Bill October, Store Cleaning Supplies"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount (₹)"
            type="number"
            placeholder="e.g. 2400"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
          />

          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 text-slate-200 bg-slate-900"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Expense Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Bill / Receipt Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
          />
          {receiptPreview && (
            <div className="mt-2.5 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 shadow-md">
              <img src={receiptPreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => navigate("/expense")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={<FaPlus className="w-3 h-3" />}
          >
            Save Expense
          </Button>
        </div>
      </form>
    </div>
  );
};

// ======================== GET EXPENSES BY ID ======================== //
const GetExpensesById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const res = await getExpensesById(id);
      setExpense(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load expense");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteExpenseById(id);
      toast.success("Expense removed");
      navigate("/expense");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading expense record..." />;
  }

  if (!expense) {
    return (
      <EmptyState
        title="Expense Not Found"
        description="This expense entry does not exist or has been removed."
        actionText="Back to Expenses"
        onAction={() => navigate("/expense")}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/expense")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Expense Record
            </h1>
            <p className="text-xs text-slate-400 font-mono">ID: {expense._id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/expense/update/${expense._id}`)}
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

      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Amount Spent
            </span>
            <h2 className="text-4xl font-extrabold text-rose-400 mt-1">
              ₹{Number(expense.amount || 0).toLocaleString("en-IN")}
            </h2>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-200 border border-slate-700">
            {expense.category || "General"}
          </span>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-xs text-slate-400">Description / Title</p>
            <p className="text-base font-bold text-white mt-1">
              {expense.title}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Date Logged</span>
            <span className="text-sm font-semibold text-slate-200">
              {new Date(expense.date || expense.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message={`Are you sure you want to remove the expense "${expense.title}"?`}
        confirmText="Yes, Delete"
        loading={deleting}
      />
    </div>
  );
};

// ======================== UPDATE EXPENSE ======================== //
const UpdateExpenseById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const res = await getExpensesById(id);
      const exp = res.data.data;
      if (exp) {
        setTitle(exp.title || "");
        setAmount(String(exp.amount || ""));
        setCategory(exp.category || "");
        if (exp.date) {
          setDate(new Date(exp.date).toISOString().split("T")[0]);
        }
        if (exp.receiptImage) {
          setReceiptPreview(exp.receiptImage);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load expense");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const categories = [
    "Rent",
    "Utilities",
    "Salaries",
    "Inventory & Stock",
    "Maintenance",
    "Marketing",
    "Transportation",
    "Packaging",
    "Other",
  ];

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!title || amount === "" || !category) {
        return toast.error("Please fill all required fields");
      }

      if (title.trim().length < 4 || title.trim().length > 60) {
        return toast.error("Expense title must be between 4 and 60 characters");
      }

      if (Number(amount) < 0) {
        return toast.error("Amount must be greater than or equal to 0");
      }

      if (category.trim().length < 3 || category.trim().length > 60) {
        return toast.error("Category must be between 3 and 60 characters");
      }

      setSaving(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("amount", Number(amount));
      formData.append("category", category.trim());
      formData.append("date", date || new Date().toISOString());
      if (receiptFile) {
        formData.append("receiptImage", receiptFile);
      }

      await updateExpensesById(id, formData);
      toast.success("Expense updated successfully");
      navigate(`/expense/get/${id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to update expense");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading expense record..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={() => navigate(`/expense/get/${id}`)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Update Expense Entry
          </h1>
          <p className="text-xs text-slate-400 font-mono">ID: {id}</p>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-5"
      >
        <Input
          label="Title / Description"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
          />

          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 text-slate-200 bg-slate-900"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Bill / Receipt Image
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
          />
          {receiptPreview && (
            <div className="mt-2.5 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 shadow-md">
              <img src={receiptPreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => navigate(`/expense/get/${id}`)}
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

// ======================== DELETE EXPENSE (Fallback Route) ======================== //
const DeleteExpenseById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const res = await getExpensesById(id);
      setExpense(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load expense");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteExpenseById(id);
      toast.success("Expense record deleted");
      navigate("/expense");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading expense record..." />;
  }

  if (!expense) {
    return (
      <EmptyState
        title="Expense Not Found"
        description="This expense record does not exist or has been removed."
        actionText="Back to Expenses"
        onAction={() => navigate("/expense")}
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
            Delete "{expense.title}"?
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Are you sure you want to remove this expense of ₹{expense.amount}?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/expense")}
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
            Delete Expense
          </Button>
        </div>
      </div>
    </div>
  );
};

export {
  ExpenseDashboard,
  CreateExpense,
  GetAllExpense,
  GetExpensesById,
  UpdateExpenseById,
  DeleteExpenseById,
};
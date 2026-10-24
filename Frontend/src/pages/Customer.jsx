import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createCustomer,
  getCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} from "../apis/api";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import {
  FaUsers,
  FaPlus,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaArrowLeft,
  FaCopy,
} from "react-icons/fa";

// ======================== CUSTOMER DASHBOARD ======================== //
const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Directory (CRM)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain client records, phone numbers, and delivery addresses.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/customer/create")}
          icon={<FaPlus className="w-3.5 h-3.5" />}
        >
          Add Customer
        </Button>
      </div>

      <GetAllCustomer />
    </div>
  );
};

// ======================== GET ALL CUSTOMERS ======================== //
const GetAllCustomer = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 8;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomer(page, limit, search);
      const fetched = Array.isArray(res.data.data) ? res.data.data : [];
      setCustomers(fetched);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customer directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteCustomerById(deleteId);
      toast.success("Customer removed successfully");
      setDeleteId(null);
      fetchCustomers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-6">
      {/* Search Toolbar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by customer name, phone number, address..."
          className="flex-1"
        />
      </div>

      {loading ? (
        <Loader text="Loading customer records..." />
      ) : customers.length === 0 ? (
        <EmptyState
          icon={<FaUsers className="w-8 h-8 opacity-80" />}
          title="No Customers Found"
          description={
            search
              ? "No customer matches your search."
              : "No customers have been registered yet. Add your first customer."
          }
          actionText={search ? "Clear Search" : "+ Add Customer"}
          onAction={() => {
            if (search) setSearch("");
            else navigate("/customer/create");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {customers.map((c) => (
            <div
              key={c._id}
              className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/30"
            >
              <div>
                {/* Header: Avatar and Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-md">
                    {c.name ? c.name[0].toUpperCase() : "C"}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-base font-bold text-white tracking-tight truncate">
                      {c.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      ID: {c._id.slice(-6)}
                    </p>
                  </div>
                </div>

                {/* Contact details */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="flex items-center gap-2 font-mono">
                      <FaPhoneAlt className="w-3 h-3 text-slate-400" />
                      <span>{c.phone || "No phone"}</span>
                    </div>
                    {c.phone && (
                      <button
                        onClick={() => copyToClipboard(c.phone, "Phone")}
                        className="text-slate-400 hover:text-indigo-400 p-1"
                        title="Copy Phone"
                      >
                        <FaCopy className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-950/50 border border-slate-800">
                    <FaMapMarkerAlt className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-[11px] text-slate-300">
                      {c.address || "No address provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <Link
                  to={`/customer/get/${c._id}`}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-center text-slate-200 transition"
                >
                  Profile
                </Link>
                <Link
                  to={`/customer/update/${c._id}`}
                  className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition"
                  title="Edit Customer"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setDeleteId(c._id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                  title="Delete Customer"
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
        title="Delete Customer Record"
        message="Are you sure you want to delete this customer? This may affect historical invoices and transaction references."
        confirmText="Yes, Delete"
        loading={deleting}
      />
    </div>
  );
};

// ======================== CREATE CUSTOMER ======================== //
const CreateCustomer = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef = useRef();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!name || !phone || !address) {
        return toast.error("Please fill in all customer fields");
      }

      if (name.trim().length < 4 || name.trim().length > 60) {
        return toast.error("Customer name must be between 4 and 60 characters");
      }

      // Sanitize phone to exactly 10 digits
      let cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
        cleanPhone = cleanPhone.slice(2);
      }

      if (!/^[0-9]{10}$/.test(cleanPhone)) {
        return toast.error("Phone number must be exactly 10 digits (e.g. 9876543210)");
      }

      if (address.trim().length < 4 || address.trim().length > 60) {
        return toast.error("Address must be between 4 and 60 characters");
      }

      setLoading(true);

      await createCustomer({
        name: name.trim(),
        phone: cleanPhone,
        address: address.trim(),
      });

      toast.success("Customer registered successfully!");
      navigate("/customer");
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={() => navigate("/customer")}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Add New Customer
          </h1>
          <p className="text-xs text-slate-400">
            Save client details for billing and delivery.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-5"
      >
        <Input
          ref={nameRef}
          label="Customer Full Name (4-60 chars)"
          placeholder="e.g. Rahul Sharma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Phone Number (10 Digits)"
          type="tel"
          placeholder="e.g. 9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Address / Location <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows="3"
            placeholder="e.g. Shop 4B, MG Road Market, New Delhi"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => navigate("/customer")}
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
            Save Customer
          </Button>
        </div>
      </form>
    </div>
  );
};

// ======================== GET CUSTOMER BY ID ======================== //
const GetCustomerById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await getCustomerById(id);
      setCustomer(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customer profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCustomerById(id);
      toast.success("Customer removed");
      navigate("/customer");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading customer profile..." />;
  }

  if (!customer) {
    return (
      <EmptyState
        title="Customer Not Found"
        description="This customer record does not exist or has been deleted."
        actionText="Back to Directory"
        onAction={() => navigate("/customer")}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/customer")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Customer Profile
            </h1>
            <p className="text-xs text-slate-400 font-mono">ID: {customer._id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/customer/update/${customer._id}`)}
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
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {customer.name ? customer.name[0].toUpperCase() : "C"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Registered Client
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Phone Contact</p>
              <p className="text-base font-mono font-bold text-white mt-1">
                {customer.phone}
              </p>
            </div>
            <a
              href={`tel:${customer.phone}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition"
            >
              Call Customer
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-xs text-slate-400">Postal / Delivery Address</p>
            <p className="text-sm text-slate-200 mt-1 leading-relaxed">
              {customer.address}
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to remove "${customer.name}"?`}
        confirmText="Yes, Delete"
        loading={deleting}
      />
    </div>
  );
};

// ======================== UPDATE CUSTOMER ======================== //
const UpdateCustomerById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await getCustomerById(id);
      const data = res.data.data;
      if (data) {
        setName(data.name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!name || !phone || !address) {
        return toast.error("Please fill in all customer fields");
      }

      if (name.trim().length < 4 || name.trim().length > 60) {
        return toast.error("Customer name must be between 4 and 60 characters");
      }

      let cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
        cleanPhone = cleanPhone.slice(2);
      }

      if (!/^[0-9]{10}$/.test(cleanPhone)) {
        return toast.error("Phone number must be exactly 10 digits (e.g. 9876543210)");
      }

      if (address.trim().length < 4 || address.trim().length > 60) {
        return toast.error("Address must be between 4 and 60 characters");
      }

      setSaving(true);
      await updateCustomerById(id, {
        name: name.trim(),
        phone: cleanPhone,
        address: address.trim(),
      });
      toast.success("Customer updated successfully");
      navigate(`/customer/get/${id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to update customer");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading customer details..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={() => navigate(`/customer/get/${id}`)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Update Customer
          </h1>
          <p className="text-xs text-slate-400 font-mono">ID: {id}</p>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-5"
      >
        <Input
          label="Full Name (4-60 chars)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Phone Number (10 Digits)"
          type="tel"
          placeholder="e.g. 9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Address
          </label>
          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => navigate(`/customer/get/${id}`)}
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

// ======================== DELETE CUSTOMER (Fallback Route) ======================== //
const DeleteCustomerById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await getCustomerById(id);
      setCustomer(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCustomerById(id);
      toast.success("Customer removed successfully");
      navigate("/customer");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading customer details..." />;
  }

  if (!customer) {
    return (
      <EmptyState
        title="Customer Not Found"
        description="This customer does not exist or has already been removed."
        actionText="Back to Customers"
        onAction={() => navigate("/customer")}
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
            Delete "{customer.name}"?
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Are you sure you want to remove this customer record?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/customer")}
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
            Delete Customer
          </Button>
        </div>
      </div>
    </div>
  );
};

export {
  CustomerDashboard,
  CreateCustomer,
  GetAllCustomer,
  GetCustomerById,
  UpdateCustomerById,
  DeleteCustomerById,
};
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createSupplier,
  getSupplier,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
} from "../apis/api.js";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import {
  FaTruckLoading,
  FaPlus,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEdit,
  FaTrashAlt,
  FaArrowLeft,
  FaCopy,
} from "react-icons/fa";

// ======================== SUPPLIER DASHBOARD ======================== //
const SupplierDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Supplier & Vendor Directory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your distributor relationships, procurement contacts, and vendor addresses.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/supplier/create")}
          icon={<FaPlus className="w-3.5 h-3.5" />}
        >
          Add Supplier
        </Button>
      </div>

      <GetAllSupplier />
    </div>
  );
};

// ======================== GET ALL SUPPLIERS ======================== //
const GetAllSupplier = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 8;

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await getSupplier(page, limit, search);
      const fetched = Array.isArray(res.data.data) ? res.data.data : [];
      setSuppliers(fetched);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error(error);
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, search]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteSupplierById(deleteId);
      toast.success("Supplier removed successfully");
      setDeleteId(null);
      fetchSuppliers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete supplier");
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
          placeholder="Search by vendor name, phone, address..."
          className="flex-1"
        />
      </div>

      {loading ? (
        <Loader text="Loading suppliers..." />
      ) : suppliers.length === 0 ? (
        <EmptyState
          icon={<FaTruckLoading className="w-8 h-8 opacity-80" />}
          title="No Suppliers Found"
          description={
            search
              ? "No supplier matches your search query."
              : "No vendor sources recorded yet. Register your first supplier."
          }
          actionText={search ? "Clear Search" : "+ Add Supplier"}
          onAction={() => {
            if (search) setSearch("");
            else navigate("/supplier/create");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {suppliers.map((s) => (
            <div
              key={s._id}
              className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/30"
            >
              <div>
                {/* Header: Avatar and Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                    {s.image ? (
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      s.name ? s.name[0].toUpperCase() : "S"
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-base font-bold text-white tracking-tight truncate">
                      {s.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Vendor ID: {s._id.slice(-6)}
                    </p>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="flex items-center gap-2 font-mono">
                      <FaPhoneAlt className="w-3 h-3 text-slate-400" />
                      <span>{s.phone || "No phone"}</span>
                    </div>
                    {s.phone && (
                      <button
                        onClick={() => copyToClipboard(s.phone, "Phone")}
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
                      {s.address || "No address provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <Link
                  to={`/supplier/get/${s._id}`}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-center text-slate-200 transition"
                >
                  Details
                </Link>
                <Link
                  to={`/supplier/update/${s._id}`}
                  className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition"
                  title="Edit Supplier"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setDeleteId(s._id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                  title="Delete Supplier"
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
        title="Delete Supplier"
        message="Are you sure you want to remove this supplier? Linked products will keep historical references."
        confirmText="Yes, Delete"
        loading={deleting}
      />
    </div>
  );
};

// ======================== CREATE SUPPLIER ======================== //
const CreateSupplier = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const nameRef = useRef();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!name || !phone || !address) {
        return toast.error("Please fill in all details");
      }

      if (name.trim().length < 4 || name.trim().length > 60) {
        return toast.error("Supplier name must be between 4 and 60 characters");
      }

      let cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
        cleanPhone = cleanPhone.slice(2);
      }

      if (!/^[0-9]{10}$/.test(cleanPhone)) {
        return toast.error("Phone number must be exactly 10 digits (e.g. 9988776655)");
      }

      if (address.trim().length < 4 || address.trim().length > 60) {
        return toast.error("Address must be between 4 and 60 characters");
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phone", cleanPhone);
      formData.append("address", address.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createSupplier(formData);

      toast.success("Supplier registered successfully!");
      navigate("/supplier");
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to add supplier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={() => navigate("/supplier")}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Add New Supplier / Vendor
          </h1>
          <p className="text-xs text-slate-400">
            Save vendor contact for restocking inventory.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-5"
      >
        <Input
          ref={nameRef}
          label="Vendor / Company Name (4-60 chars)"
          placeholder="e.g. Apex Wholesale Distro Ltd"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Phone Number (10 Digits)"
          type="tel"
          placeholder="e.g. 9988776655"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Warehouse / Supply Address <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows="3"
            placeholder="e.g. Plot 12, Industrial Area, Sector 5"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 focus:border-indigo-500"
          />
        </div>

        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Vendor Logo / Contract Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
          />
          {imagePreview && (
            <div className="mt-2.5 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 shadow-md">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => navigate("/supplier")}
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
            Save Supplier
          </Button>
        </div>
      </form>
    </div>
  );
};

// ======================== GET SUPPLIER BY ID ======================== //
const GetSupplierById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const res = await getSupplierById(id);
      setSupplier(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load supplier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteSupplierById(id);
      toast.success("Supplier removed");
      navigate("/supplier");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete supplier");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading supplier details..." />;
  }

  if (!supplier) {
    return (
      <EmptyState
        title="Supplier Not Found"
        description="This supplier does not exist or has been deleted."
        actionText="Back to Suppliers"
        onAction={() => navigate("/supplier")}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/supplier")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Supplier Details
            </h1>
            <p className="text-xs text-slate-400 font-mono">ID: {supplier._id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/supplier/update/${supplier._id}`)}
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {supplier.name ? supplier.name[0].toUpperCase() : "S"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{supplier.name}</h2>
            <p className="text-xs text-slate-400 mt-1">Verified Vendor Source</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Contact Number</p>
              <p className="text-base font-mono font-bold text-white mt-1">
                {supplier.phone}
              </p>
            </div>
            <a
              href={`tel:${supplier.phone}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition"
            >
              Call Vendor
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-xs text-slate-400">Warehouse Address</p>
            <p className="text-sm text-slate-200 mt-1 leading-relaxed">
              {supplier.address}
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message={`Are you sure you want to remove "${supplier.name}"?`}
        confirmText="Yes, Delete"
        loading={deleting}
      />
    </div>
  );
};

// ======================== UPDATE SUPPLIER ======================== //
const UpdateSupplierById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const res = await getSupplierById(id);
      const data = res.data.data;
      if (data) {
        setName(data.name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        if (data.image) {
          setImagePreview(data.image);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load supplier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!name || !phone || !address) {
        return toast.error("Please fill in all details");
      }

      if (name.trim().length < 4 || name.trim().length > 60) {
        return toast.error("Supplier name must be between 4 and 60 characters");
      }

      let cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
        cleanPhone = cleanPhone.slice(2);
      }

      if (!/^[0-9]{10}$/.test(cleanPhone)) {
        return toast.error("Phone number must be exactly 10 digits (e.g. 9988776655)");
      }

      if (address.trim().length < 4 || address.trim().length > 60) {
        return toast.error("Address must be between 4 and 60 characters");
      }

      setSaving(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phone", cleanPhone);
      formData.append("address", address.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await updateSupplierById(id, formData);
      toast.success("Supplier updated successfully");
      navigate(`/supplier/get/${id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to update supplier");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading supplier details..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={() => navigate(`/supplier/get/${id}`)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Update Supplier
          </h1>
          <p className="text-xs text-slate-400 font-mono">ID: {id}</p>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-5"
      >
        <Input
          label="Vendor / Company Name (4-60 chars)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Phone Number (10 Digits)"
          type="tel"
          placeholder="e.g. 9988776655"
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

        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Vendor Logo / Contract Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
          />
          {imagePreview && (
            <div className="mt-2.5 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 shadow-md">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => navigate(`/supplier/get/${id}`)}
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

// ======================== DELETE SUPPLIER (Fallback Route) ======================== //
const DeleteSupplierById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const res = await getSupplierById(id);
      setSupplier(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load supplier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteSupplierById(id);
      toast.success("Supplier deleted successfully");
      navigate("/supplier");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete supplier");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading supplier details..." />;
  }

  if (!supplier) {
    return (
      <EmptyState
        title="Supplier Not Found"
        description="This supplier does not exist or has been removed."
        actionText="Back to Suppliers"
        onAction={() => navigate("/supplier")}
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
            Delete "{supplier.name}"?
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Are you sure you want to remove this vendor from your supplier registry?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/supplier")}
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
            Delete Supplier
          </Button>
        </div>
      </div>
    </div>
  );
};

export {
  SupplierDashboard,
  CreateSupplier,
  GetAllSupplier,
  GetSupplierById,
  UpdateSupplierById,
  DeleteSupplierById,
};
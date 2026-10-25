import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getComplaints,
  createComplaint,
  resolveComplaint,
  deleteComplaint,
} from "../apis/api.js";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import {
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaSearch,
  FaFilter,
  FaImage,
  FaTrashAlt,
  FaEye,
  FaHandsHelping,
  FaUserShield,
  FaPhoneAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resolveTarget, setResolveTarget] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Create form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Customer");
  const [partyName, setPartyName] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Resolve form state
  const [resolveStatus, setResolveStatus] = useState("Resolved");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolving, setResolving] = useState(false);

  const fetchComplaintsData = async () => {
    try {
      setLoading(true);
      const res = await getComplaints(page, 8, search, statusFilter, typeFilter);
      setComplaints(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error("Failed to load complaints:", error);
      toast.error("Could not load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintsData();
  }, [page, search, statusFilter, typeFilter]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      return toast.error("Please enter complaint title and description");
    }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("partyName", partyName || "Anonymous / Walk-in");
      formData.append("contact", contact);
      formData.append("description", description);
      formData.append("priority", priority);
      if (evidenceFile) {
        formData.append("evidenceImage", evidenceFile);
      }

      await createComplaint(formData);
      toast.success("Complaint / Welfare case logged successfully!");
      setIsCreateOpen(false);
      resetCreateForm();
      fetchComplaintsData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit grievance");
    } finally {
      setSubmitting(false);
    }
  };

  const resetCreateForm = () => {
    setTitle("");
    setType("Customer");
    setPartyName("");
    setContact("");
    setDescription("");
    setPriority("Medium");
    setEvidenceFile(null);
    setFilePreview(null);
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!resolveTarget) return;
    try {
      setResolving(true);
      await resolveComplaint(resolveTarget._id, {
        status: resolveStatus,
        resolutionNotes,
      });
      toast.success(`Complaint marked as ${resolveStatus}`);
      setResolveTarget(null);
      setResolutionNotes("");
      fetchComplaintsData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update resolution status");
    } finally {
      setResolving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteComplaint(deleteTargetId);
      toast.success("Complaint record deleted");
      setDeleteTargetId(null);
      fetchComplaintsData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete record");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
            <FaCheckCircle className="w-3 h-3" /> Resolved
          </span>
        );
      case "In Review":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 inline-flex items-center gap-1.5">
            <FaClock className="w-3 h-3" /> In Review
          </span>
        );
      case "Rejected":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5">
            <FaTimes className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1.5">
            <FaExclamationCircle className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">Critical</span>;
      case "High":
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800">High</span>;
      case "Medium":
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">Medium</span>;
      default:
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Low</span>;
    }
  };

  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FaHandsHelping className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customer & Supplier Welfare / Grievance Resolution
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Track user feedback, vendor issues, return requests, staff welfare, and rapid resolution with document/image evidence.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateOpen(true)}
          icon={<FaPlus className="w-3.5 h-3.5" />}
        >
          File New Grievance
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
          <p className="text-xs text-slate-400 font-medium">Total Tickets</p>
          <p className="text-2xl font-extrabold text-white mt-1">{pagination.total ?? complaints.length}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <p className="text-xs text-amber-300 font-medium">Pending Review</p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{pendingCount}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-xs text-emerald-300 font-medium">Resolved Cases</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{resolvedCount}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
          <p className="text-xs text-indigo-300 font-medium">SLA Resolution Rate</p>
          <p className="text-2xl font-extrabold text-indigo-400 mt-1">
            {complaints.length > 0
              ? `${Math.round((resolvedCount / complaints.length) * 100)}%`
              : "100%"}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/70 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search grievance by title, party name, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold glass-input border border-slate-800 text-slate-200 bg-slate-900 focus:border-indigo-500"
          >
            <option value="all">All Grievance Types</option>
            <option value="Customer">Customer</option>
            <option value="Supplier">Supplier / Vendor</option>
            <option value="Staff Welfare">Staff Welfare</option>
            <option value="Product Quality">Product Quality</option>
            <option value="Store Operations">Store Operations</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold glass-input border border-slate-800 text-slate-200 bg-slate-900 focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : complaints.length === 0 ? (
        <div className="glass-card rounded-2xl border border-slate-800 p-12 text-center text-slate-400 space-y-3">
          <FaUserShield className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Grievances Recorded</h3>
          <p className="text-xs max-w-sm mx-auto">
            All customer and supplier relationships are healthy. You can log a new grievance or welfare ticket anytime.
          </p>
          <Button
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
            className="mt-2"
          >
            Create First Grievance Record
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="glass-card rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition shadow-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                      {c.type}
                    </span>
                    {getPriorityBadge(c.priority)}
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {c.title}
                  </h3>
                </div>
                <div>{getStatusBadge(c.status)}</div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                {c.description}
              </p>

              {/* Party & Contact */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                <div>
                  <span className="font-semibold text-white">{c.partyName}</span>
                  {c.contact && (
                    <span className="ml-2 text-slate-400 inline-flex items-center gap-1">
                      <FaPhoneAlt className="w-2.5 h-2.5 text-slate-500" />
                      {c.contact}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Evidence preview if uploaded */}
              {c.evidenceImage && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(c.evidenceImage)}
                    className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20"
                  >
                    <FaImage className="w-3 h-3" />
                    <span>View Attached Proof / Receipt</span>
                  </button>
                </div>
              )}

              {/* Resolution Notes if Resolved */}
              {c.resolutionNotes && (
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <FaCheck className="w-3 h-3" />
                    <span>Resolution Note:</span>
                  </div>
                  <p>{c.resolutionNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => {
                    setResolveTarget(c);
                    setResolutionNotes(c.resolutionNotes || "");
                    setResolveStatus(c.status === "Pending" ? "Resolved" : c.status);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition active:scale-95"
                >
                  Manage Status & Resolution
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(c._id)}
                  className="p-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
                  title="Delete Complaint"
                >
                  <FaTrashAlt className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* Modal: Create Grievance */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg glass-card rounded-3xl border border-slate-800 bg-slate-900/95 p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaHandsHelping className="text-indigo-400" />
                Log Grievance / Welfare Ticket
              </h3>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  resetCreateForm();
                }}
                className="text-slate-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ticket Subject / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Defective stock returned, Vendor late delivery"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm glass-input border border-slate-800 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Grievance Category *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm glass-input border border-slate-800 text-white bg-slate-900"
                  >
                    <option value="Customer">Customer Grievance</option>
                    <option value="Supplier">Supplier / Vendor Issue</option>
                    <option value="Staff Welfare">Staff Welfare / HR</option>
                    <option value="Product Quality">Product Quality & Damage</option>
                    <option value="Store Operations">Store Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm glass-input border border-slate-800 text-white bg-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Party / Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rohan Sharma"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm glass-input border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Phone / Email
                  </label>
                  <input
                    type="text"
                    placeholder="Phone or email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm glass-input border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Issue Description & Action Required *
                </label>
                <textarea
                  rows="3"
                  placeholder="Detail the complaint, products involved, or requested resolution..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm glass-input border border-slate-800 text-white"
                  required
                />
              </div>

              {/* Evidence File Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Attach Evidence Photo / Bill / Receipt
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                />
                {filePreview && (
                  <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-700">
                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    resetCreateForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={submitting}>
                  Submit Grievance
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Resolve Complaint */}
      {resolveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-card rounded-3xl border border-slate-800 bg-slate-900/95 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FaCheckCircle className="text-emerald-400" />
              Resolve / Update Ticket
            </h3>

            <p className="text-xs text-slate-300">
              Update resolution progress for: <strong className="text-white">"{resolveTarget.title}"</strong>
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Updated Status
                </label>
                <select
                  value={resolveStatus}
                  onChange={(e) => setResolveStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm glass-input border border-slate-800 text-white bg-slate-900"
                >
                  <option value="Pending">Pending (Awaiting investigation)</option>
                  <option value="In Review">In Review (Active investigation)</option>
                  <option value="Resolved">Resolved (Satisfactorily concluded)</option>
                  <option value="Rejected">Rejected (Invalid claim)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Resolution Note / Action Taken
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Refund processed ₹450 / Replacement issued / Vendor agreed to invoice discount."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm glass-input border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setResolveTarget(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={resolving}>
                  Save Resolution
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] p-2 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white hover:bg-black"
            >
              <FaTimes />
            </button>
            <img
              src={previewImage}
              alt="Evidence Attachment"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Grievance Record"
        message="Are you sure you want to permanently delete this grievance ticket? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

export default Complaint;

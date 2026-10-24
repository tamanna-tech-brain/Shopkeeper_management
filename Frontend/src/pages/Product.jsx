import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  createProduct,
  getSupplier,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
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
  FaBoxOpen,
  FaPlus,
  FaBarcode,
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaTruck,
  FaThLarge,
  FaList,
  FaImage,
  FaArrowLeft,
  FaRandom,
} from "react-icons/fa";

// ======================== PRODUCT DASHBOARD ======================== //
const ProductDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inventory & Products
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your store catalog, monitor stock thresholds, and update pricing.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/product/create")}
          icon={<FaPlus className="w-3.5 h-3.5" />}
        >
          Add New Product
        </Button>
      </div>

      <GetAllProduct />
    </div>
  );
};

// ======================== GET ALL PRODUCTS ======================== //
const GetAllProduct = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const limit = 9;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProduct(page, limit, search);
      const fetched = Array.isArray(res.data.data) ? res.data.data : [];
      setProducts(fetched);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteProductById(deleteId);
      toast.success("Product deleted successfully");
      setDeleteId(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  // Filter by category if selected
  const categories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts =
    categoryFilter === "all"
      ? products
      : products.filter(
          (p) =>
            p.category?.toLowerCase() === categoryFilter.toLowerCase()
        );

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-slate-800 bg-slate-900/60">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by product name, barcode..."
          className="flex-1"
        />

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl text-sm glass-input border border-slate-800 text-slate-200 bg-slate-900"
          >
            <option value="all">All Categories</option>
            {categories
              .filter((c) => c !== "all")
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-slate-800/80 p-1 border border-slate-700">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`p-2 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FaThLarge className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`p-2 rounded-lg transition ${
                viewMode === "table"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FaList className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Products Grid or Table */}
      {loading ? (
        <Loader text="Loading store products..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={<FaBoxOpen className="w-8 h-8 opacity-80" />}
          title="No Products Found"
          description={
            search
              ? "No product matching your search criteria. Try a different term."
              : "Your inventory is empty. Create your first product to start selling."
          }
          actionText={search ? "Clear Search" : "+ Add Product"}
          onAction={() => {
            if (search) setSearch("");
            else navigate("/product/create");
          }}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const stockLevel = Number(product.stock || 0);
            return (
              <div
                key={product._id}
                className="group glass-card rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/30"
              >
                <div>
                  {/* Product Image / Placeholder */}
                  <div className="relative w-full h-44 bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800/60">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full flex flex-col items-center justify-center text-slate-400 ${
                        product.image ? "hidden" : "flex"
                      }`}
                    >
                      <FaBoxOpen className="w-10 h-10 mb-2 opacity-40 text-indigo-400" />
                      <span className="text-xs font-medium">No Image</span>
                    </div>

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700">
                      {product.category || "General"}
                    </span>

                    {/* Stock pill */}
                    <div className="absolute top-3 right-3">
                      {stockLevel <= 0 ? (
                        <StatusBadge status="Out of Stock" variant="danger" />
                      ) : stockLevel < 10 ? (
                        <StatusBadge
                          status={`Low: ${stockLevel}`}
                          variant="warning"
                        />
                      ) : (
                        <StatusBadge
                          status={`In Stock (${stockLevel})`}
                          variant="success"
                        />
                      )}
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="text-lg font-extrabold text-indigo-400 shrink-0">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <FaBarcode className="w-3.5 h-3.5 text-slate-400" />
                        <span>{product.barcode || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                        <FaTruck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {product?.supplierId?.name || "No Supplier"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions footer */}
                <div className="p-4 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2 bg-slate-950/30">
                  <Link
                    to={`/product/get/${product._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                  >
                    <FaEye className="w-3 h-3 text-slate-400" />
                    <span>View</span>
                  </Link>

                  <Link
                    to={`/product/update/${product._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 text-xs font-semibold transition"
                  >
                    <FaEdit className="w-3 h-3" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => setDeleteId(product._id)}
                    className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition"
                    title="Delete Product"
                  >
                    <FaTrashAlt className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                  <th className="py-4 pl-6">Product</th>
                  <th className="py-4">Category</th>
                  <th className="py-4">Barcode</th>
                  <th className="py-4">Price</th>
                  <th className="py-4">Stock</th>
                  <th className="py-4">Supplier</th>
                  <th className="py-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((product) => {
                  const stockLevel = Number(product.stock || 0);
                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-800/30 transition"
                    >
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center border border-slate-800">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaBoxOpen className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white line-clamp-1">
                              {product.name}
                            </p>
                            <span className="text-xs text-slate-400">
                              ID: {product._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-300">
                        <span className="px-2.5 py-1 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {product.category || "General"}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-xs text-slate-400">
                        {product.barcode || "-"}
                      </td>
                      <td className="py-4 font-bold text-indigo-400">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-4">
                        {stockLevel <= 0 ? (
                          <StatusBadge status="0" variant="danger" />
                        ) : stockLevel < 10 ? (
                          <StatusBadge status={stockLevel} variant="warning" />
                        ) : (
                          <StatusBadge status={stockLevel} variant="success" />
                        )}
                      </td>
                      <td className="py-4 text-slate-300 text-xs">
                        {product?.supplierId?.name || "No Supplier"}
                      </td>
                      <td className="py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/product/get/${product._id}`}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="View"
                          >
                            <FaEye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/product/update/${product._id}`}
                            className="p-2 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition"
                            title="Edit"
                          >
                            <FaEdit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(product._id)}
                            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete"
                          >
                            <FaTrashAlt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages || 1}
        onPageChange={(p) => setPage(p)}
        totalItems={pagination.total}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? It will be permanently removed from inventory."
        confirmText="Yes, Delete Product"
        loading={deleting}
      />
    </div>
  );
};

// ======================== CREATE PRODUCT ======================== //
const CreateProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(false);

  const nameRef = useRef();

  const fetchSupplier = async () => {
    try {
      const res = await getSupplier(1, 100);
      setSupplier(res.data.data || []);
    } catch (error) {
      console.error("Supplier fetch error:", error);
    }
  };

  useEffect(() => {
    nameRef.current?.focus();
    fetchSupplier();
  }, []);

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const generateBarcode = () => {
    const randomCode =
      "SKU-" + Math.floor(100000 + Math.random() * 900000);
    setBarcode(randomCode);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!name || !category || !price || !stock || !barcode || !supplierId) {
        return toast.error("Please fill all required fields (including supplier)");
      }

      if (name.trim().length < 4 || name.trim().length > 60) {
        return toast.error("Product name must be between 4 and 60 characters");
      }

      if (category.trim().length < 4 || category.trim().length > 60) {
        return toast.error("Category must be between 4 and 60 characters");
      }

      if (Number(price) < 0) {
        return toast.error("Price must be 0 or higher");
      }

      if (Number(stock) < 1) {
        return toast.error("Initial stock must be at least 1 unit");
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("category", category.trim());
      formData.append("price", String(price));
      formData.append("stock", String(stock));
      formData.append("barcode", barcode.trim());
      formData.append("supplierId", String(supplierId));
      if (file) {
        formData.append("image", file);
      }

      await createProduct(formData);
      toast.success("Product created successfully!");
      navigate("/product");
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/product")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create New Product
            </h1>
            <p className="text-xs text-slate-400">
              Enter product details, pricing, barcode, and upload an image.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            ref={nameRef}
            label="Product Name"
            placeholder="e.g. Premium Cotton T-Shirt"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Category"
            placeholder="e.g. Apparel, Electronics, Grocery"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <Input
            label="Selling Price (₹)"
            type="number"
            placeholder="e.g. 499"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />

          <Input
            label="Initial Stock Quantity"
            type="number"
            placeholder="e.g. 50"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min="0"
          />

          <div className="text-left">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Barcode / SKU <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={generateBarcode}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <FaRandom className="w-2.5 h-2.5" />
                <span>Generate</span>
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. SKU-849201"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 focus:border-indigo-500 font-mono"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Supplier <span className="text-rose-400">*</span>
            </label>
            <select
              value={String(supplierId)}
              onChange={(e) => setSupplierId(String(e.target.value))}
              required
              className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 text-slate-200 bg-slate-900"
            >
              <option value="">-- Select a Supplier --</option>
              {supplier.map((s) => (
                <option key={s._id} value={String(s._id)}>
                  {s.name} ({s.phone})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Image Upload with Preview */}
        <div className="text-left pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Product Image (Optional)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-28 h-28 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaImage className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="flex-1 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="product-image-upload"
                className="hidden"
              />
              <label
                htmlFor="product-image-upload"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition"
              >
                <FaImage className="w-3.5 h-3.5 text-indigo-400" />
                <span>Choose Image File</span>
              </label>
              <p className="text-[11px] text-slate-400 mt-2">
                PNG, JPG or WebP up to 5MB. Clean square aspect ratio recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => navigate("/product")}
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
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
};

// ======================== GET PRODUCT BY ID ======================== //
const GetProductById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductById(id);
      setProduct(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteProductById(id);
      toast.success("Product deleted successfully");
      navigate("/product");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Fetching product specifications..." fullScreen={false} />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="The requested product does not exist or has been removed."
        actionText="Back to Products"
        onAction={() => navigate("/product")}
      />
    );
  }

  const stockLevel = Number(product.stock || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/product")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400">
              Product ID: <span className="font-mono">{product._id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/product/update/${product._id}`)}
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

      {/* Product Spec Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl grid grid-cols-1 md:grid-cols-2">
        {/* Image Column */}
        <div className="bg-slate-950 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-80 w-auto object-contain rounded-xl shadow-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 py-16">
              <FaBoxOpen className="w-20 h-20 mb-3 opacity-30 text-indigo-400" />
              <span className="text-sm font-medium">No Image Uploaded</span>
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {product.category || "General"}
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">
              {product.name}
            </h2>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">
              ₹{Number(product.price || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Stock Status</span>
              {stockLevel <= 0 ? (
                <StatusBadge status="Out of Stock (0)" variant="danger" />
              ) : stockLevel < 10 ? (
                <StatusBadge status={`Low Stock (${stockLevel})`} variant="warning" />
              ) : (
                <StatusBadge status={`In Stock (${stockLevel} units)`} variant="success" />
              )}
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Barcode / SKU</span>
              <span className="font-mono text-slate-200 font-semibold">
                {product.barcode || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Supplier</span>
              <span className="font-semibold text-slate-200">
                {product?.supplierId?.name || "Direct Supplier / Unknown"}
              </span>
            </div>

            {product?.supplierId?.phone && (
              <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Supplier Phone</span>
                <span className="font-mono text-slate-300">
                  {product.supplierId.phone}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        loading={deleting}
      />
    </div>
  );
};

// ======================== UPDATE PRODUCT ======================== //
const UpdateProductById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProductAndSuppliers = async () => {
    try {
      setLoading(true);
      const [prodRes, supRes] = await Promise.all([
        getProductById(id),
        getSupplier(1, 100),
      ]);

      const prod = prodRes.data.data;
      if (prod) {
        setName(prod.name || "");
        setCategory(prod.category || "");
        setPrice(prod.price || "");
        setStock(prod.stock || "");
        setBarcode(prod.barcode || "");
        setSupplierId(prod.supplierId?._id || prod.supplierId || "");
        if (prod.image) {
          setPreviewUrl(prod.image);
        }
      }
      setSupplier(supRes.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndSuppliers();
  }, [id]);

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!name || !category || !price || !stock || !supplierId) {
        return toast.error("Please fill all required fields (including supplier)");
      }

      if (name.trim().length < 4 || name.trim().length > 60) {
        return toast.error("Product name must be between 4 and 60 characters");
      }

      if (category.trim().length < 4 || category.trim().length > 60) {
        return toast.error("Category must be between 4 and 60 characters");
      }

      if (Number(price) < 0) {
        return toast.error("Price must be 0 or higher");
      }

      if (Number(stock) < 1) {
        return toast.error("Stock must be at least 1 unit");
      }

      setSaving(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("category", category.trim());
      formData.append("price", String(price));
      formData.append("stock", String(stock));
      formData.append("barcode", barcode ? barcode.trim() : "");
      formData.append("supplierId", String(supplierId));
      if (file) {
        formData.append("image", file);
      }

      await updateProductById(id, formData);
      toast.success("Product updated successfully!");
      navigate(`/product/get/${id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading product details..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/product/get/${id}`)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Update Product
            </h1>
            <p className="text-xs text-slate-400">
              Modify pricing, stock levels, or product photo.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <Input
            label="Price (₹)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />

          <Input
            label="Stock Quantity"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min="0"
          />

          <Input
            label="Barcode / SKU"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            required
          />

          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Supplier
            </label>
            <select
              value={String(supplierId)}
              onChange={(e) => setSupplierId(String(e.target.value))}
              className="w-full rounded-xl py-2.5 px-3.5 text-sm glass-input border border-slate-800 text-slate-200 bg-slate-900"
            >
              <option value="">Select Supplier</option>
              {supplier.map((s) => (
                <option key={s._id} value={String(s._id)}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Image Update */}
        <div className="text-left pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Product Image
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-28 h-28 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaImage className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="flex-1 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="update-product-image"
                className="hidden"
              />
              <label
                htmlFor="update-product-image"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition"
              >
                <FaImage className="w-3.5 h-3.5 text-indigo-400" />
                <span>Change Image</span>
              </label>
              <p className="text-[11px] text-slate-400 mt-2">
                Leave unchanged to keep current product image.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => navigate(`/product/get/${id}`)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            icon={<FaEdit className="w-3 h-3" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

// ======================== DELETE PRODUCT BY ID (Direct Route fallback) ======================== //
const DeleteProductById = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductById(id);
      setProduct(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteProductById(id);
      toast.success("Product deleted successfully");
      navigate("/product");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading product..." />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="This product no longer exists."
        actionText="Back to Products"
        onAction={() => navigate("/product")}
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
            Delete "{product.name}"?
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Are you sure you want to permanently remove this product from inventory? This action cannot be undone.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1 text-left">
          <p>
            <strong className="text-slate-400">Category:</strong> {product.category}
          </p>
          <p>
            <strong className="text-slate-400">Price:</strong> ₹{product.price}
          </p>
          <p>
            <strong className="text-slate-400">Stock:</strong> {product.stock} units
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/product")}
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
            Delete Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export {
  ProductDashboard,
  CreateProduct,
  GetAllProduct,
  GetProductById,
  UpdateProductById,
  DeleteProductById,
};
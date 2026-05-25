import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import {
  createProduct,
  getSupplier,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../apis/api";

const ProductDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-cyan-900 to-blue-900 p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">
          Product Dashboard
        </h1>

        <button
          onClick={() => navigate("/product/create")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl shadow-xl"
        >
          Create Product
        </button>
      </div>

      <GetAllProduct />
    </div>
  );
};

const CreateProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [supplier, setSupplier] = useState([]);

  const nameRef = useRef();

  useEffect(() => {
    nameRef.current?.focus();
    fetchSupplier();
  }, []);

  const fetchSupplier = async () => {
    try {
      const res = await getSupplier(1,100);
       console.log("SUPPLIER:", res.data);
      setSupplier(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        !name ||
        !category ||
        !price ||
        !stock ||
        !barcode ||
        !supplierId
      ) {
        return alert("Fill all fields");
      }

      const productData = {
        name,
        category,
        price,
        stock,
        barcode,
        supplierId,
      };

      await createProduct(productData);

      alert("Product created successfully");

      navigate("/product");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 to-pink-900">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">

        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Create Product
        </h1>

        <input
          ref={nameRef}
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <input
          type="text"
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <select
  value={String(supplierId)}
  onChange={(e) => setSupplierId(String(e.target.value))}
  className="w-full mb-6 p-3 rounded-xl outline-none"
>
  <option value="">
    Select Supplier
  </option>

  {supplier?.map((s) => (
    <option
      key={s._id}
      value={String(s._id)}
    >
      {s.name}
    </option>
  ))}
</select>

        <button
          onClick={handleSubmit}
          className="bg-pink-500 hover:bg-pink-600 text-white w-full p-3 rounded-xl"
        >
          Create Product
        </button>
      </div>
    </div>
  );
};

const GetAllProduct = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await getProduct(page, 2, search);
console.log("PRODUCT RESPONSE:", res.data);

setProducts(Array.isArray(res.data.data) ? res.data.data : []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
  if (page < (pagination.totalPages || 1)) {
    setPage(page + 1);
  }
};

  return (
    <div>

      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search Product"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md p-4 rounded-2xl outline-none
          bg-white/10 text-white placeholder:text-gray-300
          border border-white/20 backdrop-blur-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/get/${product._id}`)}
            className="bg-white/10 backdrop-blur-xl border border-white/20
            rounded-3xl h-52 flex items-center justify-center
            shadow-2xl hover:scale-105 transition cursor-pointer"
          >
            <h2 className="text-3xl text-white font-bold text-center">
              {product.name}
            </h2>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-6 mt-10">

        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="bg-gray-700 hover:bg-gray-600
          disabled:opacity-50 text-white px-6 py-3 rounded-xl"
        >
          Prev
        </button>

        <div className="text-white text-xl flex items-center">
          Page {page} of {pagination.totalPages || 1}
        </div>

        <button
          onClick={handleNext}
          disabled={page >= (pagination.totalPages || 1)}
          className="bg-cyan-500 hover:bg-cyan-600
          disabled:opacity-50 text-white px-6 py-3 rounded-xl"
        >
          Next
        </button>

      </div>
    </div>
  );
};

const GetProductById = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);

      setProduct(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-cyan-900 p-10">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white">

        <h1 className="text-3xl font-bold mb-6 text-center">
          {product.name}
        </h1>

        <p className="mb-2">
          <span className="font-bold">Category: </span>
          {product.category}
        </p>

        <p className="mb-2">
          <span className="font-bold">Price: </span>
          ₹ {product.price}
        </p>

        <p className="mb-2">
          <span className="font-bold">Stock: </span>
          {product.stock}
        </p>

        <p className="mb-2">
          <span className="font-bold">Barcode: </span>
          {product.barcode}
        </p>

        <p className="mb-2">
          <span className="font-bold">Supplier: </span>
          {product?.supplierId?.name || "No Supplier"}
        </p>

        <button
          onClick={() => navigate(`/product/update/${product._id}`)}
          className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl mr-4"
        >
          Update Product
        </button>

        <button
          onClick={() => navigate(`/product/delete/${product._id}`)}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl"
        >
          Delete Product
        </button>

      </div>
    </div>
  );
};

const UpdateProductById = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [supplier, setSupplier] = useState([]);

  const nameRef = useRef();

  useEffect(() => {
    nameRef.current?.focus();

    fetchProduct();
    fetchSupplier();
  }, [id]);

  const fetchProduct = async () => {
  try {
    const res = await getProductById(id);

    const product = res.data.data;

    console.log("PRODUCT:", product);

    setName(product?.name || "");
    setCategory(product?.category || "");
    setPrice(product?.price || "");
    setStock(product?.stock || "");
    setBarcode(product?.barcode || "");

    // IMPORTANT FIX
    setSupplierId(
      product?.supplierId?._id
        ? String(product.supplierId._id)
        : ""
    );

  } catch (error) {
    console.log(error);
  }
};

  const fetchSupplier = async () => {
    try {
      const res = await getSupplier();

      setSupplier(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {

      if (
        !name ||
        !category ||
        !price ||
        !stock ||
        !barcode ||
        !supplierId
      ) {
        return alert("Fill all fields");
      }

      const updateData = {
        name,
        category,
        price,
        stock,
        barcode,
        supplierId,
      };

      await updateProductById(id, updateData);

      alert("Product updated successfully");

      navigate("/product");

    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-cyan-900 to-blue-900">

      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">

        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Update Product
        </h1>

        <input
          ref={nameRef}
          value={name}
          placeholder="Product Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <input
          value={category}
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <input
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <select
          value={String(supplierId)}
          onChange={(e) => setSupplierId(String(e.target.value))}
          className="w-full mb-6 p-3 rounded-xl outline-none"
        >
          <option value="">
            Select Supplier
          </option>

          {supplier.map((s) => (
            <option
              key={s._id}
              value={String(s._id)}
            >
              {s.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleUpdate}
          className="bg-cyan-500 hover:bg-cyan-600 text-white w-full p-3 rounded-xl"
        >
          Update Product
        </button>

      </div>
    </div>
  );
};

const DeleteProductById = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);

      setProduct(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {

      await deleteProductById(id);

      alert("Product deleted successfully");

      navigate("/product");

    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || error.message);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-red-900 to-black">

      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">

        <h1 className="text-3xl font-bold text-center mb-6">
          Delete Product
        </h1>

        <div className="text-center mb-8">

          <h2 className="text-2xl font-bold mb-3">
            {product.name}
          </h2>

          <p className="mb-2">{product.category}</p>

          <p className="mb-2">₹ {product.price}</p>

          <p className="mb-2">Stock: {product.stock}</p>

        </div>

        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white w-full p-3 rounded-xl"
        >
          Delete Product
        </button>

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
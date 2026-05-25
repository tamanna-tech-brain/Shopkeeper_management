import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  createSales,
  getSales,
  getSalesById,
  updateSalesById,
  deleteSalesById,
  getCustomer,
  getProduct,
} from "../apis/api";

const SalesDashboard = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-purple-950 p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold text-white">
          Sales Dashboard
        </h1>

        <button
          onClick={() => navigate("/sales/create")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-2xl"
        >
          Create Sales
        </button>

      </div>

      <GetAllSales />

    </div>
  );
};

const CreateSales = () => {

  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [date, setDate] = useState("");

  const totalAmount =
    Number(quantity || 0) * Number(price || 0);

  useEffect(() => {

    fetchCustomers();
    fetchProducts();

  }, []);

  const fetchCustomers = async () => {

    try {

      const res = await getCustomer(1, 100);

      setCustomers(res.data.data || []);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {

    try {

      const res = await getProduct(1, 100);

      setProducts(res.data.data || []);

    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async () => {

    try {

      if (
        !customerId ||
        !productId ||
        !quantity ||
        !price ||
        !paymentMethod ||
        !date
      ) {
        return alert("Fill all fields");
      }

      const salesData = {
        customerId,
        items: [
          {
            productId,
            quantity,
            price,
          },
        ],
        totalAmount,
        paymentMethod,
        date,
      };

      await createSales(salesData);

      alert("Sales created successfully");
      console.log("customer",{
       customerId,
        items: [
          {
            productId,
            quantity,
            price,
          },
        ],
        totalAmount,
        paymentMethod,
        date
      })
      navigate("/sales");

    } catch (error) {

      console.log(error);
      alert(error.response?.data?.message || error.message);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-slate-900 p-10">

      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Create Sales
        </h1>

        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full mb-4 p-4 rounded-xl outline-none"
        >

          <option value="">
            Select Customer
          </option>

          {
            customers.map((customer) => (
              <option
                key={customer._id}
                value={customer._id}
              >
                {customer.name}
              </option>
            ))
          }

        </select>

        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full mb-4 p-4 rounded-xl outline-none"
        >

          <option value="">
            Select Product
          </option>

          {
            products.map((product) => (
              <option
                key={product._id}
                value={product._id}
              >
                {product.name}
              </option>
            ))
          }

        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full mb-4 p-4 rounded-xl outline-none"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-4 p-4 rounded-xl outline-none"
        />

        <input
          type="number"
          value={totalAmount}
          readOnly
          className="w-full mb-4 p-4 rounded-xl bg-gray-200 outline-none"
        />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full mb-4 p-4 rounded-xl outline-none"
        >

          <option value="Cash">
            Cash
          </option>

          <option value="UPI">
            UPI
          </option>

          <option value="Card">
            Card
          </option>

        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-6 p-4 rounded-xl outline-none"
        />

        <button
          onClick={handleCreate}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full p-4 rounded-xl"
        >
          Create Sales
        </button>

      </div>

    </div>
  );
};

const GetAllSales = () => {

  const navigate = useNavigate();

  const [sales, setSales] = useState([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const limit = 2;

  const fetchSales = async (currentPage) => {

    try {
      const res = await getSales(currentPage, limit);
      setSales(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSales(page);
  }, [page]);

  const filteredSales = sales.filter((sale) => {

    const keyword = search.toLowerCase().trim();

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

  return (

    <div>

      {/* CENTER SEARCH BAR */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by customer, product, payment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-xl w-96 outline-none text-black"
        />
      </div>

      {/* SALES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {
          filteredSales.map((sale) => (

            <div
              key={sale._id}
              onClick={() => navigate(`/sales/get/${sale._id}`)}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl cursor-pointer hover:scale-105 transition"
            >

              <h2 className="text-2xl text-pink-400 font-bold mb-3">
                ₹ {sale.totalAmount}
              </h2>

              <p className="text-gray-300 mb-2">
                Customer : {sale?.customerId?.name || "No Customer"}
              </p>

              <p className="text-gray-300 mb-2">
                Product : {sale?.items?.[0]?.productId?.name || "No Product"}
              </p>

              <p className="text-gray-300 mb-2">
                Quantity : {sale?.items?.[0]?.quantity}
              </p>

              <p className="text-gray-300 mb-2">
                Price : ₹ {sale?.items?.[0]?.price}
              </p>

              <p className="text-gray-300">
                Payment : {sale.paymentMethod}
              </p>

            </div>

          ))
        }

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-6 mt-10 text-white">

        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="bg-gray-700 px-4 py-2 rounded-xl hover:bg-gray-600"
        >
          Prev
        </button>

        <span className="text-lg font-bold">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-700 px-4 py-2 rounded-xl hover:bg-gray-600"
        >
          Next
        </button>

      </div>

    </div>
  );
};

const GetSalesById = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [sale, setSale] = useState(null);

  useEffect(() => {

    fetchSales();

  }, [id]);

  const fetchSales = async () => {

    try {

      const res = await getSalesById(id);

      setSale(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  if (!sale) {

    return (
      <div className="min-h-screen flex items-center justify-center text-white text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-slate-900 p-10">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-white shadow-2xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          Sales Details
        </h1>

        <p className="mb-3">
          <span className="font-bold">
            Customer :
          </span>
          {" "}
          {sale?.customerId?.name}
        </p>

        <p className="mb-3">
          <span className="font-bold">
            Product :
          </span>
          {" "}
          {sale?.items?.[0]?.productId?.name}
        </p>

        <p className="mb-3">
          <span className="font-bold">
            Quantity :
          </span>
          {" "}
          {sale?.items?.[0]?.quantity}
        </p>

        <p className="mb-3">
          <span className="font-bold">
            Price :
          </span>
          {" "}
          ₹ {sale?.items?.[0]?.price}
        </p>

        <p className="mb-3">
          <span className="font-bold">
            Total :
          </span>
          {" "}
          ₹ {sale.totalAmount}
        </p>

        <p className="mb-6">
          <span className="font-bold">
            Payment :
          </span>
          {" "}
          {sale.paymentMethod}
        </p>

        <button
          onClick={() => navigate(`/sales/update/${sale._id}`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl mr-4"
        >
          Update
        </button>

        <button
          onClick={() => navigate(`/sales/delete/${sale._id}`)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl"
        >
          Delete
        </button>

      </div>

    </div>
  );
};

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

  const totalAmount =
    Number(quantity || 0) * Number(price || 0);

  useEffect(() => {

    fetchCustomers();
    fetchProducts();
    fetchSales();

  }, [id]);

  const fetchCustomers = async () => {

    try {

      const res = await getCustomer(1, 100);

      setCustomers(res.data.data || []);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {

    try {

      const res = await getProduct(1, 100);

      setProducts(res.data.data || []);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchSales = async () => {

    try {

      const res = await getSalesById(id);

      const sale = res.data.data;

      setCustomerId(
        sale?.customerId?._id
          ? String(sale.customerId._id)
          : ""
      );

      setProductId(
        sale?.items?.[0]?.productId?._id
          ? String(sale.items[0].productId._id)
          : ""
      );

      setQuantity(sale?.items?.[0]?.quantity || "");
      setPrice(sale?.items?.[0]?.price || "");

      setPaymentMethod(sale.paymentMethod || "Cash");

      setDate(sale?.date?.split("T")[0] || "");

    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {

    try {

      const updatedData = {
        customerId,
        items: [
          {
            productId,
            quantity,
            price,
          },
        ],
        totalAmount,
        paymentMethod,
        date,
      };

      await updateSalesById(id, updatedData);

      alert("Sales updated successfully");

      navigate("/sales");

    } catch (error) {

      console.log(error);

      alert(error.response?.data?.message || error.message);

    }
  };

  return (
    <CreateSales />
  );
};

const DeleteSalesById = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [sale, setSale] = useState(null);

  useEffect(() => {

    fetchSales();

  }, [id]);

  const fetchSales = async () => {

    try {

      const res = await getSalesById(id);

      setSale(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {

    try {

      await deleteSalesById(id);

      alert("Sales deleted successfully");

      navigate("/sales");

    } catch (error) {

      console.log(error);

      alert(error.response?.data?.message || error.message);

    }
  };

  if (!sale) {

    return (
      <div className="min-h-screen flex items-center justify-center text-white text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-900 to-slate-900 p-10">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-white">

        <h1 className="text-3xl font-bold text-center mb-6">
          Delete Sales
        </h1>

        <div className="text-center mb-8">

          <h2 className="text-2xl font-bold mb-3">
            ₹ {sale.totalAmount}
          </h2>

          <p className="mb-2">
            Product :
            {" "}
            {sale?.items?.[0]?.productId?.name}
          </p>

          <p className="mb-2">
            Quantity :
            {" "}
            {sale?.items?.[0]?.quantity}
          </p>

          <p className="mb-2">
            Price :
            {" "}
            ₹ {sale?.items?.[0]?.price}
          </p>

        </div>

        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white w-full p-3 rounded-xl"
        >
          Delete Sales
        </button>

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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import {createSales, getSales, getSalesById, updateSalesById,deleteSalesById, getCustomer, getProduct} from "../apis/api"


const SalesDashboard =  () => {
   const navigate = useNavigate();

   return (
     <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-purple-950 p-10">
      <div className="flex justify-between items-center mb-10">

         <h1 className="text-5xl font-bold text-white">
            sales Dashboard
         </h1>
          <button
          onClick={() => navigate("/sales/create")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-2xl"
        >
          Create Sale
        </button>
      </div>
      <GetAllSales/>
    </div>
   )
}

const CreateSales = () => {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [customerId, setCustomerId] = useState("")
    const [items, setItems] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const totalAmount = Number(quantity || 0) * Number(price || 0);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [date, setDate] = useState("");    

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchCustomers = async () => {
        try{
            const res = await getCustomer();
            setCustomers(res.data.data || []);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchProducts = async () => {
    try {

        const res = await getProduct();

        setProducts(res.data.data || []);

        } catch (error) {
        console.log(error);
      }
    };

    const handleCreate = async () => {
        try {
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
                date
            };
            await createSales(salesData);
            alert("sales created successfully");
            navigate("/sales");

        } catch (error) {
            console.log(error);
            alert(error.message);
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
        className="w-full mb-4 p-4 rounded-xl outline-none">
        
        <option value="">select Customer</option>
        {
                customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
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
          placeholder="Total Amount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          className="w-full mb-4 p-4 rounded-xl outline-none"
        />

        <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full mb-4 p-4 rounded-xl outline-none">
            <option value="">select payment</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
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
    
    )
}; 

const GetAllSales = () => {
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const fetchSales = async () => {
        try {
            const res = await getSales()
            setSales(res.data.data || []);

        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {
                    sales.map((sale) => (
                        <div
                        key={sale._id}
                        onClick={() => navigate(`/sales/get/${sale._id}`)}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl cursor-pointer hover:scale-105 transition"
                        >
                            <h2 className="text-2xl text-pink-400 font-bold mb-3 ">
                                {sale.totalAmount}
                            </h2>

                            <p className="text-gray-300">
                                {sale.paymentMethod}
                            </p>

                             <p className="text-gray-300">
                                Qty :
                            {sale.items?.[0]?.quantity}
                            </p>
                            </div>
                    ))
                }
            </div>

    );
};

const GetSalesById =  () => {
    const {id} = useParams();
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

    if(!sale) {
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
          <span className="font-bold">Items:</span> {sale.items?.[0]?.quantity}
        </p>

        <p className="mb-3">
          <span className="font-bold">Quantity:</span>  {sale.items?.[0]?.quantity}
        </p>

        <p className="mb-3">
          <span className="font-bold">Price:</span>  {sale.items?.[0]?.price}
        </p>

        <p className="mb-3">
          <span className="font-bold">Total:</span> {sale.totalAmount}
        </p>

        <p className="mb-6">
          <span className="font-bold">Payment:</span> {sale.paymentMethod}
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
    )
};


const UpdateSalesById = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [items, setItems] = useState("");
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

            const res = await getCustomer();

            setCustomers(res.data.data || []);

        } catch (error) {
            console.log(error);
        }
    };
    const fetchProducts = async () => {
    try {

        const res = await getProduct();

        setProducts(res.data.data || []);

        } catch (error) {
        console.log(error);
          }
    };

    const fetchSales = async () => {

        try {

            const res = await getSalesById(id);

            const sale = res.data.data;

            setCustomerId(sale.customerId);
            setItems(sale.items);
            setProductId(sale.items?.[0]?.productId || "");
            setQuantity(sale.items?.[0]?.quantity || "");
            setPrice(sale.items?.[0]?.price || "");
            setPaymentMethod(sale.paymentMethod);
            setDate(sale.date?.split("T")[0]);

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

            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-yellow-900 to-slate-900 p-10">

            <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

                <h1 className="text-3xl font-bold text-white text-center mb-8">
                    Update Sales
                </h1>

                <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full mb-4 p-3 rounded-xl outline-none"
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
                   className="w-full mb-4 p-3 rounded-xl outline-none"
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
                    value={totalAmount}
                    readOnly
                    className="w-full mb-4 p-3 rounded-xl bg-gray-200 outline-none"
                />

                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full mb-4 p-3 rounded-xl outline-none"
                >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                </select>


                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mb-6 p-3 rounded-xl outline-none"
                />

                <button
                    onClick={handleUpdate}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white w-full p-3 rounded-xl"
                >
                    Update Sales
                </button>

            </div>

        </div>
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

            alert(error.message);
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
                        Product Quantity : {sale.items?.[0]?.quantity}
                    </h2>

                    <p className="mb-2">
                        Quantity : {sale.items?.[0]?.quantity
}
                    </p>

                    <p className="mb-2">
                        Price : ₹ {sale.items?.[0]?.price}
                    </p>

                    <p className="mb-2">
                        Total : ₹ {sale.totalAmount}
                    </p>

                    <p className="mb-2">
                        Payment : {sale.paymentMethod}
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

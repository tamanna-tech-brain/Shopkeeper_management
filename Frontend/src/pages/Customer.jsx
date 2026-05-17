import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {
    createCustomer,
    getCustomer,
    getCustomerById,
    updateCustomerById,
    deleteCustomerById
} from "../apis/api";

const CustomerDashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-900 via-cyan-900 to-indigo-900  p-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-white">
                    Customer Dashboard
                </h1>
                <button 
                onClick={() => navigate("/customer/create")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl shadow-xl ">
                    Create Customer
                </button>
            </div>
            <GetAllCustomer/>
        </div>
    );
}

const CreateCustomer = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const nameRef = useRef();
    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    const handleSubmit = async () => {
        try{
            if (!name || !phone || !address) {
                return alert("Fill all fields");
            }
            const customerData = {
                name, phone, address
            };
            await createCustomer(customerData);
            alert("Customer created successfully");
            navigate("/customer");
            setPage(1);

        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 to-pink-900">
            <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <h1 className="text-3xl font-bold text-white text-center mb-8">
                create Customer 
            </h1>

            <input 
            ref={nameRef}
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl outline-none"
            />

            <input 
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mb-6 p-3 rounded-xl outline-none"
            />

            <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mb-6 p-3 rounded-xl outline-none"
            />

            <button 
            onClick={handleSubmit}
            className="bg-cyan-500 hover:bg-cyan-600 text-white w-full p-3 rounded-xl">
                Create customer 
            </button>
            </div>
        </div>
    )
}

const GetAllCustomer = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");

  const fetchCustomer = async () => {
    try {
      const res = await getCustomer(page, 2, search);

      console.log("CUSTOMER RESPONSE:", res.data);

      setCustomers(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [page, search]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < (pagination.totalPages || 1)) setPage(page + 1);
  };

  return (
    <div>

      {/* SEARCH */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search Customer..."
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

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {customers.map((customer) => (
          <div
            key={customer._id}
            onClick={() => navigate(`/customer/get/${customer._id}`)}
            className="bg-white/10 backdrop-blur-xl border border-white/20 
            rounded-2xl shadow-xl w-64 h-64 flex items-center justify-center
            cursor-pointer hover:scale-105 transition"
          >
            <h2 className="text-2xl font-bold text-white text-center">
              {customer.name}
            </h2>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-6 mt-10">

        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl"
        >
          Prev
        </button>

        <button
          onClick={handleNext}
          disabled={page === pagination.totalPages}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl"
        >
          Next
        </button>

      </div>

    </div>
  );
};

const GetCustomerById = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        try {
            const res = await getCustomerById(id);
            setCustomer(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    if(!customer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl">
                loading
            </div>
        );
    }
        return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 via-cyan-900 to-indigo-900 p-10">

                <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {customer.name}
                </h1>
                <p className="mb-3">
                    <span className="font-bold ">
                        Phone:
                    </span>
                    {customer.phone}
                </p>
                <p className="mb-6">
                    <span className="font-bold">Address :</span>
                    {customer.address}
                </p>

                <button 
                onClick={() => navigate(`/customer/update/${customer._id}`)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl mr-4">
                    Update customer
                </button>

                <button
                onClick={() => navigate(`/customer/delete/${customer._id}`)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl"
                >
                Delete Customer
                </button>
                </div>
            </div>
        )
}

const UpdateCustomerById = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        try{
            const res = await getCustomerById(id);

            setName(res.data.data.name);
            setPhone(res.data.data.phone);
            setAddress(res.data.data.address);
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpdate = async () => {
        try{
            const UpdatedData = {
                name, phone, address,
            };
            await updateCustomerById(id, UpdatedData);
            alert("customer Updated successfully");
            navigate("/customer");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 via-cyan-900  to-indigo-900 p-10">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <h1 className="text-3xl font-bold text-white text-center mb-8">
                Update Customer
              </h1>

              <input 
              type="text"
              placeholder="customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 p-3 rounded-xl outline-none"
              />

              <input 
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-4 p-3 rounded-xl outline"
              />

              <input 
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mb-6 p-3 rounded-xl outline-none"
              />

              <button 
              onClick={handleUpdate}
              className="bg-cyan-500 hover:bg:cyan-600 text-white w-full p-3 rounded-xl"
              >
                Update Customer
              </button>

            </div>
        </div>
    )
}

const DeleteCustomerById = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        try {

            const res = await getCustomerById(id);

            setCustomer(res.data.data);

        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async () => {
        try {

            await deleteCustomerById(id);

            alert("Customer deleted successfully");

            navigate("/customer");

        } catch (error) {
            console.log(error);

            alert(error.message);
        }
    };

    if (!customer) {
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
                    Delete Customer
                </h1>

                <div className="text-center mb-8">

                    <h2 className="text-2xl font-bold mb-3">
                        {customer.name}
                    </h2>

                    <p className="mb-2">
                        {customer.phone}
                    </p>

                    <p className="mb-2">
                        {customer.address}
                    </p>

                </div>

                <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white w-full p-3 rounded-xl"
                >
                    Delete Customer
                </button>

            </div>
        </div>
    );
};


export {CreateCustomer, CustomerDashboard, GetAllCustomer, GetCustomerById, UpdateCustomerById, DeleteCustomerById}
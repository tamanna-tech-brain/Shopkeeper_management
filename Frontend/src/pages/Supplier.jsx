import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createSupplier,
  getSupplier,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById
} from "../apis/api.js";

const SupplierDashboard = () => {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold text-white">
          Supplier Dashboard
        </h1>

        <button
          onClick={() => navigate("/supplier/create")}
          className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600"
        >
          + Create Supplier
        </button>

      </div>

      <GetAllSupplier />

    </div>
  );
};

const CreateSupplier = () => {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  const nameRef = useRef();

  useEffect(() => {

    nameRef.current.focus();

  }, []);

  const handleSubmit = async () => {

    try {

      if (!name || !phone || !address) {

        return alert("Fill all details");
      }

      await createSupplier({
        name,
        phone,
        address
      });

      alert("Supplier created successfully");

      navigate("/supplier");

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900">

      <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Supplier
        </h2>

        <input
          ref={nameRef}
          placeholder="Supplier Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <input
          type="number"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl outline-none"
        />

        <button
          onClick={handleSubmit}
          className="bg-pink-500 hover:bg-pink-600 text-white w-full p-3 rounded-xl"
        >
          Create Supplier
        </button>

      </div>
    </div>
  );
};

const GetAllSupplier = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchSuppliers = async () => {
    try {
      const res = await getSupplier(page,2, search);
      console.log("Suppliers:", res.data);
      setSuppliers(res.data.data);
      setPagination(res.data.getPagination);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, search]);

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-10">

    <input
        type="text"
        placeholder="Search Supplier..."
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {
          suppliers.map((supplier) => (

            <div
              key={supplier._id}
              onClick={() => navigate(`/supplier/get/${supplier._id}`)}
              className="bg-white/10 backdrop-blur-xl border border-white/20 
              rounded-2xl shadow-xl w-64 h-64 flex items-center justify-center
              cursor-pointer hover:scale-105 transition"
            >

              <h2 className="text-2xl font-bold text-white text-center">
                {supplier.name}
              </h2>

            </div>
          ))
        }

      </div>

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
          className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const GetSupplierById = () => {
  const navigate = useNavigate();
    const {id} = useParams();
    const [supplier, setSupplier] = useState(null);
    useEffect(() => {
        fetchSupplier();
    }, [id]);
    const fetchSupplier = async () => {
        try {
            const res = await getSupplierById(id);
            console.log(res.data);
            setSupplier(res.data.data);
        }catch (error) {
            console.log(error);
        }
    }
    if (!supplier) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl">
                <h1 className="text-white text-4xl font-bold animate-pulse">
                    Loading...
                </h1>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900">
            <div className="w-[350] h-[350px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6">
                <h1 className="text-3xl font-bold text-white  mb-6">
                     {supplier.name}
                </h1> 
                <p className=" text-white text-lg mb-3">
                    {supplier.phone}
                </p>

                <p className="text-white text-center">
                    {supplier.address}
                </p>
                <button
                    onClick={() => navigate(`/supplier/update/${supplier._id}`)}
                    className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl"
                >
                 Update Supplier
                </button>
                <button
                    onClick={() => navigate(`/supplier/delete/${supplier._id}`)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl"
                >
                   Delete Supplier
                </button>
                </div>
        </div>
    )
};

const UpdateSupplierById = () => {
    const {id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        fetchSupplier();
    }, []);
    const fetchSupplier = async () => {
        try{
            const res =  await getSupplierById(id);
            const supplier = res.data.data;
            setName(supplier.name);
            setPhone(supplier.phone);
            setAddress(supplier.address);
        } catch (error) {
            console.log(error);
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try{
            const updateData = {
                name,
                phone,
                address
            };
        await updateSupplierById(id, updateData);
        alert("supplier Updated");
        navigate("/supplier")
        } catch(error) {
          console.log(error);
          alert(error.message);
        }
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 ">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            update Supplier
          </h1>

          <input
          placeholder="supplier name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none"
          />

          <input
          placeholder="phone no"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl outline-none"
          />

          <input 
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl outline-none"
          />

          <button 
          onClick={handleUpdate}
          className="bg-pink-500 hover:bg-pink-600 text-white w-full p-3 rounded-xl"
          >
            update Supplier
          </button>

        </div>
      </div>
    )
}

const DeleteSupplierById = () => {
  const {id} =  useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  useEffect(() => {
    fetchSupplier();
  }, []);
  const fetchSupplier = async () => {
    try {
      const res = await getSupplierById(id);
      setSupplier(res.data.data);
    } catch (error) {
      console.log(error)
    }
  };
  const handleDelete = async () => {
    try{
      await deleteSupplierById(id);
      alert("supplier Deleted Successfully");
      navigate("/supplier");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };
  if(!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <h1 className="text-white text-4xl">
          loading
        </h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl  border-white/20 shadow-2xl">
      <h1 className="text-3xl font-bold text-white text-center mb-6">
        Delete supplier
      </h1>
      <div className="text-center text-white mb-8">
        <h2 className="text-2xl font-bold mb-3">
          {supplier.name}
        </h2>
        <p className="mb-2">
          {supplier.phone}
        </p>
        <p>
          {supplier.address}
        </p>
      </div>
      <button 
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white w-full p-3 rounded-xl"
      >
        Delete Supplier
      </button>
      </div>
    </div>
  )
}

export {
  SupplierDashboard,
  CreateSupplier,
  GetAllSupplier,
  GetSupplierById,
  UpdateSupplierById,
  DeleteSupplierById
};


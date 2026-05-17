import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createExpense,
    getExpenses,
    getExpensesById,
    updateExpensesById,
    deleteExpenseById
} from "../apis/api.js";

const ExpenseDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-indigo-900 to-black p-10">

      <div className="flex justify-between mb-10">
        <h1 className="text-4xl text-white font-bold">
          Expense Dashboard
        </h1>

        <button
          onClick={() => navigate("/expense/create")}
          className="bg-indigo-500 px-6 py-3 rounded-xl text-white"
        >
          + Create Expense
        </button>
      </div>

      <GetAllExpense />
    </div>
  );
};

const CreateExpense = () => {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleCreate = async () => {
    try {

      await createExpense({
        title,
        amount,
        category,
        date
      });

      alert("Expense Created");
      navigate("/expense");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">

      <div className="w-full max-w-md bg-white/10 p-8 rounded-3xl">

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl"
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl"
        />

        <button
          onClick={handleCreate}
          className="bg-indigo-500 w-full p-3 rounded-xl text-white"
        >
          Create
        </button>

      </div>
    </div>
  );
};

const GetAllExpense = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses(page, 2, search);
        console.log("API RESPONSE:", res.data);
        setExpenses(res.data.data || []);
        setTotalPages(res.data.pagination || 1); // IMPORTANT FIX
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpenses();
  }, [page, search]);

  return (
    <div>

      <div className="flex justify-center mb-10">
        <input
          placeholder="Search Expense..."
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

        {expenses.map((e) => (
          <div
            key={e._id}
            onClick={() => navigate(`/expense/get/${e._id}`)}
            className="bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40
            backdrop-blur-xl border border-white/20
            rounded-2xl shadow-xl w-64 h-64
            flex flex-col items-center justify-center
            cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {e.title}
            </h2>

            <p className="text-pink-300 text-lg font-semibold">
              ₹ {e.amount}
            </p>

            <p className="text-gray-300 mt-2">
              {e.category}
            </p>
          </div>
        ))}

      </div>

      <div className="flex justify-center gap-6 mt-10">

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl"
        >
          Prev
        </button>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl"
        >
          Next
        </button>

      </div>

    </div>
  );
};

const GetExpensesById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await getExpensesById(id);
        setExpense(res.data.data);
      } catch (error) {
        console.log("GET BY ID ERROR:", error);
      }
    };

    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteExpenseById(id);
      alert("Expense deleted successfully");
      navigate("/expense");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  if (!expense) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-indigo-900 to-black">

      <div className="w-[380px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-center">

        <h1 className="text-3xl font-bold text-white mb-4">
          {expense.title}
        </h1>

        <p className="text-pink-300 text-xl font-semibold mb-2">
          ₹ {expense.amount}
        </p>

        <p className="text-gray-300 mb-2">
          {expense.category}
        </p>

        <p className="text-gray-400 text-sm mb-6">
          {new Date(expense.date).toLocaleDateString()}
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">

          <button
            onClick={() => navigate(`/expense/update/${expense._id}`)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl transition"
          >
            Update Expense
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition"
          >
            Delete Expense
          </button>

        </div>

      </div>

    </div>
  );
};

const UpdateExpenseById = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const fetchExpense = async () => {
    try {
      const res = await getExpensesById(id);
      const e = res.data.data;

      setTitle(e.title);
      setAmount(e.amount);
      setCategory(e.category);
      setDate(e.date?.split("T")[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateExpensesById(id, {
        title,
        amount,
        category,
        date
      });

      alert("Expense Updated Successfully");
      navigate("/expense");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-indigo-900 to-black">

      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">

        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Update Expense
        </h1>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none
          bg-white/10 text-white placeholder:text-gray-300
          border border-white/20"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none
          bg-white/10 text-white placeholder:text-gray-300
          border border-white/20"
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl outline-none
          bg-white/10 text-white placeholder:text-gray-300
          border border-white/20"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl outline-none
          bg-white/10 text-white border border-white/20"
        />

        <button
          onClick={handleUpdate}
          className="bg-indigo-500 hover:bg-indigo-600 text-white w-full p-3 rounded-xl transition"
        >
          Update Expense
        </button>

      </div>

    </div>
  );
};

const DeleteExpenseById = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [expense, setExpense] = useState(null);

    useEffect(() => {
        fetchExpense();
    }, [id]);

    const fetchExpense = async () => {
        try {
            const res = await getExpensesById(id);
            setExpense(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteExpenseById(id);

            alert("Expense deleted successfully");

            navigate("/expense");

        } catch (error) {
            console.log(error);

            alert(error.message);
        }
    };

    if (!expense) {
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
                    Delete Expense
                </h1>

                <div className="text-center mb-8">

                    <h2 className="text-2xl font-bold mb-3 text-pink-300">
                        {expense.title}
                    </h2>

                    <p className="mb-2">
                        ₹ {expense.amount}
                    </p>

                    <p className="mb-2">
                        {expense.category}
                    </p>

                    <p className="text-sm text-gray-300">
                        {new Date(expense.date).toLocaleDateString()}
                    </p>

                </div>

                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/expense/delete/${e._id}`);
                    }}
                      className="bg-red-500 px-3 py-2 rounded-lg text-white"
                >
  Delete
</button>

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
    DeleteExpenseById
}
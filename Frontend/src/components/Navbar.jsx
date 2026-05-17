import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-gray-900 text-white flex gap-6 p-4 shadow-lg">

      <Link to="/login" className="hover:text-red-400">
        Login
      </Link>

      <Link to="/register" className="hover:text-red-400">
        Register
      </Link>
      <Link to="/supplier" className="hover:text-red-400">
      supplier
      </Link>
      <Link to="/product" className="hover:text-red-400">
      Product
      </Link>
      <Link to="/Customer" className="hover:text-red-400">
      Customer
      </Link>
      <Link to="/sales" className="hover:text-red-400">
      sales
      </Link>
      <Link to="/expense" className="hover:text-red-400">
      expense
      </Link>
    </div>
  );
}

export default Navbar;
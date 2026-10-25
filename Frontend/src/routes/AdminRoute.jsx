import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "admin";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && role !== "admin" && role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
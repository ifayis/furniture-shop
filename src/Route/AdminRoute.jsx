import { Navigate } from "react-router-dom";
import { getUserRole, isAuthenticated } from "@/utils/tokenService";

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();
  if (role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

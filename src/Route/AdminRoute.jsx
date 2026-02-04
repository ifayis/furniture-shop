import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserRole } from "@/utils/tokenService";

const AdminRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();

  if (role !== "Admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
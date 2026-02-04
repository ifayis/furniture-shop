import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserRole } from "@/utils/tokenService";

const ProtectedRoute = ({ allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const role = getUserRole();
    
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;

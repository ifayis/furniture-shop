import { Navigate, Outlet } from "react-router-dom";
import { getUserFromToken } from "../utils/jwtService";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

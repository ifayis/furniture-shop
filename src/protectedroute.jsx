import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role = "admin" }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== role) {
    alert("Access denied.admins only.");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

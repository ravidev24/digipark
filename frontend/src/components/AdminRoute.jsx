import React from "react";
import { Navigate } from "react-router-dom";
import { getDashboardRoute } from "../routes";

const AdminRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if ((user.role || "customer") !== "admin") return <Navigate to={getDashboardRoute(user.role)} replace />;
  return children;
};

export default AdminRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { getDashboardRoute } from "../routes";

const CustomerRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  const role = user.role || "customer";
  if (role === "admin") return <Navigate to={getDashboardRoute(role)} replace />;
  return children;
};

export default CustomerRoute;

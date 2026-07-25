import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../routes";

const SecureRoute = ({ user, children }) => {
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
};

export default SecureRoute;

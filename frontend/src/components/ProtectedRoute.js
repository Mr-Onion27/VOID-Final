import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ FIXED named import

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" state={{ error: "Session expired" }} />;

  try {
    const decoded = jwtDecode(token);

    const roleField = allowedRole === "student" ? "regno"
                   : allowedRole === "faculty" ? "fac_id"
                   : allowedRole === "admin" ? "adminID"
                   : null;

    if (!decoded || !decoded[roleField]) {
      return <Navigate to="/" state={{ error: "Unauthorized access" }} />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/" state={{ error: "Invalid session" }} />;
  }
};

export default ProtectedRoute;

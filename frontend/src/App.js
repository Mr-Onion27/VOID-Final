import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentLogin from "./components/StudentLogin";
import FacultyLogin from "./components/FacultyLogin";
import AdminLogin from "./components/AdminLogin";
import StudentDashboard from "./components/StudentDashboard";
import FacultyDashboard from "./components/FacultyDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Home from "./components/home";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import SessionGuard from "./sessionGuard"; // ✅ Ensure correct path here

function App() {
  return (
    <Router>
      <SessionGuard /> {/* ✅ Session validation logic runs globally */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/std_log" element={<StudentLogin />} />
        <Route path="/fac_log" element={<FacultyLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Add Forgot Password Route */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ✅ Protected Dashboards with Role Checks */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty-dashboard"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/admin_login.css"; // 👈 Rename your new cool CSS here
import eye1 from "../css/eye1.png";
import eye2 from "../css/eye2.png";
import Loader from '../components/Loader'; // 👈 Imported

function AdminLogin() {
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [adminID, setAdminID] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateAdminForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setShowNotification(false);

    if (!adminID.trim() || !password.trim()) {
      setErrorMessage("Both fields are required.");
      setShowNotification(true);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://13.200.192.185:5000/api/auth/admin/login",
        { adminID, password }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "admin");

      // alert("Login successful!"); ← Removed this line
      setLoading(true); // 👈 Show loader
      setTimeout(() => {
          navigate("/admin-dashboard");
      }, 100); // 👈 Delay for effect

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin_log">
                  {loading && <Loader />} {/* 👈 Loader here */}

      {showNotification && (
        <div className="notification">
          <i>⚠️</i> <span>{errorMessage}</span>
          <span
            className="close-btn"
            onClick={() => setShowNotification(false)}
          >
            ✖
          </span>
        </div>
      )}

      <div className="c2">
        <h2>Admin Login</h2>
        <form onSubmit={validateAdminForm}>
          <label htmlFor="user">Admin ID</label>
          <input
            id="user"
            type="text"
            placeholder="Enter Admin ID"
            value={adminID}
            onChange={(e) => setAdminID(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={passwordVisible ? eye2 : eye1}
              alt="Toggle visibility"
              className="toggle-password"
              onClick={togglePassword}
            />
          </div>
          <a href="/forgot-password">Forgot Password?</a>
          <input
            type="submit"
            value={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;

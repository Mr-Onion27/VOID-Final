import React, { useState } from "react";
import axios from "axios";
import "../css/s_log.css";
import { useNavigate } from "react-router-dom";
import eye1 from "../css/eye1.png";
import eye2 from "../css/eye2.png";
import Loader from '../components/Loader'; // ✅ Import at top

function StudentLogin() {
  const [showNotification, setShowNotification] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [Regno, setRegno] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null); // Store user data

  const navigate = useNavigate(); // ✅ Move useNavigate() here

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateStudentForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!Regno.trim() || !password.trim()) {
      setErrorMessage("Both fields are required.");
      setShowNotification(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://13.200.192.185:5000/api/auth/student/login",
        { Regno, password }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", "student");

      // Decode Token to Get User Info
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded); // Store user data in state
      setIsLoading(true); // ✅ Start loading
  
      setTimeout(() => {
        navigate("/student-dashboard"); // ✅ Navigate after delay
      }, 2000);
        } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div id="std_log">
              {isLoading && <Loader />}
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
        <h2>Student Login</h2>
        {user ? <h3>Welcome, {user.name}!</h3> : null}{" "}
        {/* Display Name After Login */}
        <form onSubmit={validateStudentForm}>
          <label htmlFor="user">Registration Number</label>
          <input
            type="text"
            placeholder="Registration Number"
            value={Regno}
            onChange={(e) => setRegno(e.target.value)}
            id="user"
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
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;

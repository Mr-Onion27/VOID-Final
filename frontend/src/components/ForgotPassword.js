import React, { useState } from "react";
import axios from "axios";
import "../css/ForgotPassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Reset Password
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student"); // Default to student, you can modify for dynamic role
  const [id, setId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        "http://13.200.192.185:5000/api/forgotPassword/send-otp",
        { role, id, email }
      );
      setMessage(response.data.message);
      setStep(2); // Proceed to the next step (reset password)
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        "http://13.200.192.185:5000/api/forgotPassword/reset",
        { role, id, email, otp, newPassword }
      );
      setMessage(response.data.message);
      setStep(1); // Reset to the first step or redirect to login page
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="forgot-password">
      {step === 1 ? (
        <div>
          <h2>Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter your ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleSendOtp}>Send OTP</button>
          {message && <p>{message}</p>}
        </div>
      ) : (
        <div>
          <h2>Reset Password</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;

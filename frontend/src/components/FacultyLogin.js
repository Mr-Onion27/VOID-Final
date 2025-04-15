import React, { useState } from 'react';
import axios from 'axios';
import '../css/f_log.css';
import eye1 from '../css/eye1.png';
import eye2 from '../css/eye2.png';
import Loader from '../components/Loader';

function FacultyLogin() {
    const [showNotification, setShowNotification] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [fac_id, setFacId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // ✅ Fix for loader state

    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateFacultyForm = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setShowNotification(false);
        setIsLoading(true); // ✅ Start loader immediately

        if (!fac_id.trim() || !password.trim()) {
            setIsLoading(false); // ❗Stop loader on validation error
            setErrorMessage('Both fields are required.');
            setShowNotification(true);
            return;
        }

        try {
            const response = await axios.post("http://13.200.192.185:5000/api/auth/faculty/login", { fac_id, password });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", "faculty");

            // Delay redirection to show the loader
            setTimeout(() => {
                window.location.href = "/faculty-dashboard";
            }, 2000);
        } catch (error) {
            setIsLoading(false); // ❗Stop loader on error
            setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        }
    };

    return (
        <div id="fac_log">
            {isLoading && <Loader />} {/* ✅ Loader visible when isLoading is true */}

            {showNotification && (
                <div className="notification">
                    <i>⚠️</i> <span>{errorMessage}</span>
                    <span className="close-btn" onClick={() => setShowNotification(false)}>✖</span>
                </div>
            )}

            <div className="c2">
                <h2>Faculty Login</h2>
                <form onSubmit={validateFacultyForm}>
                    <label htmlFor="user">Faculty ID</label>
                    <input
                        type="text"
                        id="user"
                        placeholder="Faculty ID"
                        value={fac_id}
                        onChange={(e) => setFacId(e.target.value)}
                    />

                    <label htmlFor="password">Password</label>
                    <div className="password-container">
                        <input
                            id="password"
                            type={passwordVisible ? 'text' : 'password'}
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

export default FacultyLogin;

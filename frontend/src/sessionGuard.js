// src/components/SessionGuard.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SessionGuard = () => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    const handlePageShow = (event) => {
      const navType = performance.getEntriesByType("navigation")[0]?.type;
      if ((event.persisted || navType === "back_forward") && (!token || !isLoggedIn)) {
        window.location.href = "/?error=500"; // Force to Home if session is invalid
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [location]);

  return null; // this component doesn't render anything
};

export default SessionGuard;

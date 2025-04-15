import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "../css/AdminDashboard.css";

const BASE_URL = "http://13.200.192.185:5000";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("pending");
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("light");
  const [apiError, setApiError] = useState(false);
  const [file, setFile] = useState(null); // State for file upload
  const [uploadStatus, setUploadStatus] = useState(""); // Status message for upload

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const fetchData = async (page) => {
    try {
      const routeMap = {
        pending: `${BASE_URL}/api/admin/pending-bookings`,
        approved: `${BASE_URL}/api/admin/approved-bookings`,
        rejected: `${BASE_URL}/api/admin/rejected-bookings`,
      };

      if (page !== "update") {
        const res = await axios.get(routeMap[page]);
        setBookings(res.data || []);
        setApiError(false);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setApiError(true);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchData(activePage); // Immediate fetch on tab change
  
    let intervalId;
  
    if (activePage === "pending") {
      intervalId = setInterval(() => {
        fetchData("pending"); // Refresh every 5 seconds
      }, 5000);
    }
  
    return () => clearInterval(intervalId); // Clean up when component unmounts or tab changes
  }, [activePage]);

  const handleExport = () => {
    if (bookings.length === 0) return alert("No data to export.");
    const exportData = bookings.map((b) => ({
      Classroom: b.classroomNumber,
      TeacherID: b.teacherId,
      Day: b.day,
      TimeSlot: b.timeSlot,
      Status: b.status,
      From: new Date(b.fromDate).toLocaleDateString(),
      To: new Date(b.toDate).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, `${activePage}_bookings.xlsx`);
  };

  const handleAction = async (action, id) => {
    try {
      const url = `${BASE_URL}/api/admin/${action}-booking/${id}`;
      await axios.post(url);
  
      // 🧹 Remove the item immediately from UI if on "pending" page
      if (activePage === "pending") {
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } else {
        // For other pages (like approved/rejected), re-fetch
        const res = await axios.get(`${BASE_URL}/api/admin/${activePage}-bookings`);
        setBookings(res.data || []);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);  // Store the selected file
  };

  const handleFileUpload = async (event) => {
    // Check if there are any files in the event
    const file = event.target.files ? event.target.files[0] : null;
    
    // If no file is selected, exit the function
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(`${BASE_URL}/api/uploadExcel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully:", response.data);
      setUploadStatus("File uploaded successfully!"); // Success message
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file. Please try again."); // Error message
    }
  };
  
  const filteredBookings = bookings.filter((booking) =>
    (booking?.classroomNumber || "").toLowerCase().includes(search.toLowerCase())
  );
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/admin-login"; // or use navigate("/student-login") if using react-router
  };

  return (
    <div className={`dashboard ${theme}`}>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <button onClick={() => setActivePage("pending")}>Pending</button>
        <button onClick={() => setActivePage("approved")}>Approved</button>
        <button onClick={() => setActivePage("rejected")}>Rejected</button>
        <button onClick={() => setActivePage("update")}>Update DB</button>

        <div className="toggle-theme">
          <label>
            <input type="checkbox" onChange={toggleTheme} />
            {theme === "light" ? "🌞 Light" : "🌙 Dark"}
          </label>
        </div>
      </aside>

      <main className="main-content">
        <h2>{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Requests</h2>

        {activePage !== "update" && (
          <div className="controls">
            <input
              type="text"
              placeholder="Search by classroom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleExport}>Export to Excel</button>
          </div>
        )}

        {activePage === "update" ? (
          <div className="update-db">
          <p style={{ marginTop: "20px" }}>
            ⚙️ This section is reserved for database update functions.
          </p>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
          />
          <button onClick={handleFileUpload}>Upload and Update</button>
          
          {uploadStatus && (
            <p 
              style={{ 
                color: uploadStatus.includes("successfully") ? "green" : "red", 
                marginTop: "20px" 
              }}
            >
              {uploadStatus}
            </p>
          )}
        </div>        
        ) : apiError ? (
          <p style={{ color: "red", marginTop: "20px" }}>
            ⚠️ Failed to load data. Please check the server.
          </p>
        ) : filteredBookings.length === 0 ? (
          <p style={{ fontStyle: "italic", marginTop: "20px" }}>
            No {activePage} bookings found.
          </p>
        ) : (
          <div className="booking-list">
            {filteredBookings.map((booking, index) => (
              <div className="booking-card" key={booking?._id || index}>
                <div>
                  <strong>Classroom:</strong> {booking?.classroomNumber || "N/A"}
                </div>
                <div>
                  <strong>Teacher ID:</strong> {booking?.teacherId || "N/A"}
                </div>
                <div>
                  <strong>Day:</strong> {booking?.day || "N/A"}
                </div>
                <div>
                  <strong>Time Slot:</strong> {booking?.timeSlot || "N/A"}
                </div>
                <div>
                  <strong>From:</strong>{" "}
                  {booking?.fromDate ? new Date(booking.fromDate).toDateString() : "N/A"}
                </div>
                <div>
                  <strong>To:</strong>{" "}
                  {booking?.toDate ? new Date(booking.toDate).toDateString() : "N/A"}
                </div>
                <div className={`status ${booking?.status || "unknown"}`}>
                  {booking?.status || "N/A"}
                </div>

                {activePage === "pending" && (
                  <div className="actions">
                    <button onClick={() => handleAction("approve", booking._id)}>
                      Approve
                    </button>
                    <button onClick={() => handleAction("reject", booking._id)}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

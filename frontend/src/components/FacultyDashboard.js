import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/facultyDashboard.css";

function FacultyDashboard() {
  const [user, setUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedTime, setSelectedTime] = useState("8:00 AM - 8:50 AM");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [statusPopup, setStatusPopup] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [myBookings, setMyBookings] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "8:00 AM - 8:50 AM",
    "9:00 AM - 9:50 AM",
    "10:00 AM - 10:50 AM",
    "11:00 AM - 11:50 AM",
    "12:00 PM - 12:50 PM",
    "2:00 PM - 2:50 PM",
    "3:00 PM - 3:50 PM",
    "4:00 PM - 4:50 PM",
    "5:00 PM - 5:50 PM",
    "6:00 PM - 6:50 PM",
  ];
  const blocks = [
    "SJT",
    "TT",
    "MGB",
    "ALM",
    "CDMM",
    "GDN",
    "PRP",
    "CTS",
    "SMV",
    "MB",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(
          decodeURIComponent(escape(atob(token.split(".")[1])))
        );
        setUser(payload);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Zoho SalesIQ widget
    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || { ready: function () {} };

    const script = document.createElement("script");
    script.id = "zsiqscript";
    script.src =
      "https://salesiq.zohopublic.in/widget?wc=siq2dab1155e8bad6e2d3668942acddf91e6d835fafb23d9e0299ccb14e6e50bbd3";
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById("zsiqscript");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (user?.fac_id) {
      fetchMyBookings(user.fac_id);
    }
  }, [user]);

  const fetchMyBookings = async (facId) => {
    try {
      const res = await axios.get(
        `http://13.200.192.185:5000/api/bookings/my/${facId}`
      );
      setMyBookings(res.data);
    } catch (error) {
      console.error("Error fetching my bookings:", error.message);
    }
  };

  const handleBlockCheckboxChange = (block) => {
    setSelectedBlocks((prev) =>
      prev.includes(block) ? prev.filter((b) => b !== block) : [...prev, block]
    );
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "http://13.200.192.185:5000/api/classrooms/available-rooms",
        {
          params: { day: selectedDay, time: selectedTime },
        }
      );

      const allRooms = response.data;

      const filtered =
        selectedBlocks.length > 0
          ? allRooms.filter((room) => {
              const roomStr = (
                room["ROOM NUMBER"] ||
                room.roomNumber ||
                ""
              ).toUpperCase();
              const blockMatch = roomStr.match(/^[A-Z]+/);
              const block = blockMatch ? blockMatch[0] : "";
              return selectedBlocks.includes(block);
            })
          : allRooms;

      setAvailableRooms(allRooms);
      setFilteredRooms(filtered);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      setAvailableRooms([]);
      setFilteredRooms([]);
    }
  };

  const handleReset = () => {
    setSelectedDay("Monday");
    setSelectedTime("8:00 AM - 8:50 AM");
    setSelectedBlocks([]);
    setSearchTerm("");
    setFilteredRooms(availableRooms);
  };

  const groupedRooms = filteredRooms.reduce((acc, room) => {
    const roomStr = (
      room["ROOM NUMBER"] ||
      room.roomNumber ||
      ""
    ).toUpperCase();
    const blockMatch = roomStr.match(/^[A-Z]+/);
    const block = blockMatch ? blockMatch[0] : "Others";
    if (!acc[block]) acc[block] = [];
    acc[block].push(room);
    return acc;
  }, {});

  const handleRoomClick = (room) => {
    const roomNumber = room["ROOM NUMBER"] || room.roomNumber;
    setSelectedRoom(roomNumber);
    setFromDate("");
    setToDate("");
  };

  const isFutureDate = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    return date > today;
  };

  const confirmBooking = async () => {
    if (!fromDate || !toDate) {
      setStatusPopup({
        show: true,
        message: "Please select both From and To dates.",
        type: "error",
      });
      return;
    }

    if (!isFutureDate(fromDate) || !isFutureDate(toDate)) {
      setStatusPopup({
        show: true,
        message: "Dates must be in the future.",
        type: "error",
      });
      return;
    }

    try {
      await axios.post("http://13.200.192.185:5000/api/bookings/request", {
        classroomNumber: selectedRoom,
        day: selectedDay,
        timeSlot: selectedTime,
        fromDate,
        toDate,
        teacherId: user.fac_id,
      });

      setSelectedRoom(null);
      setStatusPopup({
        show: true,
        message: `Booking request for ${selectedRoom} submitted!`,
        type: "success",
      });

      await fetchMyBookings(user.fac_id);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Booking request failed.";
      setStatusPopup({
        show: true,
        message: errorMessage,
        type: "error",
      });
      setSelectedRoom(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/fac_log"; // or use navigate("/student-login") if using react-router
  };

  return (
    <div className="dashboard-wrapper">
      {user ? (
        <div className="dashboard-header">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div className="dashboard-container">
        <h1>Faculty Dashboard</h1>
        {user ? <h2>Welcome, Prof. {user.name}!</h2> : <p>Loading...</p>}

        <div className="selection-container">
          <label htmlFor="day">Day:</label>
          <select
            id="day"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {days.map((day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))}
          </select>

          <label htmlFor="time">Time:</label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            {timeSlots.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>

          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="block-filter">
          {blocks.map((block, index) => (
            <label key={index} className="block-checkbox">
              <input
                type="checkbox"
                value={block}
                checked={selectedBlocks.includes(block)}
                onChange={() => handleBlockCheckboxChange(block)}
              />
              {block}
            </label>
          ))}
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="room-search-input"
          />
        </div>

        <div className="room-container">
          <h3>Available Rooms</h3>
          {Object.keys(groupedRooms).length > 0 ? (
            Object.entries(groupedRooms).map(([block, rooms]) => {
              const filteredBySearch = rooms.filter((room) =>
                (room["ROOM NUMBER"] || room.roomNumber || "")
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              );
              if (filteredBySearch.length === 0) return null;
              return (
                <div
                  key={block}
                  className="block-group"
                  style={{ marginTop: "6rem" }}
                >
                  <h4>{block}</h4>
                  <div className="room-grid">
                    {filteredBySearch.map((room, idx) => (
                      <button
                        key={idx}
                        className="room-box"
                        onClick={() => handleRoomClick(room)}
                      >
                        {room["ROOM NUMBER"] ||
                          room.roomNumber ||
                          "No Room Name"}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No rooms available for this slot.</p>
          )}
        </div>

        <div className="my-bookings">
          <h3>My Bookings</h3>
          {myBookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <ul>
              {myBookings.map((booking, idx) => (
                <li
                  key={booking._id || idx}
                  className={`booking-item ${booking.status}`}
                >
                  <strong>{booking.classroomNumber}</strong> — {booking.day},{" "}
                  {booking.timeSlot}
                  <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
                    ({booking.status})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Booking Popup */}
        {selectedRoom && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>Confirm Booking</h3>
              <p>
                Book <strong>{selectedRoom}</strong> on{" "}
                <strong>{selectedDay}</strong> at{" "}
                <strong>{selectedTime}</strong>
              </p>
              <div className="popup-dates">
                <label>
                  From Date:
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </label>
                <label>
                  To Date:
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </label>
              </div>
              <div className="popup-buttons">
                <button className="confirm-button" onClick={confirmBooking}>
                  Book Classroom
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setSelectedRoom(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Popup */}
        {statusPopup.show && (
          <div className="popup-overlay">
            <div className={`popup-box ${statusPopup.type}`}>
              <p>{statusPopup.message}</p>
              <div className="popup-buttons">
                <button
                  onClick={() =>
                    setStatusPopup({ ...statusPopup, show: false })
                  }
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyDashboard;

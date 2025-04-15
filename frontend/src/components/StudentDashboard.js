import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/studentDashboard.css";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedTime, setSelectedTime] = useState("8:00 AM - 8:50 AM");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const blocks = ["SJT", "TT", "MGB", "ALM", "CDMM", "GDN", "PRP", "CTS", "SMV", "MB"];

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

  const handleBlockCheckboxChange = (block) => {
    if (selectedBlocks.includes(block)) {
      setSelectedBlocks(selectedBlocks.filter((b) => b !== block));
    } else {
      setSelectedBlocks([...selectedBlocks, block]);
    }
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

      const filtered = selectedBlocks.length > 0
        ? allRooms.filter((room) => {
            const roomStr = (room["ROOM NUMBER"] || room.roomNumber || "").toUpperCase();
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
    setAvailableRooms([]);
    setFilteredRooms([]);
  };

  const groupedRooms = filteredRooms.reduce((acc, room) => {
    const roomStr = (room["ROOM NUMBER"] || room.roomNumber || "").toUpperCase();
    const blockMatch = roomStr.match(/^[A-Z]+/);
    const block = blockMatch ? blockMatch[0] : "Others";
    if (!acc[block]) acc[block] = [];
    acc[block].push(room);
    return acc;
  }, {});

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/std_log";
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
        <h1>Student Dashboard</h1>
        {user ? <h2>Welcome, {user.name}!</h2> : <p>Loading...</p>}

        {/* Selection Form */}
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

        {/* Block Filters */}
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

        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="room-search-input"
          />
        </div>

        {/* Available Rooms */}
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
                <div key={block} className="block-group">
                  <h4>{block}</h4>
                  <div className="room-grid">
                    {filteredBySearch.map((room, idx) => (
                      <button
                        key={idx}
                        className="room-box"
                      >
                        {room["ROOM NUMBER"] || room.roomNumber || "No Room Name"}
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
      </div>
    </div>
  );
}

export default StudentDashboard;

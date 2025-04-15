import express from "express";
import Classroom from "../models/ClassroomModel.js";
import BookedClassroom from "../models/bookedClassroom.js"; // ✅ Import the booked collection


const router = express.Router();

router.get("/available-rooms", async (req, res) => {
  try {
    const { day, time } = req.query;

    if (!day || !time) {
      return res.status(400).json({ message: "Missing required query parameters: day or time" });
    }

    const decodedDay = decodeURIComponent(day).trim();
    const decodedTime = decodeURIComponent(time).trim();

    // Normalize dash variations & remove leading zero from hours
    const fixedTime = decodedTime
      .replace(/–/g, "-")  // Convert en-dash to hyphen
      .replace(/^0(\d:)/, "$1")  // Remove leading zero from hour
      .trim();

    const formattedQuery = `${decodedDay} ${fixedTime}`;

    console.log("✅ Received Query Params:", { decodedDay, decodedTime });
    console.log("✅ Adjusted Time (No Leading Zero on Hour Only):", fixedTime);
    console.log("✅ Formatted Query String:", formattedQuery);

    // Use regex query to handle minor formatting differences
    const regexQuery = new RegExp(`^${decodedDay}\\s+${fixedTime.replace(/-/g, ".*")}$`, "i");

    let availableRooms = await Classroom.find({ "Slot Timings": { $regex: regexQuery } });

    // ✅ Filter out rooms that are booked
    const bookedRooms = await BookedClassroom.find({ day: decodedDay, timeSlot: fixedTime });
    const bookedRoomNumbers = bookedRooms.map(room => room.classroomNumber);
    availableRooms = availableRooms.filter(
      room => !bookedRoomNumbers.includes(room["ROOM NUMBER"])
    );

    if (availableRooms.length === 0) {
      console.log("❌ No matching slots found. Fetching all slot timings for debugging...");
      const allSlots = await Classroom.find({}, { "Slot Timings": 1, _id: 0 });
      console.log("🔍 All Slot Timings in DB:", allSlots);
    }

    console.log("🎯 Query Result:", availableRooms);

    res.json(
      availableRooms.map((room) => ({
        _id: room._id,
        roomNumber: room["ROOM NUMBER"],
        slot: room.SLOT,
        slotTimings: room["Slot Timings"],
      }))
    );
  } catch (error) {
    console.error("❌ Error fetching classrooms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

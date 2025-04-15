import express from "express";
import Booking from "../models/bookingRequest.js";

const router = express.Router();

// Route to submit a booking request
router.post("/request", async (req, res) => {
    try {
      const {
        classroomNumber,
        day,
        timeSlot,
        fromDate,
        toDate,
        teacherId,
      } = req.body;
  
      console.log("Incoming booking request:", req.body);
  
      if (!classroomNumber || !day || !timeSlot || !fromDate || !toDate || !teacherId) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      // 👇 Check if the room is already booked (any status except rejected)
      const existing = await Booking.findOne({
        classroomNumber,
        day,
        timeSlot,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        status: { $ne: "rejected" }, // prevent only pending/approved conflicts
      });
  
      if (existing) {
        return res.status(409).json({ error: "This room is already booked for the selected time slot." });
      }
  
      const newBooking = new Booking({
        classroomNumber,
        day,
        timeSlot,
        fromDate,
        toDate,
        teacherId,
        status: "pending",
      });
  
      await newBooking.save();
      res.status(201).json({ message: "Booking request submitted successfully." });
    } catch (error) {
      console.error("Error submitting booking request:", error.message);
      res.status(500).json({ error: error.message || "Failed to submit booking." });
    }
  });
  
router.get("/my/:fac_id", async (req, res) => {
    try {
      const bookings = await Booking.find({ teacherId: req.params.fac_id }).sort({ createdAt: -1 });
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching faculty bookings:", error.message);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

export default router;

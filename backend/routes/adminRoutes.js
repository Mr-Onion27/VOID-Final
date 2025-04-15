  import express from "express";
  import Booking from "../models/bookingRequest.js";
  import BookedClassroom from "../models/bookedClassroom.js   ";
  import Faculty from "../models/Faculty.js"; // 👈 Add this
  import sendMail from "../utils/sendMail.js"; // 👈 Add this (adjust path if needed)

  const router = express.Router();


  // Get all booking requests
  router.get("/bookings", async (req, res) => {
      try {
          const bookings = await Booking.find().populate("facultyId"); // assuming you have a faculty ref
          res.status(200).json(bookings);
      } catch (error) {
          console.error("Error fetching bookings:", error);
          res.status(500).json({ message: "Failed to fetch bookings" });
      }
  });
  
  // Get all pending bookings
  router.get("/pending-bookings", async (req, res) => {
    try {
      const bookings = await Booking.find({ status: "pending" });
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get all approved bookings
  router.get("/approved-bookings", async (req, res) => {
    try {
      const bookings = await Booking.find({ status: "approved" });
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching approved bookings:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get all rejected bookings
  router.get("/rejected-bookings", async (req, res) => {
    try {
      const bookings = await Booking.find({ status: "rejected" });
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching rejected bookings:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Approve booking
  router.post("/approve-booking/:id", async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ error: "Booking not found" });

      booking.status = "approved";
      await booking.save();

      const booked = new BookedClassroom({
        classroomNumber: booking.classroomNumber,
        day: booking.day,
        timeSlot: booking.timeSlot,
        bookedBy: booking.teacherId,
        fromDate: booking.fromDate,
        toDate: booking.toDate,
      });
      await booked.save();

      // Get faculty email
    const faculty = await Faculty.findOne({ fac_id: booking.teacherId });
    if (faculty && faculty.email) {
      const subject = "Booking Approved";
      const message = `Dear, \n\t Prof. ${faculty.name},\n\nYour booking has been approved.\n\nDetails:\nClassroom: ${booking.classroomNumber}\nDay: ${booking.day}\nTime Slot: ${booking.timeSlot}\nFrom: ${booking.fromDate}\nTo: ${booking.toDate}\n\nRegards,\nAdmin\nTeam VOID-CLASS`;
      await sendMail(faculty.email, subject, message);
    }

    res.status(200).json({ message: "Booking approved and email sent." });
      
    } catch (error) {
      console.error("Error approving booking:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Reject booking
  router.post("/reject-booking/:id", async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ error: "Booking not found" });

      booking.status = "rejected";
      await booking.save();

     // Get faculty email
    const faculty = await Faculty.findOne({ fac_id: booking.teacherId });
    if (faculty && faculty.email) {
      const subject = "Booking Rejected";
      const message = `Dear \n\t Prof. ${faculty.name},\n\nUnfortunately, your booking request has been rejected.\n\nDetails:\nClassroom: ${booking.classroomNumber}\nDay: ${booking.day}\nTime Slot: ${booking.timeSlot}\nFrom: ${booking.fromDate}\nTo: ${booking.toDate}\n\nRegards,\nAdmin\nTeam VOID-CLASS`;
      await sendMail(faculty.email, subject, message);
    }

    res.status(200).json({ message: "Booking rejected and email sent." });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    res.status(500).json({ error: "Server error" });
  }
});

  export default router;

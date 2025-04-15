// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  classroomNumber: { type: String, required: true },
  day: { type: String, required: true }, // e.g., "Monday"
  timeSlot: { type: String, required: true },
  teacherId: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;

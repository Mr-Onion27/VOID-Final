// models/BookedClassroom.js
import mongoose from "mongoose";

const bookedClassroomSchema = new mongoose.Schema({
  classroomNumber: { type: String, required: true },
  day: { type: String, required: true },
  timeSlot: { type: String, required: true },
  bookedBy: { type: String, required: true }, // teacherId
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
});

// ✅ Model name should be "BookedClassroom", not the schema name
const BookedClassroom = mongoose.model("BookedClassroom", bookedClassroomSchema);

export default BookedClassroom;

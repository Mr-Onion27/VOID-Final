import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  Regno: String,
  name: String,
  password: String,
  email: String,
  last_visited: Date,
  otp: String
}, { collection: "student" }); // 👈 Force collection name

const Student = mongoose.model("Student", studentSchema);

export default Student;

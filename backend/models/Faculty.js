import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
    name: String,
    fac_id: String,
    password: String,
    email: String,
    last_visited: Date,
    otp: String
});

export default mongoose.model("Faculty", FacultySchema, "faculty"); 
// 👈 Forces collection name to be "faculty"


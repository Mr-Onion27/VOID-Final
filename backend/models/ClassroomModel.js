import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true },  // Room number (e.g., "SMV126")
    slot: { type: String, required: true },        // Slot identifier (e.g., "L2")
    "Slot Timings": { type: String, required: true }  // Time slot (e.g., "Monday 8:51 AM - 9:40 AM")
},{ strict: false });

const Classroom = mongoose.model("Classroom", classroomSchema,"availability");

export default Classroom;

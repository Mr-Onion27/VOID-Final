import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    adminID: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String, default: null },
});

const Admin = mongoose.model("Admin", AdminSchema,"admin");
export default Admin;

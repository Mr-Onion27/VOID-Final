import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Student Login Route
router.post("/student/login", async (req, res) => {
  const { Regno, password } = req.body;

  try {
    const student = await Student.findOne({
      Regno: { $regex: new RegExp("^" + Regno + "$", "i") },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: student._id,
        regno: student.Regno,
        name: student.name,
        role: "student",
      },
      process.env.JWT_SECRET_STUDENT,
      { expiresIn: "10d" }
    );

    res.status(200).json({ message: "Login successful", token, role: "student" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Faculty Login Route
router.post("/faculty/login", async (req, res) => {
  const { fac_id, password } = req.body;

  try {
    const faculty = await Faculty.findOne({ fac_id });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: faculty._id,
        fac_id: faculty.fac_id,
        name: faculty.name,
        role: "faculty",
      },
      process.env.JWT_SECRET_FACULTY,
      { expiresIn: "10d" }
    );

    res.status(200).json({ message: "Login successful", token, role: "faculty" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin Login Route
router.post("/admin/login", async (req, res) => {
  const { adminID, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminID });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        adminID: admin.adminID,
        name: admin.name,
        role: "admin",
      },
      process.env.JWT_SECRET_ADMIN,
      { expiresIn: "10d" }
    );

    res.status(200).json({ message: "Login successful", token, role: "admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

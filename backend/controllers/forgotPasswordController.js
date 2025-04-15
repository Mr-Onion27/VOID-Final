import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Admin from "../models/Admin.js";

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility to pick model
const getModelByRole = (role) => {
  if (role === "student") return Student;
  if (role === "faculty") return Faculty;
  if (role === "admin") return Admin;
};

// Step 1: Send OTP
export const sendOTP = async (req, res) => {
  const { role, id, email } = req.body;
  const Model = getModelByRole(role);

  try {
    const query =
      role === "student" ? { Regno: id, email } :
      role === "faculty" ? { fac_id: id, email } :
      { adminID: id, email };

    const user = await Model.findOne(query);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Model.updateOne(query, { otp });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting password is ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Step 2: Validate password strength
const isPasswordValid = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  return regex.test(password);
};

// Step 3: Reset password
export const resetPassword = async (req, res) => {
  const { role, id, email, otp, newPassword } = req.body;
  const Model = getModelByRole(role);

  try {
    const query =
      role === "student" ? { Regno: id, email } :
      role === "faculty" ? { fac_id: id, email } :
      { adminID: id, email };

    const user = await Model.findOne(query);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!isPasswordValid(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const update = await Model.updateOne(query, {
      password: hashedPassword,
      otp: null, // Clear OTP after successful reset
    });

    if (update.modifiedCount === 0) {
      return res.status(400).json({ message: "Password not updated" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

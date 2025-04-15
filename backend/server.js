import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import classroomRoutes from './routes/classroomRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookings.js';
import { protectStudent, protectFaculty, protectAdmin } from './middleware/authMiddleware.js';
import './cron/cleanup.js';
import forgotPasswordRoute from './routes/forgotPassword.js';
import uploadExcelRoute from './routes/uploadExcel.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/forgotPassword", forgotPasswordRoute);
app.use('/api/uploadExcel', uploadExcelRoute);
// Protected Dashboard Routes
app.get("/api/student/dashboard", protectStudent, (req, res) => {
  res.status(200).json({ message: "Welcome to the student dashboard" });
});

app.get("/api/faculty/dashboard", protectFaculty, (req, res) => {
  res.status(200).json({ message: "Welcome to the faculty dashboard" });
});

app.get("/api/admin/dashboard", protectAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

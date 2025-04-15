import express from 'express';
import { sendOTP, resetPassword } from '../controllers/forgotPasswordController.js';

const router = express.Router();

// @route   POST /api/forgot-password/send-otp
// @desc    Send OTP to user's email
router.post("/send-otp", sendOTP);

// @route   POST /api/forgot-password/reset
// @desc    Reset password with OTP
router.post("/reset", resetPassword);
  
export default router;

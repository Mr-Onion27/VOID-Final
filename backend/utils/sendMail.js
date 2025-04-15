import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config(); // 👈 This loads your .env values into process.env

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password, not your Gmail password
  },
});

const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"VOIDCLASS Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("Email sent to", to);
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

export default sendMail;

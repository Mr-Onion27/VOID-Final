import cron from "node-cron";
import BookedClassroom from "../models/bookedClassroom.js";

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Strip time

  try {
    const result = await BookedClassroom.deleteMany({
      toDate: { $lt: today },
    });
    console.log(`[CRON] Cleared ${result.deletedCount} expired classroom bookings`);
  } catch (err) {
    console.error("[CRON] Cleanup failed:", err.message);
  }
});

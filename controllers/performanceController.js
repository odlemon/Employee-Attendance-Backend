import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const evaluatePerformance = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    // Log the user's data for debugging
    console.log("User Data:", user);

    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the current month
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // End of the current month

    let totalHoursWorked = 0;
    let daysAbsent = 0;
    let daysPresent = 0;

    // Process activity logs
    const workDays = {};

    // Log activity logs for debugging
    console.log("Activity Logs:", user.activityLogs);

    // Iterate through the activity logs to calculate hours and attendance
    user.activityLogs.forEach(log => {
      const loginTime = new Date(log.loginTime);
      const logoutTime = log.logoutTime ? new Date(log.logoutTime) : null;

      // Check if the log falls within the evaluation period
      if (loginTime >= startDate && loginTime <= endDate) {
        // Calculate hours worked
        if (logoutTime) {
          const hoursWorked = (logoutTime - loginTime) / (1000 * 60 * 60); // Convert milliseconds to hours
          totalHoursWorked += hoursWorked;

          // Mark the day as present
          const workDay = loginTime.toDateString();
          workDays[workDay] = (workDays[workDay] || 0) + hoursWorked;
        }
      }
    });

    // Log calculated workDays for debugging
    console.log("Work Days:", workDays);

    // Determine present and absent days based on workDays and the total number of workdays in the month
    const totalDaysInMonth = endDate.getDate();
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toDateString();

      if (workDays[dateString]) {
        daysPresent += 1; // Count present days
      } else {
        daysAbsent += 1; // Count absent days
      }
    }

    const performanceRating = {
      hoursWorked: totalHoursWorked,
      daysAbsent: daysAbsent,
      daysPresent: daysPresent,
    };

    // Log the final performance rating for debugging
    console.log("Performance Rating:", performanceRating);

    res.status(200).json({ status: true, performance: performanceRating });
  } catch (error) {
    console.error("Error in evaluatePerformance:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
});




export { evaluatePerformance };
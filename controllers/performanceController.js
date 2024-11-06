import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const evaluatePerformance = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ status: false, message: "User not found." });
    }

    console.log("User Data:", user); // Log user data

    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the current month
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // End of the current month

    console.log("Current Date:", currentDate);
    console.log("Evaluation Period:", { startDate, endDate }); // Log start and end of month

    let totalHoursWorked = 0;
    let daysPresent = 0;
    let absentDays = [];
    const actualDaysPresent = []; // Array to store detailed attendance

    const workDays = {};

    // Time boundaries in hours (24-hour format)
    const startHour = 8; // 8 AM
    const endHour = 16;  // 4 PM

    console.log("Activity Logs:", user.activityLogs); // Log all activity logs

    // Iterate through the activity logs to calculate hours and attendance
    user.activityLogs.forEach(log => {
      const loginTime = new Date(log.loginTime);
      let logoutTime = log.logoutTime ? new Date(log.logoutTime) : null;
    
      // Check if the log falls within the evaluation period
      if (loginTime >= startDate && loginTime <= endDate) {
        // Adjust login time if it falls before 8 AM
        const adjustedLoginTime = new Date(loginTime);
        let adjustedLogoutTime = logoutTime ? new Date(logoutTime) : null;
    
        if (loginTime.getHours() < startHour) {
          adjustedLoginTime.setHours(startHour, 0, 0); // Set to 8 AM if before
        }
    
        // If no logout time is available, set logout time as "still logged in"
        if (!logoutTime) {
          adjustedLogoutTime = "still logged in";
        } else if (logoutTime.getHours() > endHour) {
          adjustedLogoutTime.setHours(endHour, 0, 0); // Set to 4 PM as default logout time
        }
    
        // Calculate hours worked if there's a valid logout time
        if (adjustedLogoutTime !== "still logged in" && adjustedLogoutTime > adjustedLoginTime) {
          const hoursWorked = (adjustedLogoutTime - adjustedLoginTime) / (1000 * 60 * 60); // Convert ms to hours
          totalHoursWorked += hoursWorked;
    
          // Mark the day as present
          const workDay = adjustedLoginTime.toDateString();
          workDays[workDay] = (workDays[workDay] || 0) + hoursWorked;
        }
    
        // Check for duplicates in actualDaysPresent
        const workDay = adjustedLoginTime.toDateString();
        const existingEntry = actualDaysPresent.find(entry => entry.date === workDay);
        if (!existingEntry) {
          // Convert adjusted login and logout times to UTC strings
          const adjustedLoginTimeUTC = adjustedLoginTime.toISOString().split("T")[1]; // Get only time in UTC
          const adjustedLogoutTimeUTC = adjustedLogoutTime === "still logged in"
            ? "still logged in"
            : adjustedLogoutTime.toISOString().split("T")[1];
    
          // Store the actual day present with UTC login and logout times
          actualDaysPresent.push({
            date: workDay,
            loginTime: adjustedLoginTimeUTC, // UTC formatted login time
            logoutTime: adjustedLogoutTimeUTC // UTC formatted logout time or "still logged in"
          });
        }
      }
    });
    

    console.log("Work Days (with hours worked):", workDays); // Log days with hours worked

    // Determine present and absent days based on workDays and the total number of days in the current month
    const totalDaysInMonth = endDate.getDate();
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toDateString();

      if (workDays[dateString]) {
        daysPresent += 1; // Count present days
      } else {
        absentDays.push(dateString); // Add to absent days if there was no login activity
      }
    }

    console.log("Absent Days:", absentDays); // Log absent days
    console.log("Days Present:", daysPresent); // Log count of days present
    console.log("Total Hours Worked:", totalHoursWorked); // Log total hours worked

    const performanceRating = {
      hoursWorked: totalHoursWorked,
      daysPresent: daysPresent,
      actualDaysPresent: actualDaysPresent, // Now includes login and logout times
      daysAbsent: absentDays.length,
      absentDays: absentDays, // List of absent days
    };

    console.log("Performance Rating:", performanceRating); // Log the final performance rating

    res.status(200).json({ status: true, performance: performanceRating });
  } catch (error) {
    console.error("Error in evaluatePerformance:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

export { evaluatePerformance };

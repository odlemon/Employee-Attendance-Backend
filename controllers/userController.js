import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import createJWT from "../utils/index.js";
import Notice from "../models/notis.js";
import crypto from 'crypto';

function generateRandomPassword(length = 10) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  // Check if the user exists
  if (!user) {
    return res.status(401).json({
      status: false,
      message: "Invalid email or password.",
    });
  }

  // Check if the user's account is active
  if (!user.isActive) {
    return res.status(401).json({
      status: false,
      message: "User account has been deactivated, contact the administrator",
    });
  }

  // Verify the password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      status: false,
      message: "Invalid email or password.",
    });
  }

  // Record the login time
  await user.logLogin();

  // Generate JWT token
  const token = createJWT(res, user._id);

  // Prepare user response without password
  const responseUser = {
    ...user.toObject(),
    token,
  };
  delete responseUser.password;

  // Send the response
  res.status(200).json(responseUser);
});



const registerUser = asyncHandler(async (req, res) => {
  const { name, email, isAdmin, title } = req.body;

  try {

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ status: false, message: "Email address already exists" });
    }

    const password = generateRandomPassword();

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      title,
    });

    if (user) {
      if (isAdmin) {
        createJWT(res, user._id);
      }

      user.password = password;

      res.status(201).json({
        ...user.toObject(),
        password,
        message: "User registered successfully. Login details are included in the response."
      });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
});


const logoutUser = asyncHandler(async (req, res) => {
  // Log the request body to the terminal
  console.log(req.body);



  const userId = req.body.id;

  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update the last login activity with the logout time
  const lastActivity = user.activityLogs[user.activityLogs.length - 1];
  if (lastActivity && !lastActivity.logoutTime) {
    lastActivity.logoutTime = new Date();
    await user.save();
  }

  // Clear the token cookie
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  // Send the response
  res.status(200).json({ message: "Logged out successfully" });
});




const getTeamList = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    query = { ...query, ...searchQuery };
  }

  const users = await User.find(query).select("name title email isActive");

  res.status(201).json(users);
});

const getNotificationsList = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const notice = await Notice.find({
    team: userId,
    isRead: { $nin: [userId] },
  })
    .populate("task", "title")
    .sort({ _id: -1 });

  res.status(201).json(notice);
});

const markNotificationRead = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }
    res.status(201).json({ status: true, message: "Done" });
  } catch (error) {
    console.log(error);
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    
    const { _id } = req.body; // Get the ID directly from the request body

    const user = await User.findById(_id);

    if (user) {
      // Update user fields
      user.name = req.body.name || user.name;
      // user.email = req.body.email || user.email; // Uncomment if email should be updated
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;
      user.department = req.body.department || user.department;
      user.profilePicture = req.body.profilePictureURL || user.profilePicture;
      user.branch = req.body.branch || user.branch;

      const updatedUser = await user.save();

      // Remove password from the response
      updatedUser.password = undefined;

      res.status(200).json({
        status: true,
        message: "Profile Updated Successfully.",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found." });
    }
  } catch (error) {
    console.error("Error updating user profile:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });

    res.status(500).json({
      status: false,
      message: "An error occurred while updating the profile.",
      error: error.message,
    });
  }
});

const updateComment = asyncHandler(async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    
    const { _id, comment } = req.body; // Get the ID and comment directly from the request body

    const user = await User.findById(_id);

    if (user) {
      // Update the comment field
      user.comment = comment || user.comment;

      const updatedUser = await user.save();

      // Remove password from the response
      updatedUser.password = undefined;

      res.status(200).json({
        status: true,
        message: "Comment Updated Successfully.",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found." });
    }
  } catch (error) {
    console.error("Error updating comment:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });

    res.status(500).json({
      status: false,
      message: "An error occurred while updating the comment.",
      error: error.message,
    });
  }
});




const activateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (user) {
    user.isActive = req.body.isActive;

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: `User account has been ${
        user?.isActive ? "activated" : "disabled"
      }`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (userId === "65ff94c7bb2de638d0c73f63") {
    return res.status(404).json({
      status: false,
      message: "This is a test user. You can not change password. Thank you!!!",
    });
  }

  const user = await User.findById(userId);

  if (user) {
    user.password = req.body.password;

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: `Password changed successfully.`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "User deleted successfully" });
});

export {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getTeamList,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  getNotificationsList,
  markNotificationRead,
  updateComment,
};

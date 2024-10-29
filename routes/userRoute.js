import express from "express";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
  updateComment,
} from "../controllers/userController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", protectRoute  , getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);


router.put("/comment", protectRoute, updateComment);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);
router
  .route("/:id")
  .put(protectRoute,  activateUserProfile)
  .delete(protectRoute, deleteUserProfile);

export default router;

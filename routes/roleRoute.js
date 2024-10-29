import express from "express";
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
  getAllRoles,
  getAllBranchIds,
  createBulkRoles,
} from "../controllers/roleController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.post("/create", protectRoute, createRole);
router.post("/get", protectRoute,  getRoles);
router.get("/br",  getAllBranchIds);
router.post("/bulk",  createBulkRoles);
router.get("/all", protectRoute,  getAllRoles);
router.get("/detail/:id", protectRoute,  getRoleById);
router.put("/update/:id", protectRoute, updateRole);
router.delete("/delete/:id", protectRoute, deleteRole);

export default router;

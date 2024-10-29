import express from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
  getAllDepartments,
} from "../controllers/departmentController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();



router.post("/create", protectRoute,  createDepartment);
router.post("/get", protectRoute,  getDepartments);
router.get("/all", protectRoute,  getAllDepartments);
router.get("/detail/:id", protectRoute,  getDepartmentById);
router.put("/update/:id", protectRoute,  updateDepartment);
router.delete("/delete/:id", protectRoute, deleteDepartment);

export default router;

import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  deleteTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
  updateTaskStage,
  getAllTasks,
  departmentGraph,
  individualDepartmentGraph,
} from "../controllers/taskController.js";
import { evaluatePerformance } from "../controllers/performanceController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.post("/create", protectRoute, createTask);
router.post("/duplicate/:id", protectRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);
router.get("/all", protectRoute, getAllTasks);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/departmentGraph", protectRoute,  departmentGraph);
router.get("/individualDepartmentGraph", protectRoute, individualDepartmentGraph);

router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);
router.post("/performance/evaluation", protectRoute, evaluatePerformance);

router.put("/create-subtask/:id", protectRoute, createSubTask);
router.put("/update/:id", protectRoute, updateTask);
router.put("/change-stage/:id", protectRoute, updateTaskStage);
router.put("/:id", protectRoute, trashTask);

router.delete("/delete-restore/:id?", protectRoute, deleteRestoreTask);

router.delete("/delete/:id?", protectRoute, deleteTask);

export default router;

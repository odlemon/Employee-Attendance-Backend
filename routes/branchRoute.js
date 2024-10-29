import express from "express";
import {
  createBranch,
  deleteBranch,
  getBranchById,
  getBranches,
  updateBranch,
} from "../controllers/branchController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.post("/create", protectRoute, createBranch);
router.get("/get", protectRoute, getBranches);
router.get("/detail/:id", protectRoute, getBranchById);
router.put("/update/:id", protectRoute, updateBranch);
router.delete("/delete/:id", protectRoute, deleteBranch);

export default router;

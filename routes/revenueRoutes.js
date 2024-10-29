import express from "express";
import {
  createRevenue,
  createBranchRevenue,
  getAllBranchRevenue,
  updateRevenueBranch,
      getRevenues
} from "../controllers/revenueController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.post("/create", protectRoute, createRevenue);
// router.post("/get", protectRoute, checkPermission("can view revenues"), getRevenues);
 router.get("/all", protectRoute,  getRevenues);
// router.get("/detail/:id", protectRoute, checkPermission("can view revenue details"), getRevenueById);
router.put("/update/:id", protectRoute, updateRevenueBranch);
router.post("/branch-revenue", protectRoute, createBranchRevenue);

export default router;

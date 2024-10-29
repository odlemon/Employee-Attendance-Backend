import express from "express";
import userRoutes from "./userRoute.js";
import taskRoutes from "./taskRoute.js";
import roleRoutes from "./roleRoute.js";
import departmentRoutes from "./departmentRoute.js";
import branchRoutes from "./branchRoute.js";
import kpiRoutes from "./kpiRoute.js";
import revenueRoutes from "./revenueRoutes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/role", roleRoutes);
router.use("/department", departmentRoutes);
router.use("/branch", branchRoutes);
router.use("/kpi", kpiRoutes);
router.use("/revenue", revenueRoutes);

export default router;

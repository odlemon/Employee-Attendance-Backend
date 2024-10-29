import express from "express";
import {
  createKPI,
  deleteKPI,
  getKPIById,
  getKPIs,
  updateKPI,
  getAllKPIs,
} from "../controllers/kpiController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.post("/create", protectRoute,  createKPI);
router.post("/get", protectRoute, getKPIs);
router.get("/all", protectRoute, getAllKPIs);
router.get("/detail/:id", protectRoute, getKPIById);
router.put("/update/:id", protectRoute, updateKPI);
router.delete("/delete/:id", protectRoute, deleteKPI);

export default router;

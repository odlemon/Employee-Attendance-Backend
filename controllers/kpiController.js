import asyncHandler from "express-async-handler";
import KPI from "../models/kpiModel.js";
import Branch from "../models/branchModel.js";

const createKPI = asyncHandler(async (req, res) => {
  const { name, type, branchId } = req.body;

  const branch = await Branch.findById(branchId);
  if (!branch) {
    return res.status(400).json({ status: false, message: "Branch not found" });
  }

  const kpiExists = await KPI.findOne({ name });

  if (kpiExists) {
    return res
      .status(400)
      .json({ status: false, message: "KPI already exists" });
  }

  const kpi = await KPI.create({
    name,
    type,
    branch: branchId,
  });

  if (kpi) {
    res.status(201).json(kpi);
  } else {
    return res.status(400).json({ status: false, message: "Invalid KPI data" });
  }
});

const getKPIs = asyncHandler(async (req, res) => {
  const { branchId } = req.body;

  if (!branchId) {
    return res.status(400).json({ message: "Branch ID is required" });
  }

  try {
    const kpis = await KPI.find({ branch: branchId }).populate('branch');

    res.status(200).json(kpis);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

const getAllKPIs = asyncHandler(async (req, res) => {
  try {
    const kpis = await KPI.find();
    res.status(200).json(kpis);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

const getKPIById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const kpi = await KPI.findById(id).populate('branch');

  if (kpi) {
    res.status(200).json(kpi);
  } else {
    res.status(404).json({ status: false, message: "KPI not found" });
  }
});

const updateKPI = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, type, branchId } = req.body;

  const kpi = await KPI.findById(id);

  if (kpi) {
    kpi.name = name || kpi.name;
    kpi.type = type || kpi.type;

    if (branchId) {
      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(400).json({ status: false, message: "Branch not found" });
      }
      kpi.branch = branchId;
    }

    const updatedKPI = await kpi.save();

    res.status(200).json({
      status: true,
      message: "KPI updated successfully",
      kpi: updatedKPI,
    });
  } else {
    res.status(404).json({ status: false, message: "KPI not found" });
  }
});

const deleteKPI = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await KPI.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "KPI deleted successfully" });
});

export {
  createKPI,
  getKPIs,
  getAllKPIs,
  getKPIById,
  updateKPI,
  deleteKPI,
};

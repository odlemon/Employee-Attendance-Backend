import asyncHandler from "express-async-handler";
import Department from "../models/departmentModel.js";
import Branch from "../models/branchModel.js";

const createDepartment = asyncHandler(async (req, res) => {
  const { name, description, branchId } = req.body;

  const branch = await Branch.findById(branchId);
  if (!branch) {
    return res.status(400).json({ status: false, message: "Branch not found" });
  }

  const departmentExists = await Department.findOne({ name });

  if (departmentExists) {
    return res
      .status(400)
      .json({ status: false, message: "Department already exists" });
  }

  const department = await Department.create({
    name,
    description,
    branch: branchId, 
  });

  if (department) {
    res.status(201).json(department);
  } else {
    return res.status(400).json({ status: false, message: "Invalid department data" });
  }
});

const getDepartments = asyncHandler(async (req, res) => {
  const { branchId } = req.body;

  if (!branchId) {
    return res.status(400).json({ message: "branchId is required" });
  }

  const query = { branch: branchId };

  const departments = await Department.find(query).populate('branch');

  res.status(200).json(departments);
});

const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().populate('branch');

  res.status(200).json(departments);
});

const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await Department.findById(id).populate('branch');

  if (department) {
    res.status(200).json(department);
  } else {
    res.status(404).json({ status: false, message: "Department not found" });
  }
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, branchId } = req.body;

  const department = await Department.findById(id);

  if (department) {
    department.name = name || department.name;
    department.description = description || department.description;

    if (branchId) {
      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(400).json({ status: false, message: "Branch not found" });
      }
      department.branch = branchId;
    }

    const updatedDepartment = await department.save();

    res.status(200).json({
      status: true,
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } else {
    res.status(404).json({ status: false, message: "Department not found" });
  }
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Department.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "Department deleted successfully" });
});

export {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getAllDepartments,
};

import asyncHandler from "express-async-handler";
import Branch from "../models/branchModel.js";

const createBranch = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const branchExists = await Branch.findOne({ name });

  if (branchExists) {
    return res
      .status(400)
      .json({ status: false, message: "branch already exists" });
  }

  const branch = await Branch.create({
    name,
    description,
  });

  if (branch) {
    res.status(201).json(branch);
  } else {
    return res.status(400).json({ status: false, message: "Invalid branch data" });
  }
});

const getBranches = asyncHandler(async (req, res) => {
  const branches = await Branch.find();

  res.status(200).json(branches);
});

const getBranchById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: false, message: "No branch ID provided" });
    }

    const branch = await Branch.findById(id);

    if (branch) {
      res.status(200).json(branch);
    } else {
      res.status(404).json({ status: false, message: "Branch not found" });
    }
  } catch (error) {
    console.error("Error fetching branch details:", error);
    res.status(500).json({
      status: false,
      message: "An unexpected error occurred while fetching branch details",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

const updateBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, revenueAchieved } = req.body;
  console.log(req.body)
  const branch = await Branch.findById(id);

  if (branch) {
    // Update the branch fields with provided data or keep existing values
    branch.name = name || branch.name;
    branch.description = description || branch.description;
    branch.revenueAchieved = revenueAchieved !== undefined ? revenueAchieved : branch.revenueAchieved;

    // Save the updated branch document
    const updatedBranch = await branch.save();

    res.status(200).json({
      status: true,
      message: "Branch updated successfully",
      branch: updatedBranch,
    });
  } else {
    res.status(404).json({ status: false, message: "Branch not found" });
  }
});


const deleteBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Branch.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "branch deleted successfully" });
});

export {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};

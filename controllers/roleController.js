import asyncHandler from "express-async-handler";
import Role from "../models/roleModel.js";
import Branch from "../models/branchModel.js";

const createRole = asyncHandler(async (req, res) => {
  try {
    const { name, permissions, description, branchId } = req.body;

    const branch = await Branch.findById(branchId);
    if (!branch) {
      console.error("Branch not found");
      return res.status(400).json({ status: false, message: "Branch not found" });
    }

    // Check if a role with the same name exists in the same branch
    const roleExists = await Role.findOne({ name, branch: branchId });

    if (roleExists) {
      console.error("Role already exists in this branch");
      return res.status(400).json({ status: false, message: "Role already exists in this branch" });
    }

    const role = await Role.create({
      name,
      permissions,
      description,
      branch: branchId,
    });

    if (role) {
      res.status(201).json(role);
    } else {
      console.error("Invalid role data");
      return res.status(400).json({ status: false, message: "Invalid role data" });
    }
  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});


const getRoles = asyncHandler(async (req, res) => {
  const { branchId } = req.body;
  if (!branchId) {
    return res.status(400).json({ message: "branchId is required" });
  }

  const query = { branch: branchId }; 
  const roles = await Role.find(query).populate('branch');

  res.status(200).json(roles);
});

const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find().populate('branch');

  res.status(200).json(roles);
});

const getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id).populate('branch'); 

  if (role) {
    res.status(200).json(role);
  } else {
    res.status(404).json({ status: false, message: "Role not found" });
  }
});

const updateRole = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions, description, branch } = req.body;

    console.log("Request body:", req.body);

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({ status: false, message: "Role not found" });
    }

    // Update fields
    role.name = name || role.name;
    role.description = description || role.description;

    if (permissions && Array.isArray(permissions)) {
      role.permissions = permissions;
    }

    const updatedRole = await role.save();

    res.status(200).json({
      status: true,
      message: "Role updated successfully",
      role: updatedRole,
    });

  } catch (error) {
    // Check for MongoDB duplicate key error (code 11000)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.name && error.keyPattern.branch) {
      console.error(`Duplicate role found: ${error.keyValue.name} in branch ${error.keyValue.branch}`);
      return res.status(400).json({
        status: false,
        message: "A role with the same name and branch already exists.",
      });
    }

    // For any other errors
    console.error(`Error updating role with id ${req.params.id}:`, error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});




const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Role.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "Role deleted successfully" });
});


const getAllBranchIds = asyncHandler(async (req, res) => {
  try {
    // Fetch all branches
    const branches = await Branch.find({}, "_id"); // Only select the _id field

    // Map to get an array of branch IDs
    const branchIds = branches.map(branch => branch._id);

    return res.status(200).json({ status: true, branchIds });
  } catch (error) {
    console.error("Error fetching branch IDs:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});

const rolesData = [
  {
    name: "Regional Manager",
    permissions: [
      { name: "can access organisation dashboard", value: true },
      { name: "can set organisation objectives", value: false },
      { name: "can update branch progress", value: true },
      { name: "can create tasks", value: true },
      { name: "can duplicate tasks", value: false },
      { name: "can add task activity", value: true },
      { name: "can view all tasks", value: true },
      { name: "can view task", value: true },
      { name: "can view task details", value: true },
      { name: "can evaluate performance", value: true },
      { name: "can create sub-tasks", value: true },
      { name: "can update tasks", value: true },
      { name: "can change tasks stage", value: true },
      { name: "can trash tasks", value: true },
      { name: "can delete tasks", value: false },
      { name: "can create branches", value: true },
      { name: "can view all branches", value: true },
      { name: "can view branch details", value: true },
      { name: "can update branch", value: true },
      { name: "can delete branches", value: false },
      { name: "can create departments", value: true },
      { name: "can view departments", value: true },
      { name: "can view all departments", value: true },
      { name: "can view department details", value: true },
      { name: "can update departments", value: true },
      { name: "can delete departments", value: false },
      { name: "can create kpis", value: true },
      { name: "can view kpis", value: true },
      { name: "can view all kpis", value: true },
      { name: "can view kpi details", value: true },
      { name: "can update kpis", value: true },
      { name: "can create role", value: false },
      { name: "can view role", value: true },
      { name: "can view all roles", value: true },
      { name: "can view role details", value: true },
      { name: "can update roles", value: false },
      { name: "can delete roles", value: false },
      { name: "can view team list", value: true },
      { name: "can view dashboard", value: true },
      { name: "can assess individual performance", value: true },
      { name: "can delete objectives", value: false },
      { name: "can modify objectives", value: false },
      { name: "can view overall performance", value: true },
      { name: "can change objective status", value: true },
    ],
  },
  {
    name: "Credit Officer",
    permissions: [
      { name: "can access organisation dashboard", value: true },
      { name: "can set organisation objectives", value: false },
      { name: "can update branch progress", value: true },
      { name: "can create tasks", value: true },
      { name: "can duplicate tasks", value: false },
      { name: "can add task activity", value: true },
      { name: "can view all tasks", value: true },
      { name: "can view task", value: true },
      { name: "can view task details", value: true },
      { name: "can evaluate performance", value: true },
      { name: "can create sub-tasks", value: true },
      { name: "can update tasks", value: true },
      { name: "can change tasks stage", value: true },
      { name: "can trash tasks", value: false },
      { name: "can delete tasks", value: false },
      { name: "can create branches", value: false },
      { name: "can view all branches", value: true },
      { name: "can view branch details", value: true },
      { name: "can update branch", value: false },
      { name: "can delete branches", value: false },
      { name: "can create departments", value: false },
      { name: "can view departments", value: true },
      { name: "can view all departments", value: false },
      { name: "can view department details", value: true },
      { name: "can update departments", value: false },
      { name: "can delete departments", value: false },
      { name: "can create kpis", value: true },
      { name: "can view kpis", value: true },
      { name: "can view all kpis", value: true },
      { name: "can view kpi details", value: true },
      { name: "can update kpis", value: true },
      { name: "can create role", value: false },
      { name: "can view role", value: true },
      { name: "can view all roles", value: true },
      { name: "can view role details", value: false },
      { name: "can update roles", value: false },
      { name: "can delete roles", value: false },
      { name: "can view team list", value: true },
      { name: "can view dashboard", value: true },
      { name: "can assess individual performance", value: true },
      { name: "can delete objectives", value: false },
      { name: "can modify objectives", value: false },
      { name: "can view overall performance", value: true },
      { name: "can change objective status", value: false },
    ],
  },
  {
    name: "Collector",
    permissions: [
      { name: "can access organisation dashboard", value: false },
      { name: "can set organisation objectives", value: false },
      { name: "can update branch progress", value: false },
      { name: "can create tasks", value: false },
      { name: "can duplicate tasks", value: false },
      { name: "can add task activity", value: false },
      { name: "can view all tasks", value: false },
      { name: "can view task", value: true },
      { name: "can view task details", value: true },
      { name: "can evaluate performance", value: true },
      { name: "can create sub-tasks", value: false },
      { name: "can update tasks", value: true },
      { name: "can change tasks stage", value: true },
      { name: "can trash tasks", value: false },
      { name: "can delete tasks", value: false },
      { name: "can create branches", value: false },
      { name: "can view all branches", value: false },
      { name: "can view branch details", value: false },
      { name: "can update branch", value: false },
      { name: "can delete branches", value: false },
      { name: "can create departments", value: false },
      { name: "can view departments", value: true },
      { name: "can view all departments", value: false },
      { name: "can view department details", value: true },
      { name: "can update departments", value: false },
      { name: "can delete departments", value: false },
      { name: "can create kpis", value: false },
      { name: "can view kpis", value: true },
      { name: "can view all kpis", value: false },
      { name: "can view kpi details", value: true },
      { name: "can update kpis", value: false },
      { name: "can create role", value: false },
      { name: "can view role", value: true },
      { name: "can view all roles", value: true },
      { name: "can view role details", value: false },
      { name: "can update roles", value: false },
      { name: "can delete roles", value: false },
      { name: "can view team list", value: true },
      { name: "can view dashboard", value: true },
      { name: "can assess individual performance", value: true },
      { name: "can delete objectives", value: false },
      { name: "can modify objectives", value: false },
      { name: "can view overall performance", value: false },
      { name: "can change objective status", value: false },
    ],
  },
];


const createBulkRoles = asyncHandler(async (req, res) => {
  try {
    const { branchIds } = req.body; // Get the list of branch IDs from the request body

    const createdRoles = [];

    for (const branchId of branchIds) {
      const branch = await Branch.findById(branchId);
      if (!branch) {
        console.error(`Branch not found for ID: ${branchId}`);
        continue; // Skip to the next branch if the branch does not exist
      }

      for (const roleData of rolesData) {
        const { name, description, permissions } = roleData;

        // Check if a role with the same name exists in the branch
        const roleExists = await Role.findOne({ name: name, branch: branchId });
        if (roleExists) {
          console.error(`Role ${name} already exists in branch ${branchId}`);
          continue; // Skip creating this role if it already exists
        }

        // Create the role
        const newRole = await Role.create({
          name: name,
          description,
          permissions,
          branch: branchId,
        });

        createdRoles.push(newRole); // Add created role to the list
      }
    }

    return res.status(201).json({
      status: true,
      message: "Roles created successfully",
      createdRoles,
    });
  } catch (error) {
    console.error("Error creating bulk roles:", error);
    return res.status(500).json({ status: false, message: "Server error" });
  }
});


export {
  createBulkRoles,
  getAllBranchIds,
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getAllRoles,
};

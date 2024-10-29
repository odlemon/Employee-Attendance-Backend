import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const checkPermission = (permissionName) => asyncHandler(async (req, res, next) => {
    console.log("Entering checkPermission middleware with permission:", permissionName);
    try {
        const user = await User.findById(req.user.userId).populate('role');

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found." });
        }

        
        //console.log("User object:", user);

        const role = user.role;
        //console.log("Role object:", role);
        //console.log("Permissions array:", role.permissions);
        
        if (user.isAdmin) {
            return next();
        }

        if (!role || !Array.isArray(role.permissions)) {
            return res.status(403).json({
                status: false,
                message: "Role or permissions not found.",
            });
        }

        const hasPermission = role.permissions.some(
            (p) => p.name === permissionName && p.value === true
        );

        if (hasPermission) {
            return next();
        } else {
            return res.status(403).json({
                status: false,
                message: "You do not have the required permission to perform this action.",
            });
        }
    } catch (error) {
        console.error("Error in checkPermission middleware:", error);
        res.status(500).json({ status: false, message: "Server error." });
    }
});

export { checkPermission };

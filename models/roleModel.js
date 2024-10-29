import mongoose, { Schema } from "mongoose";
import Branch from "./branchModel.js";

const permissionSchema = new Schema({
  name: { type: String, required: true },
  value: { type: Boolean, default: false },
});

const roleSchema = new Schema(
  {
    name: { type: String, required: true },
    permissions: [permissionSchema],
    description: { type: String },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
  },
  { timestamps: true }
);

// Compound index to ensure the combination of name and branch is unique
roleSchema.index({ name: 1, branch: 1 }, { unique: true });

const Role = mongoose.model("Role", roleSchema);

export default Role;

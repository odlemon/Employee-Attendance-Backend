import mongoose, { Schema } from "mongoose";
import Branch from "./branchModel.js";

const departmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;

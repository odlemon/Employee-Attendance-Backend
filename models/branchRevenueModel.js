import mongoose, { Schema } from "mongoose";

const branchRevenueSchema = new Schema(
  {
    revenueAchieved: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const BranchRevenueModel = mongoose.model("BranchRevenueModel", branchRevenueSchema);

export default BranchRevenueModel;

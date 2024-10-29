import mongoose, { Schema } from "mongoose";

const branchSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    revenueTarget: { type: Number, default: 0 }, 
    revenueAchieved: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;

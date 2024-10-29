import mongoose, { Schema } from "mongoose";
import Branch from "./branchModel.js";

const kpiSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ['Metric', 'Percentage'],
    },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
  },
  { timestamps: true }
);

const KPI = mongoose.model("KPI", kpiSchema);

export default KPI;

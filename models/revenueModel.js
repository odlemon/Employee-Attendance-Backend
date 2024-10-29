import mongoose, { Schema } from "mongoose";

const targetBranchSchema = new Schema({
  id: { type: String, required: true },
  target: { type: Number, required: true },
  achieved: { type: Number, default: 0 },
  achievedHistory: [
    {
      value: { type: Number, required: true },  
      date: { type: Date, default: Date.now }  
    }
  ]
});


const revenueSchema = new Schema(
  {
    revenueName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalTarget: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    targetBranches: [targetBranchSchema]
  },
  { timestamps: true }
);

const Revenue = mongoose.model("Revenue", revenueSchema);

export default Revenue;
import mongoose from "mongoose";

const RFPSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    budget: Number,
    delivery: String,
    created_by: Number,
    assignedVendor: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("RFP", RFPSchema);

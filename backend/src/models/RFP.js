import mongoose from "mongoose";

const rfpSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    budget: { type: Number, default: 0 },
    delivery: String,
    created_by: { type: Number, default: 1 },
    status: { type: String, default: "draft" },
  },
  { timestamps: true }
);

export default mongoose.model("RFP", rfpSchema);

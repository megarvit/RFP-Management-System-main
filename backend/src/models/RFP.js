import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
});

const RFPSchema = new mongoose.Schema(
  {
    title: String,
    specification: String,
    items: [ItemSchema],
    warranty: String,
    paymentTerms: String,
    budget: Number,
    delivery: String,
    created_by: Number,
    assignedVendor: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("RFP", RFPSchema);

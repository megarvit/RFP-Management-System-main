import mongoose from "mongoose";

const rfpVendorMappingSchema = new mongoose.Schema({
  rfpId: { type: mongoose.Schema.Types.ObjectId, ref: "RFP", required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  sentAt: { type: Date, default: Date.now },
});

// Optional: create compound index to prevent duplicate RFP → Vendor pairs
rfpVendorMappingSchema.index({ rfpId: 1, vendorId: 1 }, { unique: true });

export default mongoose.model("RFPVendorMapping", rfpVendorMappingSchema);

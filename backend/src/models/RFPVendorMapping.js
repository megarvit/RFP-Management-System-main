import mongoose from "mongoose";

const rfpVendorMappingSchema = new mongoose.Schema({
  rfpId: { type: mongoose.Schema.Types.ObjectId, ref: "RFP", required: true, unique: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  sentAt: { type: Date, default: Date.now }
});

export default mongoose.model("RFPVendorMapping", rfpVendorMappingSchema);

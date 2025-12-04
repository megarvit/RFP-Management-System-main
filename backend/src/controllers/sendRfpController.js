import RFPVendorMapping from "../models/RFPVendorMapping.js";

export const sendRFPToVendor = async (req, res) => {
  try {
    const { rfpId, vendorId } = req.body;

    if (!rfpId || !vendorId) {
      return res.status(400).json({ success: false, message: "rfpId and vendorId required" });
    }

    // Check if already assigned
    const existing = await RFPVendorMapping.findOne({ rfpId });
    if (existing) {
      return res.status(400).json({ success: false, message: "RFP already assigned to a vendor" });
    }

    const mapping = new RFPVendorMapping({ rfpId, vendorId });
    await mapping.save();

    res.json({ success: true, data: mapping });
  } catch (err) {
    console.error("Send RFP error:", err);
    res.status(500).json({ success: false, message: "Failed to send RFP" });
  }
};

export const getSentRFPs = async (req, res) => {
  try {
    const sent = await RFPVendorMapping.find()
      .populate("rfpId")
      .populate("vendorId");

    res.json({ success: true, data: sent });
  } catch (err) {
    console.error("Get sent RFPs error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch sent RFPs" });
  }
};

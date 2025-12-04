import RFPVendorMapping from "../models/RFPVendorMapping.js";

export const sendRFPToVendor = async (req, res) => {
  try {
    const { rfpId, vendorId } = req.body;
    if(!rfpId || !vendorId) return res.status(400).json({ success:false, message: "rfpId and vendorId required" });

    const exists = await RFPVendorMapping.findOne({ rfpId });
    if (exists) return res.status(400).json({ success:false, message: "RFP already assigned" });

    const mapping = await new RFPVendorMapping({ rfpId, vendorId }).save();
    res.json({ success: true, data: mapping });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: "Failed to send RFP" });
  }
};

export const getSentRFPs = async (req, res) => {
  try {
    const sent = await RFPVendorMapping.find().populate("rfpId").populate("vendorId");
    res.json({ success:true, data: sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: "Failed to fetch sent RFPs" });
  }
};

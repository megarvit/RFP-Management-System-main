import RFP from "../models/RFP.js";

// CREATE RFP
export const createRFP = async (req, res) => {
  try {
    const rfp = new RFP(req.body);
    const saved = await rfp.save();

    res.json({ success: true, data: saved });
  } catch (err) {
    console.error("Create RFP error:", err);
    res.status(500).json({ success: false, message: "Error creating RFP" });
  }
};

// LIST ALL RFPs
export const getAllRFPs = async (req, res) => {
  try {
    const rfps = await RFP.find().sort({ createdAt: -1 });
    res.json({ success: true, data: rfps });
  } catch (err) {
    console.error("Get RFPs error:", err);
    res.status(500).json({ success: false, message: "Error fetching RFP list" });
  }
};

// DELETE RFP
export const deleteRFP = async (req, res) => {
  try {
    const id = req.params.id;
    await RFP.findByIdAndDelete(id);

    res.json({ success: true, message: "RFP deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Error deleting RFP" });
  }
};

// FETCH RFP BY ID
export const getRFPById = async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) return res.status(404).json({ success: false, message: "RFP not found" });
    res.json({ success: true, data: rfp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
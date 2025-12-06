import Vendor from "../models/Vendor.js";

// CREATE VENDOR
export const createVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    const saved = await vendor.save();
    res.json({ success: true, data: saved });
  } catch (err) {
    console.error("Create Vendor error:", err);
    res.status(500).json({ success: false, message: "Error creating vendor" });
  }
};

// LIST ALL VENDORS
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json({ success: true, data: vendors });
  } catch (err) {
    console.error("Get Vendors error:", err);
    res.status(500).json({ success: false, message: "Error fetching vendors" });
  }
};

// GET VENDOR BY ID
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({ success: true, data: vendor });
  } catch (err) {
    console.error("Get Vendor By ID error:", err);
    res.status(500).json({
      success: false,
      message: "Invalid Vendor ID",
    });
  }
};

//UPDATE VENDOR
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.json({ success: true, data: vendor });
  } catch (err) {
    console.error("Update Vendor error:", err);
    res.status(500).json({ success: false, message: "Error updating vendor" });
  }
};

// DELETE VENDOR
export const deleteVendor = async (req, res) => {
  try {
    const id = req.params.id;
    await Vendor.findByIdAndDelete(id);
    res.json({ success: true, message: "Vendor deleted" });
  } catch (err) {
    console.error("Delete Vendor error:", err);
    res.status(500).json({ success: false, message: "Error deleting vendor" });
  }
};

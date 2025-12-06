import express from "express";
import { createVendor, getAllVendors, deleteVendor, getVendorById, updateVendor } from "../controllers/vendorController.js";

const router = express.Router();

router.post("/", createVendor);      // Create a vendor
router.get("/", getAllVendors);      // List all vendors
router.delete("/:id", deleteVendor); // Delete a vendor
router.get("/:id", getVendorById);
router.put("/:id", updateVendor);  

export default router;

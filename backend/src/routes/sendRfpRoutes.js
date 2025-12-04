import express from "express";
import { sendRFPToVendor, getSentRFPs } from "../controllers/sendRfpController.js";

const router = express.Router();

// Send an RFP to a vendor
router.post("/", sendRFPToVendor);

// Get all sent RFPs (for dashboard or listing)
router.get("/", getSentRFPs);

export default router;

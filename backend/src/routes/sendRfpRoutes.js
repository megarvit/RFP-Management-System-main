import express from "express";
import { sendRFPToVendor, getSentRFPs } from "../controllers/sendRfpController.js";

const router = express.Router();
router.post("/", sendRFPToVendor);
router.get("/", getSentRFPs);

export default router;

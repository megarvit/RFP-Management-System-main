import express from "express";
import * as rfpController from "../controllers/rfpController.js";

const router = express.Router();

router.post("/create", rfpController.createRFP);
router.get("/", rfpController.getAllRFPs);
router.delete("/:id", rfpController.deleteRFP);
router.get("/:id", rfpController.getRFPById);
router.post("/create-ai", rfpController.createRFPWithAI);

export default router;
import express from "express";
import { createRFP, getAllRFPs, deleteRFP } from "../controllers/rfpController.js";

const router = express.Router();

router.post("/create", createRFP);
router.get("/", getAllRFPs);
router.delete("/:id", deleteRFP);

export default router;

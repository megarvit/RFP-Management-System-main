import { pool } from "../db.js";

// CREATE RFP
export const createRFP = async (req, res) => {
  try {
    const { title, description, created_by } = req.body;

    // Validate required fields
    if (!title || !created_by) {
      return res.status(400).json({
        success: false,
        message: "Title and created_by are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO rfp (title, description, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [title, description || null, created_by]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Create RFP error:", err.message);
    res.status(500).json({ success: false, message: "Error creating RFP" });
  }
};

// LIST ALL RFPs
export const getAllRFPs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rfp ORDER BY id DESC");
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Get RFPs error:", err.message);
    res.status(500).json({ success: false, message: "Error fetching RFP list" });
  }
};

// DELETE RFP by ID
export const deleteRFP = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM rfp WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "RFP not found" });
    }

    res.json({ success: true, message: "RFP deleted successfully", data: result.rows[0] });
  } catch (err) {
    console.error("Delete RFP error:", err);
    res.status(500).json({ success: false, message: "Error deleting RFP" });
  }
};

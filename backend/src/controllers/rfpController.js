import RFP from "../models/RFP.js";
import RFPVendorMapping from "../models/RFPVendorMapping.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("OPENAI KEY:", process.env.OPENAI_API_KEY ? "LOADED ✅" : "MISSING ❌");


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

// LIST ALL RFPs + INCLUDE ASSIGNED VENDOR NAME
export const getAllRFPs = async (req, res) => {
  try {
    const rfps = await RFP.find().sort({ createdAt: -1 });

    // fetch all mappings
    const mappings = await RFPVendorMapping.find().populate("vendorId");

    // create a lookup table: rfpId -> vendor name
    const assigned = {};
    mappings.forEach(m => {
      assigned[m.rfpId.toString()] = m.vendorId?.name || null;
    });

    // inject assigned vendor into RFP list
    const finalData = rfps.map(r => ({
      ...r._doc,
      assignedVendor: assigned[r._id.toString()] || null
    }));

    res.json({ success: true, data: finalData });
  } catch (err) {
    console.error("Get RFPs error:", err);
    res.status(500).json({ success: false, message: "Error fetching RFP list" });
  }
};

// DELETE RFP + DELETE MAPPING
export const deleteRFP = async (req, res) => {
  try {
    const id = req.params.id;

    // delete mapping for this RFP
    await RFPVendorMapping.deleteMany({ rfpId: id });

    // delete RFP
    await RFP.findByIdAndDelete(id);

    res.json({ success: true, message: "RFP deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Error deleting RFP" });
  }
};

// FETCH RFP BY ID + ASSIGNED VENDOR DETAILS
export const getRFPById = async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) return res.status(404).json({ success: false, message: "RFP not found" });

    const mapping = await RFPVendorMapping.findOne({ rfpId: req.params.id })
      .populate("vendorId");

    res.json({
      success: true,
      data: {
        ...rfp._doc,
        assignedVendor: mapping?.vendorId || null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const createRFPWithAI = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ success: false, message: "Description required" });
    }

    const prompt = `
    Generate an RFP in valid JSON format from the requirement below:

    "${description}"

    JSON format ONLY:
    {
      "title": "",
      "specification": "",
      "items": [
        { "item": "", "quantity": number }
      ],
      "warranty": "",
      "paymentTerms": "",
      "budget": number,
      "delivery": ""
    }
    Return ONLY JSON. No explanation.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });

    const aiText = completion.choices[0].message.content;

    const parsed = JSON.parse(aiText);

    const rfp = await RFP.create({
      title: parsed.title,
      specification: parsed.specification,
      items: parsed.items || [],
      warranty: parsed.warranty || null,
      paymentTerms: parsed.paymentTerms || null,
      budget: parsed.budget || 0,
      delivery: parsed.delivery || null,
      created_by: req.user?.id || 1,
    });

    res.json({
      success: true,
      data: rfp,
      aiGenerated: parsed,
    });
    console.log("AI RFP generated:", parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
};
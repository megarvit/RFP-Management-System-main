import RFP from "../models/RFP.js";
import RFPVendorMapping from "../models/RFPVendorMapping.js";
import Groq from "groq-sdk";

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// CREATE RFP (manual)
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

// LIST ALL RFPs + ASSIGNED VENDOR
export const getAllRFPs = async (req, res) => {
  try {
    const rfps = await RFP.find().sort({ createdAt: -1 });

    // fetch all mappings
    const mappings = await RFPVendorMapping.find().populate("vendorId");

    // create a lookup table: rfpId -> array of vendor names
    const assigned = {};
    mappings.forEach(m => {
      const rId = m.rfpId.toString();
      if (!assigned[rId]) assigned[rId] = [];
      if (m.vendorId?.name) assigned[rId].push(m.vendorId.name);
    });

    // inject assigned vendors array into RFP list
    const finalData = rfps.map(r => ({
      ...r._doc,
      assignedVendor: assigned[r._id.toString()] || []
    }));

    res.json({ success: true, data: finalData });
  } catch (err) {
    console.error("Get RFPs error:", err);
    res.status(500).json({ success: false, message: "Error fetching RFP list" });
  }
};


// DELETE RFP + MAPPING
export const deleteRFP = async (req, res) => {
  try {
    const id = req.params.id;
    await RFPVendorMapping.deleteMany({ rfpId: id });
    await RFP.findByIdAndDelete(id);

    res.json({ success: true, message: "RFP deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Error deleting RFP" });
  }
};

// GET RFP BY ID + ASSIGNED VENDOR
export const getRFPById = async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) return res.status(404).json({ success: false, message: "RFP not found" });

    // fetch all vendor mappings for this RFP
    const mappings = await RFPVendorMapping.find({ rfpId: req.params.id }).populate("vendorId");

    // create array of assigned vendor names
    const assignedVendors = mappings.map(m => m.vendorId?.name).filter(Boolean);

    res.json({
      success: true,
      data: {
        ...rfp._doc,
        assignedVendor: assignedVendors.length > 0 ? assignedVendors : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE RFP
export const updateRFP = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Ensure assignedVendor is an array (even if a single vendor is passed)
    if (updateData.assignedVendor && !Array.isArray(updateData.assignedVendor)) {
      updateData.assignedVendor = [updateData.assignedVendor];
    }

    const updatedRFP = await RFP.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedRFP) {
      return res.status(404).json({ success: false, message: "RFP not found" });
    }

    res.json({ success: true, data: updatedRFP });
  } catch (err) {
    console.error("Update RFP error:", err);
    res.status(500).json({ success: false, message: "Failed to update RFP" });
  }
};

// CREATE RFP USING Groq AI
export const createRFPWithAI = async (req, res) => {
  try {
    const { description, vendorIds = [] } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description required"
      });
    }

    // 1️⃣ Generate RFP JSON from AI
    const prompt = `
      Generate an RFP JSON from this requirement:

      "${description}"

      STRICT JSON ONLY:
      {
        "title": "",
        "specification": "",
        "items": [
          { "item": "", "quantity": 1 }
        ],
        "warranty": "",
        "paymentTerms": "",
        "budget": 0,
        "delivery": ""
      }

      Rules:
      - Return ONLY valid JSON.
      - No explanation.
      - No markdown.
      - No text outside JSON.
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You extract RFP details and output strict JSON." },
        { role: "user", content: prompt }
      ]
    });

    const responseText = completion.choices[0].message.content;
    const jsonText = responseText.substring(
      responseText.indexOf("{"),
      responseText.lastIndexOf("}") + 1
    );

    const parsed = JSON.parse(jsonText);

    // 2️⃣ Save RFP to DB
    const rfp = await RFP.create({
      ...parsed,
      created_by: req.user?.id || 1
    });

    // 3️⃣ Assign vendors if vendorIds are provided
    if (vendorIds.length > 0) {
      const vendors = await Vendor.find({ _id: { $in: vendorIds } });

      const ops = vendors.map(v => ({
        updateOne: {
          filter: { rfpId: rfp._id, vendorId: v._id },
          update: { $setOnInsert: { sentAt: new Date() } },
          upsert: true
        }
      }));

      await RFPVendorMapping.bulkWrite(ops);

      // Send emails
      const itemsHtml = rfp.items.map(item => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.item}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
        </tr>
      `).join("");

      const itemsTable = `
        <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Item</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      `;

      await Promise.all(
        vendors.map(v =>
          sendMail({
            to: v.email,
            subject: `New RFP: ${rfp.title}`,
            text: `Hello ${v.name},
You have received a new RFP: ${rfp.title}.
Specification: ${rfp.specification}`,
            html: `
              <div style="font-family: Arial, sans-serif;">
                <h2>New RFP Received</h2>
                <p>Hello <strong>${v.name}</strong>,</p>
                <p>You have received a new RFP:</p>
                <p><strong>${rfp.title}</strong></p>
                <p><strong>Specification:</strong> ${rfp.specification}</p>
                <p><strong>Items:</strong></p>
                ${itemsTable}
                <p><strong>Warranty:</strong> ${rfp.warranty}</p>
                <p><strong>Payment Terms:</strong> ${rfp.paymentTerms}</p>
                <p><strong>Budget:</strong> ${rfp.budget}</p>
                <p><strong>Delivery:</strong> ${rfp.delivery}</p>
                <br />
                <p>Thank you,<br/>RFP Management Team</p>
              </div>
            `,
          })
        )
      );
    }

    res.json({
      success: true,
      data: rfp,
      aiGenerated: parsed,
      assignedVendors: vendorIds
    });

  } catch (err) {
    console.error("Groq AI RFP Error:", err);
    res.status(500).json({
      success: false,
      message: "Groq AI generation failed"
    });
  }
};



// export const createRFPWithAI = async (req, res) => {
//   try {
//     const { description } = req.body;

//     if (!description) {
//       return res.status(400).json({ success: false, message: "Description required" });
//     }

//     const prompt = `
//     Generate an RFP in valid JSON format from the requirement below:

//     "${description}"

//     JSON format ONLY:
//     {
//       "title": "",
//       "specification": "",
//       "items": [
//         { "item": "", "quantity": number }
//       ],
//       "warranty": "",
//       "paymentTerms": "",
//       "budget": number,
//       "delivery": ""
//     }
//     Return ONLY JSON. No explanation.
//     `;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       temperature: 0.3,
//       messages: [{ role: "user", content: prompt }],
//     });

//     const aiText = completion.choices[0].message.content;

//     const parsed = JSON.parse(aiText);

//     const rfp = await RFP.create({
//       title: parsed.title,
//       specification: parsed.specification,
//       items: parsed.items || [],
//       warranty: parsed.warranty || null,
//       paymentTerms: parsed.paymentTerms || null,
//       budget: parsed.budget || 0,
//       delivery: parsed.delivery || null,
//       created_by: req.user?.id || 1,
//     });

//     res.json({
//       success: true,
//       data: rfp,
//       aiGenerated: parsed,
//     });
//     console.log("AI RFP generated:", parsed);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "AI generation failed",
//     });
//   }
// };
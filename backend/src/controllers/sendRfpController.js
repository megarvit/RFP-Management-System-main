import RFP from "../models/RFP.js";
import Vendor from "../models/Vendor.js";
import RFPVendorMapping from "../models/RFPVendorMapping.js";
import { sendMail } from "../utils/sendMail.js";

export const sendRFPToVendor = async (req, res) => {
  try {
    const { rfpId, vendorIds } = req.body;

    if (!rfpId || !vendorIds || vendorIds.length === 0) {
      return res.status(400).json({ success: false, message: "RFP ID and at least one vendor required." });
    }

    const rfp = await RFP.findById(rfpId);
    if (!rfp) return res.status(404).json({ success: false, message: "RFP not found" });

    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    if (vendors.length === 0) return res.status(400).json({ success: false, message: "Vendors not found" });

    // Format items as HTML table
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

    // Send emails to all vendors
    await Promise.all(
      vendors.map(v =>
        sendMail({
          to: v.email,
          subject: `New RFP: ${rfp.title}`,
          text: `Hello ${v.name},
You have received a new RFP: ${rfp.title}.
Specification: ${rfp.specification}
Items: ${rfp.items.map(i => `${i.item} (Qty: ${i.quantity})`).join(", ")}
Warranty: ${rfp.warranty}
Payment Terms: ${rfp.paymentTerms}
Budget: ${rfp.budget}
Delivery: ${rfp.delivery}`,
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

    // Save mappings safely (allow multiple vendors, prevent duplicate vendor per RFP)
    const ops = vendors.map(v => ({
      updateOne: {
        filter: { rfpId, vendorId: v._id },
        update: { $setOnInsert: { sentAt: new Date() } },
        upsert: true,
      }
    }));
    await RFPVendorMapping.bulkWrite(ops);

    res.json({ success: true, message: "RFP sent and mapping saved successfully." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send RFP" });
  }
};

// Fetch sent RFPs
export const getSentRFPs = async (req, res) => {
  try {
    const sent = await RFPVendorMapping.find()
      .populate("rfpId")
      .populate("vendorId");
    res.json({ success: true, data: sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch sent RFPs" });
  }
};

// Fetch RFP by ID including assigned vendors
export const getRFPById = async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) return res.status(404).json({ success: false, message: "RFP not found" });

    const mappings = await RFPVendorMapping.find({ rfpId: req.params.id })
      .populate("vendorId");

    // Return array of vendor names
    const assignedVendorNames = mappings.map(m => m.vendorId.name);

    res.json({
      success: true,
      data: {
        ...rfp._doc,
        assignedVendor: assignedVendorNames.length > 0 ? assignedVendorNames : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

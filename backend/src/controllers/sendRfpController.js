import RFP from "../models/RFP.js";
import Vendor from "../models/Vendor.js";
import RFPVendorMapping from "../models/RFPVendorMapping.js";
import { sendMail } from "../utils/sendMail.js";

export const sendRFPToVendor = async (req, res) => {
  try {
    const { rfpId, vendorIds } = req.body; // vendorIds = array

    if (!rfpId || !vendorIds || vendorIds.length === 0) {
      return res.status(400).json({ success: false, message: "RFP ID and at least one vendor required." });
    }

    const rfp = await RFP.findById(rfpId);
    if (!rfp) return res.status(404).json({ success: false, message: "RFP not found" });

    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    if (vendors.length === 0) return res.status(400).json({ success: false, message: "Vendors not found" });

    // Send email
    await Promise.all(
      vendors.map(v =>
        sendMail({
          to: v.email,
          subject: `New RFP: ${rfp.title}`,

          text: `Hello ${v.name},
        You have received a new RFP: ${rfp.title}.
        Description: ${rfp.description}`,

          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>New RFP Received</h2>
              <p>Hello <strong>${v.name}</strong>,</p>
              <p>You have received a new RFP:</p>
              <p><strong>${rfp.title}</strong></p>
              <p>${rfp.description}</p>
              <br />
              <p>Thank you,<br/>RFP Management Team</p>
            </div>
          `,
        })
      )
    );

    // Save mapping in DB
    const mappings = vendors.map(v => ({ rfpId, vendorId: v._id }));
    await RFPVendorMapping.insertMany(mappings);

    res.json({ success: true, message: "RFP sent and mapping saved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send RFP" });
  }
};

export const getSentRFPs = async (req, res) => {
  try {
    const sent = await RFPVendorMapping.find().populate("rfpId").populate("vendorId");
    res.json({ success: true, data: sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch sent RFPs" });
  }
};

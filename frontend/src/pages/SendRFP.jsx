import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function SendRFP() {
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedRFP, setSelectedRFP] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");

  const fetchData = async () => {
    const rfpRes = await api.get("/rfp");
    setRfps(rfpRes.data.data);

    const vendorRes = await api.get("/vendor");
    setVendors(vendorRes.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSend = async () => {
    if (!selectedRFP || !selectedVendor) {
      alert("Select RFP and Vendor");
      return;
    }

    try {
      const res = await api.post("/send-rfp", {
        rfpId: selectedRFP,
        vendorId: selectedVendor,
      });
      alert("RFP sent to vendor!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send RFP");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Send RFP to Vendor</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select RFP</label>
        <select
          value={selectedRFP}
          onChange={(e) => setSelectedRFP(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">-- Select RFP --</option>
          {rfps.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Vendor</label>
        <select
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">-- Select Vendor --</option>
          {vendors.map((v) => (
            <option key={v._id} value={v._id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send RFP
      </button>
    </div>
  );
}

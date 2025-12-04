import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function SendRFP() {
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedRfp, setSelectedRfp] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();
    // optionally preselect rfp if passed via Link state
    if(location.state?.rfpId) setSelectedRfp(location.state.rfpId);
  }, []);

  async function fetchData() {
    try {
      const r = await api.get("/rfp");
      setRfps(r.data.data || []);
      const v = await api.get("/vendor");
      setVendors(v.data.data || []);
    } catch (err) { console.error(err); alert("Failed to load data"); }
  }

  async function handleSend() {
    if(!selectedRfp || !selectedVendor) { alert("Choose both"); return; }
    try {
      const res = await api.post("/send-rfp", { rfpId: selectedRfp, vendorId: selectedVendor });
      if(res.data.success) { alert("Assigned successfully"); navigate("/rfps"); }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign RFP");
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Assign Vendor to RFP</h2>
      <select value={selectedRfp} onChange={e=>setSelectedRfp(e.target.value)} className="w-full p-2 border rounded mb-3">
        <option value="">-- Select RFP --</option>
        {rfps.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
      </select>

      <select value={selectedVendor} onChange={e=>setSelectedVendor(e.target.value)} className="w-full p-2 border rounded mb-3">
        <option value="">-- Select Vendor --</option>
        {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
      </select>

      <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">Assign</button>
    </div>
  );
}

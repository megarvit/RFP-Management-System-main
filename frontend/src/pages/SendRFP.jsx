import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function SendRFP() {
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedRfp, setSelectedRfp] = useState("");
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();
    if (location.state?.rfpId) setSelectedRfp(location.state.rfpId);
  }, []);

  async function fetchData() {
    try {
      const r = await api.get("/rfp");
      const v = await api.get("/vendor");
      setRfps(r.data.data || []);
      setVendors(v.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  }

  function toggleVendor(id) {
    if (selectedVendors.includes(id)) {
      setSelectedVendors(selectedVendors.filter(v => v !== id));
    } else {
      setSelectedVendors([...selectedVendors, id]);
    }
  }

  function toggleSelectAll() {
    if (!selectAll) {
      setSelectedVendors(vendors.map(v => v._id)); 
    } else {
      setSelectedVendors([]);
    }
    setSelectAll(!selectAll);
  }

  async function handleSend() {
    if (!selectedRfp || selectedVendors.length === 0) {
      alert("Please choose RFP and at least one vendor");
      return;
    }

    try {
      const res = await api.post("/send-rfp", {
        rfpId: selectedRfp,
        vendorIds: selectedVendors
      });

      if (res.data.success) {
        alert("RFP sent to vendors");
        navigate("/rfps");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send RFP");
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Send RFP to Vendors</h2>

      {/* RFP Select */}
      <select
        value={selectedRfp}
        onChange={(e) => setSelectedRfp(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">-- Select RFP --</option>
        {rfps.map((r) => (
          <option key={r._id} value={r._id}>
            {r.title}
          </option>
        ))}
      </select>

      {/* Vendors List */}
      {vendors.length > 0 && (
        <div className="border p-3 rounded mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="mr-2"
            />
            <label className="font-semibold">Select All Vendors</label>
          </div>

          {vendors.map((v) => (
            <div key={v._id} className="flex items-center py-1">
              <input
                type="checkbox"
                checked={selectedVendors.includes(v._id)}
                onChange={() => toggleVendor(v._id)}
                className="mr-2"
              />
              <span>{v.name}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Send RFP
      </button>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Dashboard() {
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRFPs();
    fetchVendors();
  }, []);

  const fetchRFPs = async () => {
    try {
      const res = await api.get("/rfp");
      setRfps(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch RFPs", err);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await api.get("/vendor");
      setVendors(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch vendors", err);
    }
  };

  // Compute summary
  const totalRFPs = rfps.length;
  const draftCount = rfps.filter(r => r.status === "draft").length;
  const sentCount = rfps.filter(r => r.status === "sent").length;
  const completedCount = rfps.filter(r => r.status === "completed").length;
  const totalVendors = vendors.length;

  // Show latest 5 RFPs
  const recentRFPs = rfps.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg mb-2">RFP Summary</h3>
          <p>Total RFPs: {totalRFPs}</p>
          <p>Draft: {draftCount}</p>
          <p>Sent: {sentCount}</p>
          <p>Completed: {completedCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg mb-2">Vendor Summary</h3>
          <p>Total Vendors: {totalVendors}</p>
        </div>
      </div>

      {/* Recent RFPs */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold text-lg mb-2">Recent RFPs</h3>
        {recentRFPs.length === 0 ? (
          <p>No RFPs yet</p>
        ) : (
          <ul className="space-y-2">
            {recentRFPs.map(r => (
              <li
                key={r._id}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => navigate(`/rfps/${r._id}`)}
              >
                <span className="font-semibold">{r.title}</span> - <span className="text-gray-600">{r.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded shadow flex space-x-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => navigate("/rfps/create")}
        >
          Create RFP
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/vendors/create")}
        >
          Create Vendor
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => navigate("/rfps")}
        >
          View RFPs
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => navigate("/vendors")}
        >
          View Vendors
        </button>
      </div>
    </div>
  );
}

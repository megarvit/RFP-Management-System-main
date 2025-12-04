import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function RFPList() {
  const [rfps, setRfps] = useState([]);

  useEffect(() => {
    fetchRFPs();
  }, []);

  async function fetchRFPs() {
    try {
      const res = await api.get("/rfp");
      setRfps(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch RFPs");
    }
  }

  // Delete function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this RFP?")) return;

    try {
      const res = await api.delete(`/rfp/${id}`);
      if (res.data.success) {
        alert("RFP deleted successfully");
        fetchRFPs(); // Refresh the list
      } else {
        alert("Failed to delete RFP");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting RFP");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">RFPs</h2>
        <Link
          to="/rfps/create"
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Create RFP
        </Link>
      </div>

      <div className="grid gap-3">
        {rfps.length === 0 && <div>No RFPs yet</div>}
        {rfps.map((r) => (
          <div
            key={r.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-gray-600">{r.description}</div>
            </div>
            <button
              onClick={() => handleDelete(r.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

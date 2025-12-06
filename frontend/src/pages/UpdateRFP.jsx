import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function UpdateRFP() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rfp, setRfp] = useState({
    title: "",
    specification: "",
    budget: "",
    delivery: "",
    warranty: "",
    paymentTerms: "",
    assignedVendor: [],
  });
  const [vendorInput, setVendorInput] = useState(""); // for adding vendors

  useEffect(() => {
    fetchRFP();
  }, []);

  async function fetchRFP() {
    try {
      const res = await api.get(`/rfp/${id}`);
      if (res.data.success) {
        setRfp({
          ...res.data.data,
          assignedVendor: res.data.data.assignedVendor || [],
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch RFP details");
    }
  }

  function addVendor() {
    if (vendorInput && !rfp.assignedVendor.includes(vendorInput)) {
      setRfp(prev => ({
        ...prev,
        assignedVendor: [...prev.assignedVendor, vendorInput],
      }));
      setVendorInput("");
    }
  }

  function removeVendor(name) {
    setRfp(prev => ({
      ...prev,
      assignedVendor: prev.assignedVendor.filter(v => v !== name),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.put(`/rfp/${id}`, rfp);
      alert("RFP updated successfully");
      navigate(`/rfps/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update RFP");
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update RFP</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="font-semibold">Title:</label>
          <input
            type="text"
            value={rfp.title}
            onChange={e => setRfp({ ...rfp, title: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Specification:</label>
          <textarea
            value={rfp.specification}
            onChange={e => setRfp({ ...rfp, specification: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Budget:</label>
          <input
            type="number"
            value={rfp.budget}
            onChange={e => setRfp({ ...rfp, budget: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Delivery:</label>
          <input
            type="text"
            value={rfp.delivery}
            onChange={e => setRfp({ ...rfp, delivery: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Warranty:</label>
          <input
            type="text"
            value={rfp.warranty || ""}
            onChange={e => setRfp({ ...rfp, warranty: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Payment Terms:</label>
          <input
            type="text"
            value={rfp.paymentTerms || ""}
            onChange={e => setRfp({ ...rfp, paymentTerms: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Vendors */}
        <div>
          <label className="font-semibold">Assigned Vendors:</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={vendorInput}
              onChange={e => setVendorInput(e.target.value)}
              placeholder="Add vendor"
              className="flex-1 border p-2 rounded"
            />
            <button type="button" onClick={addVendor} className="bg-blue-500 text-white px-3 rounded">
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {rfp.assignedVendor.map(v => (
              <span
                key={v}
                className="bg-green-200 text-green-800 px-2 py-1 rounded flex items-center gap-1"
              >
                {v}{" "}
                <button type="button" onClick={() => removeVendor(v)}>
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Update RFP
        </button>
      </form>
    </div>
  );
}

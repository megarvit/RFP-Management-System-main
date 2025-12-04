import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await api.get("/vendor");
      setVendors(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch vendors");
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await api.delete(`/vendor/${id}`);
      setVendors((prev) => prev.filter((v) => v._id !== id));
      alert("Vendor deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete vendor");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Vendors</h2>
        <Link
          to="/vendors/create"
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Add Vendor
        </Link>
      </div>

      <div className="grid gap-3">
        {vendors.length === 0 && <div>No vendors yet</div>}

        {vendors.map((v) => (
          <div
            key={v._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center hover:shadow-lg transition-shadow duration-200"
          >
            <div>
              <div className="font-semibold text-lg">{v.name}</div>
              <div className="text-sm text-gray-600">{v.email}</div>
            </div>
            <button
              onClick={() => deleteVendor(v._id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

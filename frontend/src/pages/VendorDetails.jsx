import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function VendorDetails() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchVendor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVendor = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/vendor/${id}`);
      // support both { success: true, data: vendor } and raw vendor
      const v = (res.data && res.data.data) ? res.data.data : res.data;
      setVendor(v || null);
    } catch (err) {
      console.error("Failed to fetch vendor details:", err);
      alert("Failed to fetch vendor details");
      setVendor(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!vendor) return <div className="p-6">Vendor not found</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Vendor Details</h2>

      <div className="space-y-2">
        <p><strong>Name:</strong> {vendor.name}</p>
        <p><strong>Email:</strong> {vendor.email}</p>
        <p><strong>Contact Person:</strong> {vendor.contact_person || "-"}</p>
        <p><strong>Phone:</strong> {vendor.phone || "-"}</p>
        <p><strong>Address:</strong> {vendor.address || "-"}</p>
        <p><strong>Notes:</strong> {vendor.notes || "-"}</p>
      </div>

      <div className="mt-6 flex gap-2">
        <Link
          to="/vendors"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back
        </Link>
      </div>
    </div>
  );
}

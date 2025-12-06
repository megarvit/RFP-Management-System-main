import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function VendorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    contact_person: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendor();
    // eslint-disable-next-line
  }, [id]);

  const fetchVendor = async () => {
    try {
      const res = await api.get(`/vendor/${id}`);
      setVendor(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/vendor/${id}`, vendor);
      alert("Vendor updated successfully");
      navigate(`/vendors/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update vendor");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Vendor</h2>

      <form onSubmit={handleUpdate} className="space-y-3">
        <input
          name="name"
          value={vendor.name}
          onChange={handleChange}
          placeholder="Vendor Name"
          required
          className="w-full p-2 border rounded"
        />

        <input
          name="email"
          type="email"
          value={vendor.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />

        <input
          name="contact_person"
          value={vendor.contact_person}
          onChange={handleChange}
          placeholder="Contact Person"
          className="w-full p-2 border rounded"
        />

        <input
          name="phone"
          value={vendor.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />

        <textarea
          name="address"
          value={vendor.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 border rounded"
        />

        <textarea
          name="notes"
          value={vendor.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

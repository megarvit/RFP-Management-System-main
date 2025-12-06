import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/api'

export default function RFPDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rfp, setRfp] = useState(null)

  useEffect(() => {
    fetchRFP()
  }, [])

  async function fetchRFP() {
    try {
      const res = await api.get(`/rfp/${id}`)
      setRfp(res.data.data || res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to fetch RFP details')
    }
  }

  if (!rfp) return <div>Loading...</div>

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{rfp.title}</h2>

      <p className="mb-2"><strong>Specification:</strong> {rfp.specification}</p>
      <p className="mb-2"><strong>Budget:</strong> ${rfp.budget}</p>
      <p className="mb-2"><strong>Delivery:</strong> {rfp.delivery}</p>
      <p className="mb-2"><strong>Warranty:</strong> {rfp.warranty || "N/A"}</p>
      <p className="mb-2"><strong>Payment Terms:</strong> {rfp.paymentTerms || "N/A"}</p>

      {/* Items */}
      {rfp.items && rfp.items.length > 0 && (
        <div className="mb-2">
          <strong>Items:</strong>
          <ul className="list-disc list-inside">
            {rfp.items.map((item, idx) => (
              <li key={idx}>
                {item.item} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assigned Vendor */}
      <p className="mb-2">
        <strong>Assigned Vendor:</strong>{" "}
        {rfp.assignedVendor ? (
          Array.isArray(rfp.assignedVendor) ? (
            rfp.assignedVendor.join(", ")
          ) : (
            <span className="text-green-700">{rfp.assignedVendor}</span>
          )
        ) : (
          <span className="text-red-500">Not Assigned Yet</span>
        )}
      </p>

      <button
        onClick={() => navigate(`/send-rfp/${rfp._id}`)}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Send RFP
      </button>
      <button
        onClick={() => navigate("/rfps")}
        className="mt-4 ml-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back
      </button>
    </div>
  )
}

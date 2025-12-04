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

      <p className="mb-2"><strong>Description:</strong> {rfp.description}</p>
      <p className="mb-2"><strong>Budget:</strong> {rfp.budget}</p>
      <p className="mb-2"><strong>Delivery:</strong> {rfp.delivery}</p>
      <p className="mb-2"><strong>Status:</strong> {rfp.status}</p>
      <p className="mb-2"><strong>Created By:</strong> {rfp.created_by}</p>
      <p className="mb-2"><strong>Created At:</strong> {new Date(rfp.createdAt).toLocaleString()}</p>
      <p className="mb-2"><strong>Updated At:</strong> {new Date(rfp.updatedAt).toLocaleString()}</p>

      {/* Assigned Vendor */}
      <p className="mb-2">
        <strong>Assigned Vendor:</strong>{" "}
        {rfp.assignedVendor ? (
          <span className="text-green-700">{rfp.assignedVendor}</span>
        ) : (
          <span className="text-red-500">Not Assigned Yet</span>
        )}
      </p>

      {/* Map Vendor Button */}
      <Link
        to={`/map/${rfp._id}`}
        className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Map Vendor
      </Link>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 ml-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back
      </button>
    </div>
  )
}

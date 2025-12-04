import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/api'

export default function RFPList() {
    const [rfps, setRfps] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchRFPs()
    }, [])

    async function fetchRFPs() {
        try {
            const res = await api.get('/rfp')

            // Backend returns { success: true, data: [...] }
            setRfps(res.data.data || [])
        } catch (err) {
            console.error(err)
            alert('Failed to fetch RFPs')
        }
    }

    async function deleteRFP(id) {
        try {
            await api.delete(`/rfp/${id}`)
            setRfps(prev => prev.filter(r => r._id !== id))
            alert("RFP deleted successfully")
        } catch (err) {
            console.error("Delete failed", err)
            alert("Failed to delete RFP")
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">RFPs</h2>
                <Link
                    to="/rfps/create"
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                    Create RFP
                </Link>
            </div>

            <div className="grid gap-3">
                {rfps.length === 0 && <div>No RFPs yet</div>}

                {rfps.map(r => (
                    <div
                        key={r._id}
                        className="bg-white p-4 rounded shadow flex justify-between items-center hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                        onClick={() => navigate(`/rfps/${r._id}`)}
                    >
                        <div>
                            <div className="font-semibold text-lg">{r.title}</div>

                            <div className="text-sm text-gray-600">{r.description}</div>

                            {/* Assigned Vendor Section */}
                            <div className="text-sm mt-2">
                                <span className="font-semibold">Assigned Vendor:</span>{" "}
                                {r.assignedVendor ? (
                                    <span className="text-green-700">{r.assignedVendor}</span>
                                ) : (
                                    <span className="text-red-500">Not Assigned Yet</span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                deleteRFP(r._id)
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

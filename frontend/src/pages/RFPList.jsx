import React, { useEffect, useState } from 'react'
import api from '../api/api'
import { Link } from 'react-router-dom'

export default function RFPList() {
    const [rfps, setRfps] = useState([])

    useEffect(() => {
        fetchRFPs()
    }, [])

    async function fetchRFPs() {
        try {
            const res = await api.get('/rfp')
            setRfps(res.data.data || res.data)
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
                        className="bg-white p-4 rounded shadow flex justify-between items-center hover:shadow-lg transition-shadow duration-200"
                    >
                        <div>
                            <div className="font-semibold text-lg">{r.title}</div>
                            <div className="text-sm text-gray-600">{r.description}</div>
                        </div>

                        <button
                            onClick={() => deleteRFP(r._id)}
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

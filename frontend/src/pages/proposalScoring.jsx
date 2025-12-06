import React, { useState, useEffect } from "react";
import axios from "axios";

const ProposalScoring = () => {
  const [rfps, setRfps] = useState([]);
  const [selectedRfp, setSelectedRfp] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all RFPs
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/rfp`)
      .then(res => setRfps(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const viewProposals = (rfp) => {
    setSelectedRfp(rfp);
    setLoading(true);

    // Simulate fetching proposals from API
    // Replace this with real API call later
    setTimeout(() => {
      const dummyProposals = [
        { vendor: "Vendor A", proposal: "Proposal text A", score: Math.floor(Math.random() * 100), explanation: "Best quality" },
        { vendor: "Vendor B", proposal: "Proposal text B", score: Math.floor(Math.random() * 100), explanation: "Good price" },
        { vendor: "Vendor C", proposal: "Proposal text C", score: Math.floor(Math.random() * 100), explanation: "Fast delivery" },
      ];

      // Sort descending by score
      dummyProposals.sort((a, b) => b.score - a.score);

      setProposals(dummyProposals);
      setLoading(false);
    }, 500);
  };

  const assignRfp = (vendor) => {
    // Call API to assign RFP to vendor
    axios.post(`${import.meta.env.VITE_API_URL}/send-rfp/send`, {
      rfpId: selectedRfp._id,
      vendorIds: [vendor.vendorId || 1] // Replace dummy vendorId with real one
    })
    .then(res => {
      alert(`RFP assigned to ${vendor.vendor}`);
      setSelectedRfp(null);
      setProposals([]);
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">RFPs</h1>
      <table className="min-w-full border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Assigned Vendor</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rfps.map(rfp => (
            <tr key={rfp._id}>
              <td className="px-4 py-2 border">{rfp.title}</td>
              <td className="px-4 py-2 border">{rfp.assignedVendor || "-"}</td>
              <td className="px-4 py-2 border">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => viewProposals(rfp)}
                >
                  View Proposals
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRfp && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Proposals for: {selectedRfp.title}</h2>
          {loading ? (
            <p>Loading proposals...</p>
          ) : proposals.length === 0 ? (
            <p>No proposals yet.</p>
          ) : (
            <table className="min-w-full border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Vendor</th>
                  <th className="px-4 py-2 border">Proposal</th>
                  <th className="px-4 py-2 border">Score</th>
                  <th className="px-4 py-2 border">Explanation</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border">{p.vendor}</td>
                    <td className="px-4 py-2 border">{p.proposal}</td>
                    <td className="px-4 py-2 border">{p.score}</td>
                    <td className="px-4 py-2 border">{p.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {proposals.length > 0 && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => assignRfp(proposals[0])}
            >
              Assign to Best Vendor
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProposalScoring;

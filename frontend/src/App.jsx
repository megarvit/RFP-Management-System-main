import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import RFPList from './pages/RFPList'
import CreateRFP from './pages/CreateRFP'
import RFPDetails from './pages/RFPDetails'
import VendorList from "./pages/VendorList"
import CreateVendor from "./pages/CreateVendor"
import SendRFP from "./pages/SendRFP";
import ProposalScoring from "./pages/proposalScoring";


export default function App(){
return (
<div className="min-h-screen bg-gray-100">
<nav className="bg-white shadow p-4 flex justify-between">
<div className="font-bold">AI-RFP</div>
<div className="space-x-4">
<Link to="/">Dashboard</Link>
<Link to="/rfps">RFPs</Link>
<Link to="/rfps/send">Mail</Link>
<Link to="/vendors">Vendors</Link>
<Link to="/proposals">Proposals</Link>
</div>
</nav>


<main className="p-6">
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rfps" element={<RFPList />} />
        <Route path="/rfps/create" element={<CreateRFP />} />
        <Route path="/rfps/:id" element={<RFPDetails />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/vendors/create" element={<CreateVendor />} />
        <Route path="/rfps/send" element={<SendRFP />} />
        <Route path="/proposals" element={<ProposalScoring />} />
    </Routes>
</main>
</div>
)
}
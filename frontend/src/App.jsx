import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import RFPList from './pages/RFPList'
import CreateRFP from './pages/CreateRFP'
import RFPDetails from './pages/RFPDetails'


export default function App(){
return (
<div className="min-h-screen bg-gray-100">
<nav className="bg-white shadow p-4 flex justify-between">
<div className="font-bold">AI-RFP</div>
<div className="space-x-4">
<Link to="/">Dashboard</Link>
<Link to="/rfps">RFPs</Link>
</div>
</nav>


<main className="p-6">
<Routes>
<Route path="/" element={<Dashboard />} />
<Route path="/login" element={<Login />} />
<Route path="/rfps" element={<RFPList />} />
<Route path="/rfps/create" element={<CreateRFP />} />
<Route path="/rfps/:id" element={<RFPDetails />} />
</Routes>
</main>
</div>
)
}
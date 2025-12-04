import React, { useState } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'


export default function Login(){
const [email, setEmail] = useState('admin@test.com')
const [password, setPassword] = useState('123456')
const navigate = useNavigate()


const submit = async (e) => {
e.preventDefault()
try{
const res = await api.post('/users/login', { email, password })
const token = res.data.token || res.data.accessToken
if(token) localStorage.setItem('token', token)
navigate('/')
}catch(err){
alert('Login failed: '+(err.response?.data?.message || err.message))
}
}


return (
<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
<h2 className="text-xl mb-4">Login</h2>
<form onSubmit={submit} className="space-y-3">
<input className="w-full p-2 border" value={email} onChange={e=>setEmail(e.target.value)} />
<input type="password" className="w-full p-2 border" value={password} onChange={e=>setPassword(e.target.value)} />
<button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
</form>
</div>
)
}
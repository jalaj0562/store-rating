import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  async function onSubmit(e){
    e.preventDefault()
    setError('')
    try{
      await api('/auth/signup', { method:'POST', body: JSON.stringify({ name, email, address, password }) })
      navigate('/login')
    }catch(e){ setError(e.message) }
  }
  return (
    <form onSubmit={onSubmit} style={{maxWidth:420, display:'grid', gap:8}}>
      <h2>Sign up (Normal User)</h2>
      <input placeholder="Full name (20-60 chars)" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Address (<= 400 chars)" value={address} onChange={e=>setAddress(e.target.value)} />
      <input placeholder="Password (8-16; 1 uppercase & special)" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <button>Create account</button>
    </form>
  )
}

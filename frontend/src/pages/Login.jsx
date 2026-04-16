import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  async function onSubmit(e){
    e.preventDefault()
    setError('')
    try{
      const data = await api('/auth/login', { method:'POST', body: JSON.stringify({ email, password }) })
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      navigate('/')
    }catch(e){ setError(e.message) }
  }
  return (
    <form onSubmit={onSubmit} style={{maxWidth:360, display:'grid', gap:8}}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <button>Login</button>
      <div>New here? <Link to="/signup">Sign up</Link></div>
    </form>
  )
}

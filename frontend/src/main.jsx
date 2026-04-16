import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Stores from './pages/Stores.jsx'
import Admin from './pages/Admin.jsx'
import Owner from './pages/Owner.jsx'

function AppShell() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const navigate = useNavigate()
  const logout = () => { localStorage.clear(); navigate('/login') }
  return (
    <div style={{fontFamily:'system-ui', padding:16}}>
      <nav style={{display:'flex', gap:12, marginBottom:16}}>
        <Link to="/">Stores</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/owner">Owner</Link>
        {!token ? <Link to="/login">Login</Link> : <button onClick={logout}>Logout</button>}
      </nav>
      <Routes>
        <Route path="/" element={<Stores/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/admin" element={ role==='ADMIN' ? <Admin/> : <Navigate to="/login" /> } />
        <Route path="/owner" element={ role==='OWNER' ? <Owner/> : <Navigate to="/login" /> } />
      </Routes>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppShell/>
  </BrowserRouter>
)

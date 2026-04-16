import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Admin(){
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  async function load(){
    try{
      const st = await api('/admin/dashboard')
      setStats(st)
      const u = await api('/admin/users?search='+encodeURIComponent(search))
      setUsers(u.items)
      const s = await api('/admin/stores?search='+encodeURIComponent(search))
      setStores(s.items)
    }catch(e){ setError(e.message) }
  }
  useEffect(()=>{ load() }, [])

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <div style={{display:'flex', gap:16, marginBottom:12}}>
        <div>Users: {stats?.totalUsers ?? '-'}</div>
        <div>Stores: {stats?.totalStores ?? '-'}</div>
        <div>Ratings: {stats?.totalRatings ?? '-'}</div>
      </div>
      <div style={{marginBottom:8}}>
        <input placeholder="Search (name/email/address)" value={search} onChange={e=>setSearch(e.target.value)} />
        <button onClick={load} style={{marginLeft:8}}>Apply</button>
      </div>
      <h3>Users</h3>
      <table border="1" cellPadding="6" style={{borderCollapse:'collapse', width:'100%', marginBottom:16}}>
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
        <tbody>{users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td></tr>)}</tbody>
      </table>
      <h3>Stores</h3>
      <table border="1" cellPadding="6" style={{borderCollapse:'collapse', width:'100%'}}>
        <thead><tr><th>Name</th><th>Email</th><th>Address</th></tr></thead>
        <tbody>{stores.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.email ?? '-'}</td><td>{s.address}</td></tr>)}</tbody>
      </table>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Stores(){
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [order, setOrder] = useState('asc')
  const [error, setError] = useState('')

  async function load(){
    setError('')
    try{
      const q = new URLSearchParams({ search, sortBy, order })
      const data = await api(`/stores?${q}`)
      setItems(data.items); setTotal(data.total)
    }catch(e){ setError(e.message) }
  }
  useEffect(()=>{ load() }, [])

  async function rate(storeId, value){
    try{
      await api(`/stores/${storeId}/ratings`, { method:'POST', body: JSON.stringify({ value }) })
      await load()
    }catch(e){ alert(e.message) }
  }

  return (
    <div>
      <h2>Stores</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Search by name or address" value={search} onChange={e=>setSearch(e.target.value)} />
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="name">Name</option>
          <option value="address">Address</option>
          <option value="updatedAt">Updated</option>
        </select>
        <select value={order} onChange={e=>setOrder(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        <button onClick={load}>Apply</button>
      </div>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <table border="1" cellPadding="6" style={{borderCollapse:'collapse', width:'100%'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>My Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.overallRating?.average?.toFixed(2)} ({s.overallRating?.count})</td>
              <td>{s.myRating ?? '-'}</td>
              <td>
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={()=>rate(s.id, v)} style={{marginRight:4}}>{v}</button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:8}}>Total: {total}</div>
    </div>
  )
}

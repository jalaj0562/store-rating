import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Owner(){
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(()=>{
    (async ()=>{
      try{
        const res = await api('/owner/store/ratings')
        setData(res)
      }catch(e){ setError(e.message) }
    })()
  },[])
  return (
    <div>
      <h2>Owner Dashboard</h2>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      {data && (
        <>
          <div>Average rating: {data.average?.toFixed(2)} ({data.count})</div>
          <h3>Ratings</h3>
          <table border="1" cellPadding="6" style={{borderCollapse:'collapse', width:'100%'}}>
            <thead><tr><th>User</th><th>Email</th><th>Value</th><th>Date</th></tr></thead>
            <tbody>
              {data.ratings.map(r => (
                <tr key={r.id}>
                  <td>{r.user.name}</td>
                  <td>{r.user.email}</td>
                  <td>{r.value}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

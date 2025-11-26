import React, { useEffect, useState } from 'react'
import { mockApi } from '../services/mockApi'
import { Link } from 'react-router-dom'

export default function AdminDashboard(){
  const [reports, setReports] = useState([])
  const [query, setQuery] = useState('')

  const load = async ()=>{
    const rows = await mockApi.listReports()
    setReports(rows)
  }

  useEffect(()=>{ load() },[])

  const handleDelete = async (id) =>{
    if (!confirm('Delete this report?')) return
    const ok = await mockApi.deleteReport(id)
    if (ok) load()
    else alert('Delete failed')
  }

  const filtered = reports.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.ownerName.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="page">
      <div className="info-container">
      <div className="page-header">
        <div>
          <h2>Admin Dashboard</h2>
          <div className="muted small">Total reports: {reports.length}</div>
          <div style={{display:'flex',gap:12,marginTop:8}}>
            {['Open','In Progress','Resolved'].map(s=>{
              const count = reports.filter(r=>r.status===s).length
              return <div key={s} style={{background:'#fff',padding:'6px 10px',borderRadius:8,boxShadow:'0 4px 10px rgba(2,6,23,0.04)'}}>{s}: <strong>{count}</strong></div>
            })}
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input placeholder="Search reports or owner" value={query} onChange={e=>setQuery(e.target.value)} />
        </div>
      </div>
  <div className="list">
        {filtered.map(r=> (
          <div key={r.id} className="list-item report-row">
            <div className="report-main">
              <Link to={`/report/${r.id}`} className="report-title">{r.title}</Link>
              <div className="muted small">
                <span className="meta">{r.ownerName}</span>
                <span className="meta">{r.category}</span>
                {r.roomNumber && <span className="meta">{r.roomNumber}</span>}
                {r.contact && <span className="meta">{r.contact}</span>}
                <span className={`status-badge ${r.status.replace(/\s+/g,'').toLowerCase()}`}>{r.status}</span>
              </div>
            </div>
            <div className="list-actions">
              <Link to={`/report/${r.id}`}>🔎 Open</Link>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockApi } from '../services/mockApi'
import { useAuth } from '../contexts/AuthContext'

export default function Reports(){
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [query, setQuery] = useState('')

  const load = async () => {
    const rows = await mockApi.listReports({ ownerId: user.id })
    setReports(rows)
  }

  useEffect(()=>{ load() },[user])

  const filtered = reports.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="page">
      <div className="info-container">
      <div className="page-header">
        <h2>My Reports</h2>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input placeholder="Search reports" value={query} onChange={e=>setQuery(e.target.value)} />
          <Link to="/report/new" className="btn-primary">＋ New Report</Link>
        </div>
  </div>
  <div className="list">
        {filtered.length === 0 && <p className="muted">No reports yet.</p>}
        {filtered.map(r=> (
          <div key={r.id} className="list-item report-row">
            <div className="report-main">
              <Link to={`/report/${r.id}`} className="report-title">{r.title}</Link>
              <div className="muted small">
                <span className="meta">{r.category}</span>
                {r.roomNumber && <span className="meta">{r.roomNumber}</span>}
                {r.contact && <span className="meta">{r.contact}</span>}
                <span className={`status-badge ${r.status.replace(/\s+/g,'').toLowerCase()}`}>{r.status}</span>
              </div>
            </div>
            <div className="list-actions">
              <Link to={`/report/${r.id}`}>👁️ View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

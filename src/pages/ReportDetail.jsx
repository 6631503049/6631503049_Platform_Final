import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockApi } from '../services/mockApi'
import { useAuth } from '../contexts/AuthContext'

export default function ReportDetail(){
  const { id } = useParams()
  const { user } = useAuth()
  const [report, setReport] = useState(null)
  const [comment, setComment] = useState('')
  const nav = useNavigate()

  useEffect(()=>{
    (async()=>{
      const r = await mockApi.getReport(id)
      setReport(r)
    })()
  },[id])

  if (!report) return <div className="page"><p>Loading...</p></div>

  const handleDelete = async () => {
    if (!confirm('Delete this report?')) return
    const ok = await mockApi.deleteReport(report.id)
    if (ok) nav(user.role === 'admin' ? '/admin' : '/reports')
    else alert('Delete failed')
  }

  const handleAddComment = async () => {
    if (!comment) return
    await mockApi.addComment(report.id, { author: user.name, text: comment, createdAt: Date.now(), authorId: user.id })
    const updated = await mockApi.getReport(report.id)
    setReport(updated)
    setComment('')
  }

  const handleStatus = async (status) => {
    await mockApi.updateReport(report.id, { status })
    const updated = await mockApi.getReport(report.id)
    setReport(updated)
  }

  const canEdit = user.role === 'admin' || user.id === report.ownerId

  return (
    <div className="page">
      <div className="info-container">
        <div className="card">
        <h2>{report.title}</h2>
        <div className="muted">{report.category} • {report.status}</div>
        <p>{report.description}</p>
  <div className="muted small">Reported by: {report.ownerName}</div>
  {report.roomNumber && <div className="muted small">Room: {report.roomNumber}</div>}
  {report.contact && <div className="muted small">Contact: {report.contact}</div>}

        <div className="divider" />

        <h3>Comments</h3>
        <div className="comments">
          {report.comments.map(c=> (
            <div key={c.id} className="comment">
              <div className="comment-author">{c.author}</div>
              <div className="comment-text">{c.text}</div>
            </div>
          ))}
        </div>

        <div className="comment-form">
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write a comment..." />
          <button onClick={handleAddComment} className="btn-primary">Add Comment</button>
        </div>

        <div className="actions">
          <button className="btn" onClick={()=>nav(-1)}>Back</button>
          {canEdit && <button className="btn-danger" onClick={handleDelete}>Delete Report</button>}
          {canEdit && <button className="btn" onClick={()=>nav(`/report/${report.id}/edit`)}>Edit</button>}
          {user.role === 'admin' && (
            <>
              <button onClick={()=>handleStatus('In Progress')} className="btn">Mark In Progress</button>
              <button onClick={()=>handleStatus('Resolved')} className="btn">Mark Resolved</button>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

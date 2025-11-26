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

  const handleDeleteComment = async (commentId, authorId) => {
    if (!confirm('Delete this comment?')) return
    // allow deletion if admin or comment author
    if (user.role !== 'admin' && user.id !== authorId) {
      alert('Not allowed to delete this comment')
      return
    }
    const ok = await mockApi.deleteComment(report.id, commentId)
    if (!ok) return alert('Delete failed')
    // refresh current report so the comment list updates (stay on page)
    const updated = await mockApi.getReport(report.id)
    setReport(updated)
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
  <div className="muted">Reported by: {report.ownerName}</div>
  {report.roomNumber && <div className="muted">Room: {report.roomNumber}</div>}
  {report.contact && <div className="muted">Contact: {report.contact}</div>}

        <div className="divider" />

        <h3>Comments</h3>
        <div className="comments">
          {report.comments.map(c=> (
            <div key={c.id} className="comment">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div className="comment-author">{c.author}</div>
                  <div className="comment-text">{c.text}</div>
                </div>
                <div>
                  {(user.role === 'admin' || user.id === c.authorId) && (
                    <button className="btn-danger" onClick={()=>handleDeleteComment(c.id, c.authorId)}>Delete</button>
                  )}
                </div>
              </div>
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
              <button onClick={()=>handleStatus('In Progress')} className="btn-InProgress">Mark In Progress</button>
              <button onClick={()=>handleStatus('Resolved')} className="btn-Resolved">Mark Resolved</button>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

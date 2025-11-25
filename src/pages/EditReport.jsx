import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockApi } from '../services/mockApi'
import { useAuth } from '../contexts/AuthContext'

export default function EditReport(){
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const [report, setReport] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('General')
  const [description, setDescription] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [contact, setContact] = useState('')

  useEffect(()=>{
    (async()=>{
      const r = await mockApi.getReport(id)
      setReport(r)
      if (r){
        setTitle(r.title)
        setCategory(r.category)
        setDescription(r.description)
        setRoomNumber(r.roomNumber || '')
        setContact(r.contact || '')
      }
    })()
  },[id])

  if (!report) return <div className="page"><p>Loading...</p></div>

  const canEdit = user.role === 'admin' || user.id === report.ownerId
  if (!canEdit) return <div className="page"><p>Not allowed</p></div>

  const handleSave = async (e) => {
    e.preventDefault()
    await mockApi.updateReport(report.id, { title, category, description, roomNumber, contact })
    nav(-1)
  }

  return (
    <div className="page">
      <div className="info-container">
        <div className="card">
        <h2>Edit Report</h2>
        <form onSubmit={handleSave}>
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} />
          <label>Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Furniture</option>
            <option>General</option>
          </select>
          <label>Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} />
          <label>Room / Address</label>
          <input value={roomNumber} onChange={e=>setRoomNumber(e.target.value)} placeholder="e.g., B12-304" />
          <label>Contact</label>
          <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="phone or email" />
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <button className="btn-primary" type="submit">Save</button>
            <button type="button" className="btn" onClick={()=>nav(-1)}>Back</button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}

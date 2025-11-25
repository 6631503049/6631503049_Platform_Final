import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockApi } from '../services/mockApi'
import { useAuth } from '../contexts/AuthContext'

export default function ReportForm(){
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('General')
  const [description, setDescription] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [contact, setContact] = useState('')
  const { user } = useAuth()
  const nav = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await mockApi.createReport({ title, category, description, roomNumber, contact, ownerId: user.id, ownerName: user.name })
    nav('/reports')
  }

  return (
    <div className="page">
      <div className="info-container">
        <div className="card">
        <h2>Report a Problem</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} required />
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
          <button className="btn-primary" type="submit">Submit</button>
        </form>
      </div>
    </div>
    </div>
  )
}

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar--navy">
      <div className="nav-left">
        <Link to="/reports" className="brand small-brand">Dom Care</Link>
        <Link to="/admin" className="brand large-brand">Dom Care Connect</Link>
      </div>
      <div className="nav-right">
        <button className="btn-ghost nav-btn" onClick={()=>navigate(-1)} title="Back">← Back</button>
        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button className="btn-ghost nav-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
    </nav>
  )
}

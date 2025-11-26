import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const u = await login({ email, password })
      if (u.role === 'admin') navigate('/admin')
      else navigate('/reports')
    } catch (err) {
      setError(err.message)
    }
  }

  return (

    <div className="page auth-page">
      <div className="card card-sm">
        <div style={{display: 'flex', justifyContent: 'center', fontSize: '16px'}}>
            <h2 style={{margin: '10px'}}>Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="user@example.com" />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
          {error && <div className="error">{error}</div>}
          <button className="btn-primary" type="submit">Login</button>
        </form>
        </div>

        <div className="user-info">
        <p className="muted_info">User role: user@example.com Password: password</p>
        <p className="muted_info">Admin role: admin@example.com Password: admin</p>

        </div>
    </div>

  )
}

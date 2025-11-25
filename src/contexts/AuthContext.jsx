import React, { createContext, useContext, useEffect, useState } from 'react'
import { mockApi } from '../services/mockApi'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('dcc_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = async ({ email, password }) => {
    const u = await mockApi.login({ email, password })
    setUser(u)
    localStorage.setItem('dcc_user', JSON.stringify(u))
    return u
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('dcc_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

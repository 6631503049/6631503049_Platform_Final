import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Reports from './pages/Reports'
import ReportForm from './pages/ReportForm'
import ReportDetail from './pages/ReportDetail'
import EditReport from './pages/EditReport'
import AdminDashboard from './pages/AdminDashboard'
import './index.css'

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/reports" element={<ProtectedRoute><Reports/></ProtectedRoute>} />
          <Route path="/report/new" element={<ProtectedRoute><ReportForm/></ProtectedRoute>} />
          <Route path="/report/:id" element={<ProtectedRoute><ReportDetail/></ProtectedRoute>} />
          <Route path="/report/:id/edit" element={<ProtectedRoute><EditReport/></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

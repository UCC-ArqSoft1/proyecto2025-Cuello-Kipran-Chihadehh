import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login/Login'
import PaginaPrincipal from './components/PaginaPrincipal/PaginaPrincipal'
import ErrorBoundary from './ErrorBoundary/ErrorBoundary'
import { AuthProvider, useAuth } from './context/AuthContext'
import UserList from "./components/users/UserList"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Cargando...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <PaginaPrincipal />
            </ProtectedRoute>
          } />
          <Route path="/activities" element={<Navigate to="/" />} />
          <Route path="/users" element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          } />
          {/* Ruta catch-all para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
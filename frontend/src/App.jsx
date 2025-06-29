import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import PaginaPrincipal from './components/PaginaPrincipal/PaginaPrincipal';
import PaginaInicio from './components/PaginaInicio/PaginaInicio';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserList from "./components/users/UserList";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Página pública */}
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard protegido */}
          <Route
            path="/pagina-principal"
            element={
              <ProtectedRoute>
                <PaginaPrincipal />
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida para usuarios */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

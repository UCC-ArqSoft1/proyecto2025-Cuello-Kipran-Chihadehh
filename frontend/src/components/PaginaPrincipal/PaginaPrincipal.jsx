import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom' // Importar useNavigate
import ActivityList from '../Activities/ActivityList'
import ActivityForm from '../Activities/ActivityForm'
import './PaginaPrincipal.css'
import UserList from '../users/UserList'

const PaginaPrincipal = () => {
    const { user, logout, authenticatedFetch } = useAuth()
    const navigate = useNavigate() // Hook para navegación
    const [activeSection, setActiveSection] = useState('dashboard')
    const [activities, setActivities] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleLogout = async () => {
        try {
            await logout() // Ejecutar logout del contexto
            navigate('/login', { replace: true }) // Redirigir al login
        } catch (error) {
            console.error('Error durante el logout:', error)
            // Incluso si hay error, redirigir al login
            navigate('/login', { replace: true })
        }
    }

    const loadActivities = async () => {
        try {
            setLoading(true)
            const response = await authenticatedFetch('http://localhost:8080/activities')
            if (response.ok) {
                const data = await response.json()
                setActivities(data)
            }
        } catch (err) {
            setError('Error cargando actividades: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const loadUsers = async () => {
        try {
            setLoading(true)
            const response = await authenticatedFetch('http://localhost:8080/users')
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            }
        } catch (err) {
            setError('Error cargando usuarios: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const createActivity = async (activityData) => {
        try {
            const response = await authenticatedFetch('http://localhost:8080/activities', {
                method: 'POST',
                body: JSON.stringify(activityData)
            })
            if (response.ok) {
                await loadActivities()
                return true
            }
            return false
        } catch (err) {
            setError('Error creando actividad: ' + err.message)
            return false
        }
    }

    const updateActivity = async (id, activityData) => {
        try {
            const response = await authenticatedFetch(`http://localhost:8080/activities/${id}`, {
                method: 'PUT',
                body: JSON.stringify(activityData)
            })
            if (response.ok) {
                await loadActivities()
                return true
            }
            return false
        } catch (err) {
            setError('Error actualizando actividad: ' + err.message)
            return false
        }
    }

    const deleteActivity = async (id) => {
        try {
            const response = await authenticatedFetch(`http://localhost:8080/activities/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                await loadActivities()
                return true
            }
            return false
        } catch (err) {
            setError('Error eliminando actividad: ' + err.message)
            return false
        }
    }

    // Verificar si el usuario está autenticado
    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true })
        }
    }, [user, navigate])

    useEffect(() => {
        if (activeSection === 'activities') {
            loadActivities()
        } else if (activeSection === 'users') {
            loadUsers()
        }
    }, [activeSection])

    // Si no hay usuario, no renderizar nada (se redirigirá)
    if (!user) {
        return <div className="loading">Cargando...</div>
    }

    const renderContent = () => {
        if (loading) {
            return <div className="loading">Cargando...</div>
        }

        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="dashboard">
                        <h2>Dashboard</h2>
                        <p>Bienvenido al sistema de gestión, {user?.username}</p>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Actividades</h3>
                                <p>{activities.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Usuarios</h3>
                                <p>{users.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Sistema</h3>
                                <p>Operativo</p>
                            </div>
                        </div>
                    </div>
                )
            case 'activities':
                return (
                    <div className="activities-section">
                        <h2>Gestión de Actividades</h2>
                        <div className="section-controls">
                            <button onClick={() => setActiveSection('create-activity')}>
                                Nueva Actividad
                            </button>
                        </div>
                        <ActivityList
                            activities={activities}
                            onUpdate={updateActivity}
                            onDelete={deleteActivity}
                        />
                    </div>
                )
            case 'create-activity':
                return (
                    <div className="create-activity-section">
                        <h2>Crear Nueva Actividad</h2>
                        <button onClick={() => setActiveSection('activities')}>
                            Volver a Actividades
                        </button>
                        <ActivityForm
                            onSubmit={createActivity}
                            onCancel={() => setActiveSection('activities')}
                        />
                    </div>
                )
            case 'users':
                return (
                    <div className="users-section">
                        <h2>Gestión de Usuarios</h2>
                        <UserList users={users} />
                    </div>
                )
            default:
                return <div>Sección no encontrada</div>
        }
    }

    return (
        <div className="pagina-principal">
            <header className="header">
                <div className="header-content">
                    <h1>Panel Principal</h1>

                    {/* Navegación movida al header */}
                    <nav className="header-nav">
                        <button
                            onClick={() => setActiveSection('dashboard')}
                            className={`nav-button ${activeSection === 'dashboard' ? 'active' : ''}`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveSection('activities')}
                            className={`nav-button ${activeSection === 'activities' || activeSection === 'create-activity' ? 'active' : ''}`}
                        >
                            Actividades
                        </button>
                        <button
                            onClick={() => setActiveSection('users')}
                            className={`nav-button ${activeSection === 'users' ? 'active' : ''}`}
                        >
                            Usuarios
                        </button>
                    </nav>

                    <div className="user-info">
                        <span>Bienvenido, {user?.username}</span>
                        <button onClick={handleLogout} className="logout-button">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <div className="main-layout">
                <main className="main-content">
                    {error && (
                        <div className="error-message">
                            {error}
                            <button onClick={() => setError(null)}>×</button>
                        </div>
                    )}
                    {renderContent()}
                </main>
            </div>
        </div>
    )
}

export default PaginaPrincipal
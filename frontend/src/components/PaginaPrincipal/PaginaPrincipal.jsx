// MultipleFiles/PaginaPrincipal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ActivityList from '../Activities/ActivityList';
import ActivityForm from '../Activities/ActivityForm';
import './PaginaPrincipal.css';
import UserList from '../users/UserList';
import MyActivities from '../Activities/myactivities';


const PaginaPrincipal = () => {
  const { user, logout, authenticatedFetch, isAdmin } = useAuth(); // Importar isAdmin
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => logout();

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = localStorage.getItem('authToken'); // Usar localStorage para el token

    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
  };

  const loadActivities = async () => {
    try {
      setLoading(true);
      const fetchFunction = authenticatedFetch || makeAuthenticatedRequest;
      const response = await fetchFunction('http://localhost:8080/activities');
      if (response.ok) {
        const data = await response.json();
        const activitiesArray = data.activities || data;
        setActivities(activitiesArray);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError('Error cargando actividades: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const InscribeToActivity = async (activityId) => {
    try {
      const fetchFunction = authenticatedFetch || makeAuthenticatedRequest;
      const response = await fetchFunction('http://localhost:8080/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: user.id,
          actividad_id: activityId
        })
      });

      if (response.ok) {
        await loadActivities();
        return true;
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          if (errorData.error.includes('already inscribed')) {
            throw new Error('Ya estás inscrito en esta actividad');
          } else if (errorData.error.includes('no available slots')) {
            throw new Error('No hay cupos disponibles para esta actividad');
          }
        } else if (response.status === 404) {
          throw new Error('Usuario o actividad no encontrada');
        }
        throw new Error(errorData.error || 'Error al procesar la inscripción');
      }
    } catch (err) {
      setError('Error inscribiéndose a la actividad: ' + err.message);
      return false;
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchFunction = authenticatedFetch || makeAuthenticatedRequest;
      const response = await fetchFunction('http://localhost:8080/users');
      if (response.ok) {
        const data = await response.json();
        const usersArray = data.users || data;
        setUsers(usersArray);
      }
    } catch (err) {
      setError('Error cargando usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData) => {
    try {
      const fetchFunction = authenticatedFetch || makeAuthenticatedRequest;
      const response = await fetchFunction('http://localhost:8080/activities', {
        method: 'POST',
        body: JSON.stringify(activityData)
      });
      if (response.ok) {
        await loadActivities();
        return true;
      }
      return false;
    } catch (err) {
      setError('Error creando actividad: ' + err.message);
      return false;
    }
  };

  const updateActivity = async (id, activityData) => {
    try {
      const fetchFunction = authenticatedFetch || makeAuthenticatedRequest;
      const response = await fetchFunction(`http://localhost:8080/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(activityData)
      });
      if (response.ok) {
        await loadActivities();
        return true;
      }
      return false;
    } catch (err) {
      setError('Error actualizando actividad: ' + err.message);
      return false;
    }
  };

  const deleteActivity = async (id) => {
    try {
      const fetchFunction = authenticatedFetch || makeAuthenticatedRequest;
      const response = await fetchFunction(`http://localhost:8080/activities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Usar authToken
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        await loadActivities();
        return true;
      }
      return false;
    } catch (err) {
      setError('Error eliminando actividad: ' + err.message);
      return false;
    }
  };

  useEffect(() => {
    if (activeSection === 'activities') {
      loadActivities();
    } else if (activeSection === 'users' && isAdmin()) { // Solo cargar usuarios si es admin
      loadUsers();
    }
  }, [activeSection, isAdmin]); // Añadir isAdmin a las dependencias

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Cargando...</div>;
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard">
            <h2>Dashboard</h2>
            <p>Bienvenido, {user?.username}</p>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Actividades</h3>
                <p>{activities.length}</p>
              </div>
              {isAdmin() && ( // Mostrar stats de usuarios solo para admins
                <div className="stat-card">
                  <h3>Total Usuarios</h3>
                  <p>{users.length}</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'activities':
        return (
          <div className="activities-section">
            <h2>Gestión de Actividades</h2>
            {isAdmin() && ( // Mostrar botón de nueva actividad solo para admins
              <div className="section-controls">
                <button onClick={() => setActiveSection('create-activity')}>
                  Nueva Actividad
                </button>
              </div>
            )}
            <div className="activity-list-header">
              <h3>Lista de Actividades ({activities.length})</h3>
              <button className="refresh-button" onClick={loadActivities} >
                Actualizar
              </button>
            </div>
            <ActivityList
              activities={activities}
              onUpdate={updateActivity}
              onDelete={deleteActivity}
              onInscribe={InscribeToActivity}
              isAdmin={isAdmin()} // Pasar la propiedad isAdmin a ActivityList
            />
          </div>
        );
      case 'create-activity':
        if (!isAdmin()) { // Proteger la ruta de creación de actividad
          return <div>Acceso denegado. Solo administradores pueden crear actividades.</div>;
        }
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
        );
      case 'mis-activities':
        return (
          <div className="mis-activities-section">
            <h2>Mis Actividades</h2>
            <p>Actividades en las que estás inscrito:</p>
            <MyActivities authenticatedFetch={authenticatedFetch || makeAuthenticatedRequest} />
          </div>
        );
      case 'users': // Nueva sección para gestión de usuarios
        if (!isAdmin()) {
          return <div>Acceso denegado. Solo administradores pueden ver usuarios.</div>;
        }
        return (
          <div className="users-section">
            <h2>Gestión de Usuarios</h2>
            <UserList users={users} />
          </div>
        );
      default:
        return <div>Sección no encontrada</div>;
    }
  };

  return (
    <div className="pagina-principal">
      <header className="header">
        <span className="welcome-fixed">
          Bienvenido, {user?.username}
        </span>

        <button onClick={handleLogout} className="logout-button logout-fixed">
          Cerrar Sesión
        </button>

        <div className="header-content">
          <h1>EverLifting</h1>
          <nav className="header-nav full-width-nav">
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
            <button onClick={() => setActiveSection('mis-activities')}
              className={`nav-button ${activeSection === 'mis-activities' ? 'active' : ''}`}
            >
              Mis Actividades
            </button>
            {isAdmin() && ( // Mostrar botón de usuarios solo para admins
              <button
                onClick={() => setActiveSection('users')}
                className={`nav-button ${activeSection === 'users' ? 'active' : ''}`}
              >
                Usuarios
              </button>
            )}
          </nav>
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
  );
};

export default PaginaPrincipal;

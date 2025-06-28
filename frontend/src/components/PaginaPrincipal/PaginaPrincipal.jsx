import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ActivityList from '../Activities/ActivityList';
import ActivityForm from '../Activities/ActivityForm';
import './PaginaPrincipal.css';
import UserList from '../users/UserList';
import MyActivities from '../Activities/myactivities';


const PaginaPrincipal = () => {
  const { user, logout, authenticatedFetch } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => logout();

  // Función alternativa si authenticatedFetch no funciona
  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = document.cookie.token;

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

      // Debug: Verificar si authenticatedFetch existe
      console.log('authenticatedFetch:', authenticatedFetch);
      console.log('user:', user);

      // Usar authenticatedFetch si está disponible, sino usar la función alternativa
      const fetchFunction = authenticatedFetch || makeAuthenticatedRequest;

      const response = await fetchFunction('http://localhost:8080/activities');
      console.log('Response:', response);

      if (response.ok) {
        const data = await response.json();
        console.log('API Response - activities data:', data);

        // La API devuelve un objeto con la propiedad 'activities'
        const activitiesArray = data.activities || data;
        console.log('Activities array:', activitiesArray);

        setActivities(activitiesArray);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error en loadActivities:', err);
      setError('Error cargando actividades: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  const InscribeToActivity = async (activityId) => {
    try {
      console.log('Intentando inscribir usuario:', user.id, 'en actividad:', activityId);

      const fetchFunction = authenticatedFetch || makeAuthenticatedRequest;

      // CORRECCIÓN 1: URL correcta según tu controller
      const response = await fetchFunction('http://localhost:8080/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // CORRECCIÓN 2: Body con estructura correcta según tu domain.InscripcionRequest
        body: JSON.stringify({
          usuario_id: user.id,    // Debe coincidir con el JSON tag en Go
          actividad_id: activityId // Debe coincidir con el JSON tag en Go
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Inscripción exitosa:', data);
        await loadActivities(); // Recargar actividades para actualizar cupos
        return true;
      } else {
        // Manejar errores específicos del backend
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);

        // Mostrar mensaje específico basado en el error
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
      console.error('Error inscribiéndose a la actividad:', err);
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
        console.log('API Response - users data:', data);

        // La API puede devolver un objeto con la propiedad 'users' o directamente el array
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
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
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
    } else if (activeSection === 'users') {
      loadUsers();
    }
  }, [activeSection]);

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Cargando...</div>;
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
        );
      case 'activities':
        return (
          <div className="activities-section">
            <h2>Gestión de Actividades</h2>
            <div className="section-controls">
              <button onClick={() => setActiveSection('create-activity')}>
                Nueva Actividad
              </button>
            </div>
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
            />
          </div>
        );
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
              onInscribe={InscribeToActivity}
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
import React, { useEffect, useState } from "react";
import "./Actividades.css";
import { useAuth } from "../../context/AuthContext"; // Importar useAuth

// Helper function para convertir número de día a nombre
const getDayName = (dayNumber) => {
    const days = {
        1: 'Lunes',
        2: 'Martes',
        3: 'Miércoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sábado',
        7: 'Domingo'
    };
    return days[dayNumber] || 'Día inválido';
};

const MyActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);

    // Obtener las funciones de autenticación del contexto
    const { getUserId, authenticatedFetch, user, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                // Verificar que el usuario esté autenticado
                if (!isAuthenticated) {
                    setError("Usuario no autenticado");
                    setLoading(false);
                    return;
                }

                // Obtener el ID del usuario
                const userId = getUserId();
                if (!userId) {
                    setError("No se pudo obtener el ID del usuario");
                    setLoading(false);
                    return;
                }

                console.log("Fetching user activities for user ID:", userId);

                // Hacer la petición con el ID del usuario en la URL
                const response = await authenticatedFetch(`http://localhost:8080/inscriptions/myactivities/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                // Verificar si la respuesta es JSON válido
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("La respuesta del servidor no es JSON válido");
                }

                const data = await response.json();
                console.log("Parsed data:", data);

                // La respuesta debería ser un array de InscripcionResponse
                let activitiesData = [];
                if (Array.isArray(data)) {
                    // Mapear los datos para que coincidan con lo que espera el frontend
                    activitiesData = data.map(inscription => ({
                        // Datos de la inscripción
                        id: inscription.Id,
                        usuario_id: inscription.UsuarioId,
                        actividad_id: inscription.ActividadId,

                        // Datos de la actividad (desde inscription.Actividad)
                        name: inscription.Actividad?.Name || 'Sin nombre',
                        nombre: inscription.Actividad?.Name || 'Sin nombre', // Para compatibilidad
                        profesor: inscription.Actividad?.Profesor || 'No asignado',
                        categoria: inscription.Actividad?.Categoria || 'Sin categoría',
                        cupos: inscription.Actividad?.Cupos || 0,
                        descripcion: inscription.Actividad?.Description || 'Sin descripción',
                        dia: inscription.Actividad?.Dia || 0,
                        hora_inicio: inscription.Actividad?.HoraInicio || 'No especificado',
                        hora_fin: inscription.Actividad?.HoraFin || 'No especificado',

                        // Datos del usuario
                        usuario: inscription.Usuario
                    }));
                } else if (data.message) {
                    // Manejar respuestas de error del servidor
                    throw new Error(data.message);
                } else {
                    console.warn("Estructura de datos no reconocida:", data);
                    activitiesData = [];
                }

                setActivities(activitiesData);
                console.log("Activities set:", activitiesData);

            } catch (err) {
                console.error("Error fetching activities:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [authenticatedFetch, getUserId, isAuthenticated]); // Dependencias correctas

    const handleShowDetails = (activity) => {
        setSelectedActivity(activity);
    };

    const handleCloseDetails = () => {
        setSelectedActivity(null);
    };

    const handleUninscribe = async (inscriptionId) => {
        if (!window.confirm("¿Estás seguro de que quieres desincribirte de esta actividad?")) {
            return;
        }

        try {
            // Usar el ID de la inscripción, no de la actividad
            const response = await authenticatedFetch(`http://localhost:8080/inscriptions/${inscriptionId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Actualizar la lista de actividades
            setActivities(prev => prev.filter(activity => activity.id !== inscriptionId));
            setSelectedActivity(null);

            alert("Te has desinscrito exitosamente de la actividad");
        } catch (err) {
            console.error("Error uninscribing:", err);
            alert("Error al desincribirse: " + err.message);
        }
    };

    // Mostrar mensaje de carga mientras se verifica la autenticación
    if (loading) {
        return (
            <div className="my-activities-container">
                <div className="loading-message">
                    <div className="spinner"></div>
                    <p>Cargando tus actividades...</p>
                </div>
            </div>
        );
    }

    // Mostrar error si no está autenticado o hay otros errores
    if (error) {
        return (
            <div className="my-activities-container">
                <div className="error-message">
                    <h3>⚠️ Error al cargar actividades</h3>
                    <p>{error}</p>
                    <button
                        className="retry-btn"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-activities-container">
            <div className="header-section">
                <h2 className="my-activities-title">Mis Actividades Inscritas</h2>
                <div className="activities-count">
                    {activities.length > 0 && (
                        <span className="count-badge">
                            {activities.length} actividad{activities.length !== 1 ? 'es' : ''}
                        </span>
                    )}
                </div>
            </div>

            {activities.length === 0 ? (
                <div className="no-activities">
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No tienes actividades inscritas</h3>
                        <p>¡Explora y únete a las actividades disponibles!</p>
                        <button
                            className="browse-activities-btn"
                            onClick={() => window.location.href = '/activities'}
                        >
                            Ver actividades disponibles
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="activities-grid">
                        {activities.map((activity) => (
                            <div key={activity.id} className="activity-card enrolled">
                                <div className="enrollment-badge">
                                    <span>✓ Inscrito</span>
                                </div>
                                <div className="activity-card-content">
                                    <h3 className="activity-name">
                                        {activity.name || activity.nombre || 'Actividad sin nombre'}
                                    </h3>
                                    <div className="activity-basic-info">
                                        <div className="activity-day">
                                            <span className="info-label">📅</span>
                                            <span>{getDayName(activity.dia)}</span>
                                        </div>
                                        <div className="activity-time">
                                            <span className="info-label">🕐</span>
                                            <span>{activity.hora_inicio || 'No especificado'}</span>
                                        </div>
                                        {activity.profesor && (
                                            <div className="activity-teacher">
                                                <span className="info-label">👨‍🏫</span>
                                                <span>{activity.profesor}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="view-more-btn"
                                        onClick={() => handleShowDetails(activity)}
                                    >
                                        Ver detalles
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Modal de detalles */}
                    {selectedActivity && (
                        <div className="modal-overlay" onClick={handleCloseDetails}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>{selectedActivity.nombre || selectedActivity.name}</h3>
                                    <button
                                        className="close-btn"
                                        onClick={handleCloseDetails}
                                        aria-label="Cerrar"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="enrollment-status">
                                        <span className="status-badge enrolled">
                                            ✓ Estás inscrito en esta actividad
                                        </span>
                                    </div>

                                    {selectedActivity.categoria && (
                                        <div className="detail-row">
                                            <span className="detail-label">Categoría:</span>
                                            <span className="detail-value">{selectedActivity.categoria}</span>
                                        </div>
                                    )}

                                    {selectedActivity.profesor && (
                                        <div className="detail-row">
                                            <span className="detail-label">Profesor:</span>
                                            <span className="detail-value">{selectedActivity.profesor}</span>
                                        </div>
                                    )}

                                    <div className="detail-row">
                                        <span className="detail-label">Día:</span>
                                        <span className="detail-value">{getDayName(selectedActivity.dia)}</span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="detail-label">Horario:</span>
                                        <span className="detail-value">
                                            {selectedActivity.hora_inicio || 'No especificado'}
                                            {selectedActivity.hora_fin && ` - ${selectedActivity.hora_fin}`}
                                        </span>
                                    </div>

                                    {selectedActivity.cupos && (
                                        <div className="detail-row">
                                            <span className="detail-label">Cupos totales:</span>
                                            <span className="detail-value">{selectedActivity.cupos}</span>
                                        </div>
                                    )}

                                    {selectedActivity.ubicacion && (
                                        <div className="detail-row">
                                            <span className="detail-label">Ubicación:</span>
                                            <span className="detail-value">{selectedActivity.ubicacion}</span>
                                        </div>
                                    )}

                                    {selectedActivity.descripcion && (
                                        <div className="detail-row description">
                                            <span className="detail-label">Descripción:</span>
                                            <p className="detail-description">{selectedActivity.descripcion}</p>
                                        </div>
                                    )}

                                    {selectedActivity.fecha_inscripcion && (
                                        <div className="detail-row">
                                            <span className="detail-label">Fecha de inscripción:</span>
                                            <span className="detail-value">
                                                {new Date(selectedActivity.fecha_inscripcion).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="uninscribe-btn"
                                        onClick={() => handleUninscribe(selectedActivity.id)}
                                    >
                                        Desincribirse
                                    </button>
                                    <button
                                        className="close-modal-btn"
                                        onClick={handleCloseDetails}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyActivities;
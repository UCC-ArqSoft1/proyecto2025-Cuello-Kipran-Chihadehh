import React, { useEffect, useState } from "react";
import "./Actividades.css";
import { useAuth } from "../../context/AuthContext";

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

    const { getUserId, authenticatedFetch, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                if (!isAuthenticated) {
                    setError("Usuario no autenticado");
                    setLoading(false);
                    return;
                }

                const userId = getUserId();
                if (!userId) {
                    setError("No se pudo obtener el ID del usuario");
                    setLoading(false);
                    return;
                }

                console.log("Fetching user activities for user ID:", userId);

                const response = await authenticatedFetch(`http://localhost:8080/inscriptions/myactivities/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
                }

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("La respuesta del servidor no es JSON válido");
                }

                const data = await response.json();
                console.log("Received data from server:", data);

                let activitiesData = [];
                if (Array.isArray(data)) {
                    // Mapear correctamente los datos de InscripcionResponse
                    activitiesData = data.map(inscription => ({
                        // ID de la inscripción (para eliminar)
                        inscriptionId: inscription.id,

                        // Datos básicos de la inscripción
                        id: inscription.actividad_id, // ID de la actividad para mostrar
                        usuario_id: inscription.usuario_id,
                        actividad_id: inscription.actividad_id,

                        // Datos de la actividad
                        name: inscription.actividad?.name || 'Sin nombre',
                        nombre: inscription.actividad?.name || 'Sin nombre',
                        profesor: inscription.actividad?.profesor || 'No asignado',
                        categoria: inscription.actividad?.categoria || 'Sin categoría',
                        cupos: inscription.actividad?.cupos || 0,
                        descripcion: inscription.actividad?.description || 'Sin descripción',
                        dia: inscription.actividad?.dia || 0,
                        hora_inicio: inscription.actividad?.hora_inicio || 'No especificado',
                        hora_fin: inscription.actividad?.hora_fin || 'No especificado',

                        // Datos del usuario
                        usuario: inscription.usuario
                    }));
                } else if (data.message) {
                    throw new Error(data.message);
                } else {
                    console.warn("Estructura de datos no reconocida:", data);
                    activitiesData = [];
                }

                setActivities(activitiesData);
                console.log("Activities mapped:", activitiesData);

            } catch (err) {
                console.error("Error fetching activities:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [authenticatedFetch, getUserId, isAuthenticated]);

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
            const response = await authenticatedFetch(`http://localhost:8080/inscriptions/${inscriptionId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
            }

            // Actualizar la lista de actividades eliminando por inscriptionId
            setActivities(prev => prev.filter(activity => activity.inscriptionId !== inscriptionId));
            setSelectedActivity(null);

            alert("Te has desinscrito exitosamente de la actividad");
        } catch (err) {
            console.error("Error uninscribing:", err);
            alert("Error al desincribirse: " + err.message);
        }
    };

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
                            <div key={activity.inscriptionId} className="activity-card enrolled">
                                <div className="enrollment-badge">
                                    <span>✓ Inscrito</span>
                                </div>
                                <div className="activity-card-content">
                                    <h3 className="activity-name">
                                        {activity.name}
                                    </h3>
                                    <div className="activity-basic-info">
                                        <div className="activity-day">
                                            <span className="info-label">📅</span>
                                            <span>{getDayName(activity.dia)}</span>
                                        </div>
                                        <div className="activity-time">
                                            <span className="info-label">🕐</span>
                                            <span>{activity.hora_inicio + "-" + activity.hora_fin}</span>
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
                                    <h3>{selectedActivity.name}</h3>
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

                                    <div className="detail-row">
                                        <span className="detail-label">Categoría:</span>
                                        <span className="detail-value">{selectedActivity.categoria}</span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="detail-label">Profesor:</span>
                                        <span className="detail-value">{selectedActivity.profesor}</span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="detail-label">Día:</span>
                                        <span className="detail-value">{getDayName(selectedActivity.dia)}</span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="detail-label">Horario:</span>
                                        <span className="detail-value">
                                            {selectedActivity.hora_inicio}
                                            {selectedActivity.hora_fin && ` - ${selectedActivity.hora_fin}`}
                                        </span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="detail-label">Cupos disponibles:</span>
                                        <span className="detail-value">{selectedActivity.cupos}</span>
                                    </div>

                                    <div className="detail-row description">
                                        <span className="detail-label">Descripción:</span>
                                        <p className="detail-description">{selectedActivity.descripcion}</p>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="uninscribe-btn"
                                        onClick={() => handleUninscribe(selectedActivity.inscriptionId)}
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
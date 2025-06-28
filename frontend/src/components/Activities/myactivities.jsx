import React, { useEffect, useState } from "react";
import "./Actividades.css";

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

const MyActivities = ({ authenticatedFetch }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await authenticatedFetch("http://localhost:8080/inscriptions/myactivities");
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setActivities(data.activities || data);
            } catch (err) {
                console.error("Error fetching activities:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [authenticatedFetch]);

    const handleShowDetails = (activity) => {
        setSelectedActivity(activity);
    };

    const handleCloseDetails = () => {
        setSelectedActivity(null);
    };

    if (loading) {
        return (
            <div className="my-activities-container">
                <div className="loading-message">Cargando actividades...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-activities-container">
                <div className="error-message">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="my-activities-container">
            <h2 className="my-activities-title">Mis Actividades</h2>

            {activities.length === 0 ? (
                <div className="no-activities">
                    <p>No tienes actividades inscritas.</p>
                </div>
            ) : (
                <>
                    <div className="activities-grid">
                        {activities.map((activity) => (
                            <div key={activity.id} className="activity-card">
                                <div className="activity-card-content">
                                    <h3 className="activity-name">
                                        {activity.nombre || activity.name}
                                    </h3>
                                    <div className="activity-basic-info">
                                        <div className="activity-day">
                                            <span className="info-label">📅</span>
                                            <span>{getDayName(activity.dia)}</span>
                                        </div>
                                        <div className="activity-time">
                                            <span className="info-label">🕐</span>
                                            <span>{activity.hora_inicio}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="view-more-btn"
                                    onClick={() => handleShowDetails(activity)}
                                >
                                    Ver más
                                </button>
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
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="modal-body">
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
                                        <span className="detail-label">Cupos:</span>
                                        <span className="detail-value">{selectedActivity.cupos}</span>
                                    </div>
                                    {selectedActivity.description && (
                                        <div className="detail-row description">
                                            <span className="detail-label">Descripción:</span>
                                            <p className="detail-description">{selectedActivity.description}</p>
                                        </div>
                                    )}
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
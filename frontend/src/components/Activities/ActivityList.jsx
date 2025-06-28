import React, { useState } from 'react';
import './Actividades.css';

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

const ActivityList = ({ activities, onUpdate, onDelete, onInscribe, user }) => {
    const [editingActivity, setEditingActivity] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [inscribing, setInscribing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleShowDetails = (activity) => {
        setSelectedActivity(activity);
    };

    const handleCloseDetails = () => {
        setSelectedActivity(null);
        setEditingActivity(null);
        setEditForm({});
    };

    const handleEdit = (activity) => {
        if (!activity.id) return;

        setEditingActivity(activity.id);
        setEditForm({
            nombre: activity.name || '',
            categoria: activity.categoria || '',
            profesor: activity.profesor || '',
            dia: activity.dia || 1,
            horario: activity.hora_inicio || '',
            cupos: activity.cupos || 0,
            descripcion: activity.description || ''
        });
        setSelectedActivity(activity);
    };

    const handleInscribe = async (activityId) => {
        if (!activityId) return;
        setInscribing(activityId);
        try {
            const success = await onInscribe(activityId);
            alert(success ? '¡Inscripción exitosa!' : 'Error al inscribirse');
        } catch (error) {
            alert('Error al inscribirse: ' + error.message);
        } finally {
            setInscribing(null);
        }
    };

    const handleSave = async () => {
        if (!editingActivity) return;
        const success = await onUpdate(editingActivity, editForm);
        if (success) {
            setEditingActivity(null);
            setEditForm({});
            setSelectedActivity(null);
        }
    };

    const handleCancel = () => {
        setEditingActivity(null);
        setEditForm({});
        if (selectedActivity) {
            setSelectedActivity(null);
        }
    };

    const handleDelete = async (activity) => {
        if (!activity.id) return;
        const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar la actividad "${activity.name}"?`);
        if (confirmar) {
            await onDelete(activity.id, activity.name);
            setSelectedActivity(null);
        }
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const filteredActivities = (Array.isArray(activities) ? activities : []).filter((activity) => {
        const search = searchTerm.toLowerCase();
        return (
            activity.name?.toLowerCase().includes(search) ||
            activity.categoria?.toLowerCase().includes(search)
        );
    });

    if (!filteredActivities.length) {
        return (
            <div className="actividades-container">
                <div className="search-bar-actividades">
                    <input
                        type="text"
                        placeholder="🔍 Buscar por nombre o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-actividades"
                    />
                </div>
                <div className="no-activities-message">
                    No hay actividades disponibles.
                </div>
            </div>
        );
    }

    return (
        <div className="actividades-container">
            <div className="search-bar-actividades">
                <input
                    type="text"
                    placeholder="🔍 Buscar por nombre o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-actividades"
                />
            </div>

            <div className="activities-grid">
                {filteredActivities.map((activity, index) => {
                    const isInscribing = inscribing === activity.id;

                    return (
                        <div key={activity.id || index} className="activity-card">
                            <div className="activity-card-content">
                                <h3 className="activity-name">{activity.name}</h3>
                                <div className="activity-basic-info">
                                    <div className="activity-category">
                                        <span className="info-label">📂</span>
                                        <span>{activity.categoria}</span>
                                    </div>
                                    <div className="activity-day">
                                        <span className="info-label">📅</span>
                                        <span>{getDayName(activity.dia)}</span>
                                    </div>
                                    <div className="activity-time">
                                        <span className="info-label">🕐</span>
                                        <span>{activity.hora_inicio}</span>
                                    </div>
                                    <div className="activity-spots">
                                        <span className="info-label">👥</span>
                                        <span>{activity.cupos} cupos</span>
                                    </div>
                                </div>
                            </div>
                            <div className="activity-card-actions">
                                <button
                                    className="accion-btn accion-btn-inscribe"
                                    onClick={() => handleInscribe(activity.id)}
                                    disabled={!activity.id || isInscribing || activity.cupos <= 0}
                                >
                                    {isInscribing ? 'Inscribiendo...' : 'Inscribirse'}
                                </button>
                                <button
                                    className="view-more-btn"
                                    onClick={() => handleShowDetails(activity)}
                                >
                                    Ver más
                                </button>
                            </div>
                        </div>
                    );
                })}
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
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            {editingActivity === selectedActivity.id ? (
                                // Formulario de edición
                                <div className="edit-form">
                                    <div className="form-group">
                                        <label>Nombre:</label>
                                        <input
                                            type="text"
                                            value={editForm.nombre || ''}
                                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                                            className="edit-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Categoría:</label>
                                        <input
                                            type="text"
                                            value={editForm.categoria || ''}
                                            onChange={(e) => handleInputChange('categoria', e.target.value)}
                                            className="edit-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Profesor:</label>
                                        <input
                                            type="text"
                                            value={editForm.profesor || ''}
                                            onChange={(e) => handleInputChange('profesor', e.target.value)}
                                            className="edit-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Día:</label>
                                        <select
                                            value={editForm.dia || 1}
                                            onChange={(e) => handleInputChange('dia', parseInt(e.target.value))}
                                            className='edit-select'
                                        >
                                            <option value={1}>Lunes</option>
                                            <option value={2}>Martes</option>
                                            <option value={3}>Miércoles</option>
                                            <option value={4}>Jueves</option>
                                            <option value={5}>Viernes</option>
                                            <option value={6}>Sábado</option>
                                            <option value={7}>Domingo</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Horario:</label>
                                        <input
                                            type="time"
                                            value={editForm.horario || ''}
                                            onChange={(e) => handleInputChange('horario', e.target.value)}
                                            className="edit-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Cupos:</label>
                                        <input
                                            type="number"
                                            value={editForm.cupos || ''}
                                            onChange={(e) => handleInputChange('cupos', parseInt(e.target.value))}
                                            className="edit-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Descripción:</label>
                                        <textarea
                                            value={editForm.descripcion || ''}
                                            onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                            className="edit-textarea"
                                        />
                                    </div>
                                    <div className="modal-actions">
                                        <button className="accion-btn accion-btn-save" onClick={handleSave}>
                                            Guardar
                                        </button>
                                        <button className="accion-btn accion-btn-cancel" onClick={handleCancel}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Vista de detalles
                                <>
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
                                        <span className="detail-value">{selectedActivity.hora_inicio}</span>
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
                                    <div className="modal-actions">
                                        <button
                                            className="accion-btn accion-btn-edit"
                                            onClick={() => handleEdit(selectedActivity)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="accion-btn accion-btn-delete"
                                            onClick={() => handleDelete(selectedActivity)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityList;
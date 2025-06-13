import React, { useState } from 'react'
import './Actividades.css';

const ActivityList = ({ activities, onUpdate, onDelete, onInscribe, user, authenticatedFetch, makeAuthenticatedRequest }) => {
    const [editingActivity, setEditingActivity] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [textosVisibles, setTextosVisibles] = useState({})
    const [inscribing, setInscribing] = useState(null) // Para mostrar estado de carga

    // Debug: Ver qué datos están llegando
    console.log('ActivityList - activities:', activities)
    console.log('ActivityList - activities length:', activities?.length)

    // Alternar visibilidad del texto oculto
    const toggleTextoVisible = (id) => {
        setTextosVisibles(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleEdit = (activity) => {
        // Verificar que el activity tenga id definido
        if (!activity.id) {
            console.error('Activity sin id:', activity)
            alert('Error: No se puede editar una actividad sin ID válido')
            return
        }

        setEditingActivity(activity.id)
        setEditForm({
            nombre: activity.name || '',
            categoria: activity.categoria || '',
            profesor: activity.profesor || '',
            dia: activity.dia || '',
            horario: activity.hora_inicio || '',
            cupos: activity.cupos || 0,
            descripcion: activity.description || ''
        })
    }

    const handleInscribe = async (activityId) => {
        // Verificar que el activityId sea válido
        if (!activityId) {
            console.error('Activity ID no válido:', activityId)
            alert('Error: No se puede inscribir en una actividad sin ID válido')
            return
        }



        setInscribing(activityId)

        try {
            const success = await onInscribe(activityId)
            if (success) {
                alert('¡Inscripción exitosa!')
            } else {
                alert('Error al inscribirse en la actividad')
            }
        } catch (error) {
            console.error('Error en inscripción:', error)
            alert('Error al inscribirse en la actividad: ' + error.message)
        } finally {
            setInscribing(null)
        }
    }

    const handleSave = async () => {
        if (!editingActivity) {
            console.error('No hay actividad en edición')
            return
        }

        const success = await onUpdate(editingActivity, editForm)
        if (success) {
            setEditingActivity(null)
            setEditForm({})
        }
    }

    const handleCancel = () => {
        setEditingActivity(null)
        setEditForm({})
    }

    const handleDelete = async (activity) => {
        // Verificar que la actividad tenga id definido
        if (!activity.id) {
            console.error('Activity sin id:', activity)
            alert('Error: No se puede eliminar una actividad sin ID válido')
            return
        }

        const activityName = activity.name || 'Sin nombre'
        if (window.confirm(`¿Estás seguro de que quieres eliminar la actividad "${activityName}"?`)) {
            await onDelete(activity.id, activityName)
        }
    }

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    if (!activities || activities.length === 0) {
        return (
            <div className="actividades-container">
                <div className="no-activities-message">
                    No hay actividades disponibles
                </div>
            </div>
        )
    }

    return (
        <div className="actividades-container">
            <div className="table-container">
                <table className="activities-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Profesor</th>
                            <th>Día</th>
                            <th>Hora de inicio</th>
                            <th>Cupos</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity, index) => {
                            // Verificar que la actividad tenga un ID válido
                            const activityId = activity.id || `temp-${index}`
                            const isEditing = editingActivity === activity.id
                            const esVisible = textosVisibles[activity.id]
                            const isInscribing = inscribing === activity.id

                            // Si no tiene id válido, mostrar advertencia en consola
                            if (!activity.id) {
                                console.warn(`Actividad en índice ${index} sin id:`, activity)
                            }

                            return (
                                <tr key={activityId} className={!activity.id ? 'invalid-activity' : ''}>
                                    <td className="table-cell">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={editForm.nombre || ''}
                                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                                                placeholder="Nombre de la actividad"
                                            />
                                        ) : (
                                            <span className="cell-content">
                                                {activity.name || 'Sin nombre'}
                                            </span>
                                        )}
                                    </td>

                                    <td className="table-cell">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={editForm.categoria || ''}
                                                onChange={(e) => handleInputChange('categoria', e.target.value)}
                                                placeholder="Categoría"
                                            />
                                        ) : (
                                            <span className="cell-content">
                                                {activity.categoria || 'Sin categoría'}
                                            </span>
                                        )}
                                    </td>

                                    <td className="table-cell">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={editForm.profesor || ''}
                                                onChange={(e) => handleInputChange('profesor', e.target.value)}
                                                placeholder="Profesor"
                                            />
                                        ) : (
                                            <span className="cell-content">
                                                {activity.profesor || 'Sin profesor'}
                                            </span>
                                        )}
                                    </td>

                                    <td className="table-cell">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                className="edit-select"
                                                value={editForm.dia || ''}
                                                onChange={(e) => handleInputChange('dia', e.target.value)}
                                            />
                                        ) : (
                                            <span className="cell-content">
                                                {activity.dia || 'Sin día'}
                                            </span>
                                        )}
                                    </td>

                                    <td className="table-cell">
                                        {isEditing ? (
                                            <input
                                                type="time"
                                                className="edit-input"
                                                value={editForm.hora_inicio || ''}
                                                onChange={(e) => handleInputChange('horario', e.target.value)}
                                            />
                                        ) : (
                                            <span className="cell-content">
                                                {activity.hora_inicio || 'Sin horario'}
                                            </span>
                                        )}
                                    </td>

                                    <td className="table-cell">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                className="edit-input"
                                                value={editForm.cupos || ''}
                                                onChange={(e) => handleInputChange('cupos', parseInt(e.target.value) || 0)}
                                                min="0"
                                                placeholder="0"
                                            />
                                        ) : (
                                            <span className="cell-content">
                                                {activity.cupos || '0'}
                                            </span>
                                        )}
                                    </td>

                                    <td className="table-cell descripcion-cell">
                                        {isEditing ? (
                                            <textarea
                                                className="edit-textarea"
                                                value={editForm.descripcion || ''}
                                                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                                rows="2"
                                                placeholder="Descripción de la actividad"
                                            />
                                        ) : (
                                            <div className="descripcion-section">
                                                <button
                                                    className="toggle-descripcion-btn"
                                                    onClick={() => toggleTextoVisible(activity.id)}
                                                    type="button"
                                                >
                                                    {esVisible ? '🙈 Ocultar' : '👁️ Ver'}
                                                </button>
                                                {esVisible && (
                                                    <div className="descripcion-visible">
                                                        <p className="descripcion-texto">
                                                            {activity.description || 'Sin descripción'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    <td className="table-cell actions-cell">
                                        {isEditing ? (
                                            <div className="action-buttons">
                                                <button
                                                    className="accion-btn accion-btn-save"
                                                    onClick={handleSave}
                                                >
                                                    ✅ Guardar
                                                </button>
                                                <button
                                                    className="accion-btn accion-btn-cancel"
                                                    onClick={handleCancel}
                                                >
                                                    ❌ Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="action-buttons">
                                                <button
                                                    className="accion-btn accion-btn-inscribe"
                                                    onClick={() => handleInscribe(activity.id)}
                                                    disabled={!activity.id || isInscribing || activity.cupos <= 0}
                                                    title={
                                                        !activity.id ? 'Actividad sin ID válido' :
                                                            activity.cupos <= 0 ? 'Sin cupos disponibles' :
                                                                'Inscribirse en actividad'
                                                    }
                                                >
                                                    {isInscribing ? 'Inscribiendo...' : 'Inscribirse'}
                                                </button>
                                                <button
                                                    className="accion-btn accion-btn-edit"
                                                    onClick={() => handleEdit(activity)}
                                                    disabled={!activity.id}
                                                    title={!activity.id ? 'Actividad sin ID válido' : 'Editar actividad'}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="accion-btn accion-btn-delete"
                                                    onClick={() => handleDelete(activity)}
                                                    disabled={!activity.id}
                                                    title={!activity.id ? 'Actividad sin ID válido' : 'Eliminar actividad'}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Información de debug (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="debug-panel">
                    <details>
                        <summary>🔧 Información de Debug</summary>
                        <div className="debug-content">
                            <p><strong>Total actividades:</strong> {activities.length}</p>
                        </div>
                    </details>
                </div>
            )}
        </div>
    )
}

export default ActivityList
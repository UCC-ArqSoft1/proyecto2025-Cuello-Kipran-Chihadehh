import React, { useState } from 'react'

const ActivityList = ({ activities, onUpdate, onDelete }) => {
    const [editingActivity, setEditingActivity] = useState(null)
    const [editForm, setEditForm] = useState({})

    // Debug: Ver qué datos están llegando
    console.log('ActivityList - activities:', activities)
    console.log('ActivityList - activities length:', activities?.length)

    const handleEdit = (activity) => {
        setEditingActivity(activity.id_actividad)
        setEditForm({
            nombre: activity.name,
            categoria: activity.Categoria,
            profesor: activity.profesor,
            dia: activity.dia,
            horario: activity.hora_inicio,
            cupos: activity.cupos,
            descripcion: activity.description || ''
        })
    }

    const handleSave = async () => {
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

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
            await onDelete(id)
        }
    }

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    if (!activities || activities.length === 0) {
        return <div>No hay actividades disponibles</div>
    }

    return (
        <div className="activity-list">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Profesor</th>
                        <th>Día</th>
                        <th>Horario</th>
                        <th>Cupos</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity, index) => (
                        <tr key={activity.id_actividad || `activity-${index}`}>
                            <td>{activity.id_actividad || 'N/A'}</td>
                            <td>
                                {editingActivity === activity.id_actividad ? (
                                    <input
                                        type="text"
                                        value={editForm.nombre || ''}
                                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    />
                                ) : (
                                    activity.nombre || 'Sin nombre'
                                )}
                            </td>
                            <td>
                                {editingActivity === activity.id_actividad ? (
                                    <input
                                        type="text"
                                        value={editForm.categoria || ''}
                                        onChange={(e) => handleInputChange('categoria', e.target.value)}
                                    />
                                ) : (
                                    activity.categoria || 'Sin categoría'
                                )}
                            </td>
                            <td>
                                {editingActivity === activity.id_actividad ? (
                                    <input
                                        type="text"
                                        value={editForm.profesor || ''}
                                        onChange={(e) => handleInputChange('profesor', e.target.value)}
                                    />
                                ) : (
                                    activity.profesor || 'Sin profesor'
                                )}
                            </td>
                            <td>
                                {editingActivity === activity.id_actividad ? (
                                    <select
                                        value={editForm.dia || ''}
                                        onChange={(e) => handleInputChange('dia', e.target.value)}
                                    >
                                        <option value="">Seleccionar día</option>
                                        <option value="Lunes">Lunes</option>
                                        <option value="Martes">Martes</option>
                                        <option value="Miércoles">Miércoles</option>
                                        <option value="Jueves">Jueves</option>
                                        <option value="Viernes">Viernes</option>
                                        <option value="Sábado">Sábado</option>
                                        <option value="Domingo">Domingo</option>
                                    </select>
                                ) : (
                                    activity.dia || 'Sin día'
                                )}
                            </td>
                            <td>
                                {editingActivity === activity.id_actividad ? (
                                    <input
                                        type="text"
                                        value={editForm.horario || ''}
                                        onChange={(e) => handleInputChange('horario', e.target.value)}
                                        placeholder="HH:MM - HH:MM"
                                    />
                                ) : (
                                    activity.horario || 'Sin horario'
                                )}
                            </td>
                            <td>
                                {editingActivity === activity.id_actividad ? (
                                    <input
                                        type="number"
                                        value={editForm.cupos || ''}
                                        onChange={(e) => handleInputChange('cupos', parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                ) : (
                                    activity.cupos || '0'
                                )}
                            </td>
                            <td>
                                {editingActivity === activity.id_actividad ? (
                                    <textarea
                                        value={editForm.descripcion || ''}
                                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                        rows="2"
                                    />
                                ) : (
                                    activity.descripcion || 'Sin descripción'
                                )}
                            </td>
                            <td>
                                {editingActivity === activity.id_actividad ? (
                                    <div className="action-buttons">
                                        <button onClick={handleSave}>Guardar</button>
                                        <button onClick={handleCancel}>Cancelar</button>
                                    </div>
                                ) : (
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(activity)}>Editar</button>
                                        <button onClick={() => handleDelete(activity.id_actividad)}>Eliminar</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ActivityList
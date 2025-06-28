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
    const [textosVisibles, setTextosVisibles] = useState({});
    const [inscribing, setInscribing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleTextoVisible = (id) => {
        setTextosVisibles(prev => ({ ...prev, [id]: !prev[id] }));
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
        }
    };

    const handleCancel = () => {
        setEditingActivity(null);
        setEditForm({});
    };

    const handleDelete = async (activity) => {
        if (!activity.id) return;
        const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar la actividad "${activity.name}"?`);
        if (confirmar) await onDelete(activity.id, activity.name);
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
                        {filteredActivities.map((activity, index) => {
                            const isEditing = editingActivity === activity.id;
                            const esVisible = textosVisibles[activity.id];
                            const isInscribing = inscribing === activity.id;

                            return (
                                <tr key={activity.id || index}>
                                    <td>{isEditing ? (
                                        <input type="text" value={editForm.nombre || ''} onChange={(e) => handleInputChange('nombre', e.target.value)} />
                                    ) : activity.name}</td>

                                    <td>{isEditing ? (
                                        <input type="text" value={editForm.categoria || ''} onChange={(e) => handleInputChange('categoria', e.target.value)} />
                                    ) : activity.categoria}</td>

                                    <td>{isEditing ? (
                                        <input type="text" value={editForm.profesor || ''} onChange={(e) => handleInputChange('profesor', e.target.value)} />
                                    ) : activity.profesor}</td>

                                    <td>{isEditing ? (
                                        <select
                                            value={editForm.dia || 1}
                                            onChange={(e) => handleInputChange('dia', parseInt(e.target.value))}
                                        >
                                            <option value={1}>Lunes</option>
                                            <option value={2}>Martes</option>
                                            <option value={3}>Miércoles</option>
                                            <option value={4}>Jueves</option>
                                            <option value={5}>Viernes</option>
                                            <option value={6}>Sábado</option>
                                            <option value={7}>Domingo</option>
                                        </select>
                                    ) : getDayName(activity.dia)}</td>

                                    <td>{isEditing ? (
                                        <input type="time" value={editForm.horario || ''} onChange={(e) => handleInputChange('horario', e.target.value)} />
                                    ) : activity.hora_inicio}</td>

                                    <td>{isEditing ? (
                                        <input type="number" value={editForm.cupos || ''} onChange={(e) => handleInputChange('cupos', parseInt(e.target.value))} />
                                    ) : activity.cupos}</td>

                                    <td>
                                        {isEditing ? (
                                            <textarea value={editForm.descripcion || ''} onChange={(e) => handleInputChange('descripcion', e.target.value)} />
                                        ) : (
                                            <div>
                                                <button className="edit-textarea"
                                                    onClick={() => toggleTextoVisible(activity.id)}>
                                                    {esVisible ? 'Ocultar' : 'Ver'}
                                                </button>
                                                {esVisible && <p>{activity.description}</p>}
                                            </div>
                                        )}
                                    </td>

                                    <td>
                                        {isEditing ? (
                                            <>
                                                <button onClick={handleSave}>Guardar</button>
                                                <button onClick={handleCancel}>Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="accion-btn accion-btn-inscribe"
                                                    onClick={() => handleInscribe(activity.id)}
                                                    disabled={!activity.id || isInscribing || activity.cupos <= 0}
                                                >
                                                    {isInscribing ? 'Inscribiendo...' : 'Inscribirse'}
                                                </button>
                                                <button className="accion-btn accion-btn-edit" onClick={() => handleEdit(activity)}>Editar</button>
                                                <button className="accion-btn accion-btn-delete" onClick={() => handleDelete(activity)}>Eliminar</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityList;
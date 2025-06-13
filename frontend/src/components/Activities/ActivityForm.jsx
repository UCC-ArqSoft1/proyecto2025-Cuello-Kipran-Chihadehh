import React, { useState } from 'react'

const ActivityForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: '',
        profesor: '',
        dia: 1, // Inicializar con 1 en lugar de 0
        hora_inicio: '',
        hora_fin: '', // Cambiar hora_final por hora_fin para coincidir con el backend
        cupos: 1, // Inicializar con 1 en lugar de 0
        descripcion: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido'
        }

        if (!formData.categoria.trim()) {
            newErrors.categoria = 'La categoría es requerida'
        }

        if (!formData.profesor.trim()) {
            newErrors.profesor = 'El profesor es requerido'
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida'
        }

        if (!formData.hora_inicio.trim()) {
            newErrors.hora_inicio = 'La hora de inicio es requerida'
        }

        if (!formData.hora_fin.trim()) {
            newErrors.hora_fin = 'La hora de finalización es requerida'
        }

        if (formData.hora_inicio && formData.hora_fin && formData.hora_inicio >= formData.hora_fin) {
            newErrors.hora_fin = 'La hora de finalización debe ser mayor que la de inicio'
        }

        if (formData.dia < 1 || formData.dia > 7) {
            newErrors.dia = 'El día debe ser entre 1 y 7'
        }

        if (formData.cupos < 1) {
            newErrors.cupos = 'Los cupos deben ser mayor a 0'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        // Preparar los datos para enviar al backend con los nombres correctos
        const activityData = {
            name: formData.nombre,           // Backend espera 'name'
            categoria: formData.categoria,
            profesor: formData.profesor,
            dia: parseInt(formData.dia),     // Asegurar que sea entero
            hora_inicio: formData.hora_inicio,
            hora_fin: formData.hora_fin,     // Backend espera 'hora_fin'
            cupos: parseInt(formData.cupos), // Asegurar que sea entero
            description: formData.descripcion // Backend espera 'description'
        }

        console.log('Datos a enviar:', activityData) // Para debug

        const success = await onSubmit(activityData)
        setLoading(false)

        if (success) {
            // Reset del formulario corregido
            setFormData({
                nombre: '',
                categoria: '',
                profesor: '',
                dia: 1,
                hora_inicio: '',
                hora_fin: '',
                cupos: 1,
                descripcion: ''
            })
            onCancel() // Regresar a la lista
        }
    }

    return (
        <div className="activity-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre de la Actividad</label>
                    <input
                        type="text"
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Ej: Yoga Matutino"
                        disabled={loading}
                    />
                    {errors.nombre && <span className="error">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="categoria">Categoría</label>
                    <input
                        type="text"
                        id="categoria"
                        value={formData.categoria}
                        onChange={(e) => handleInputChange('categoria', e.target.value)}
                        placeholder="Ej: Fitness, Relajación, Cardio"
                        disabled={loading}
                    />
                    {errors.categoria && <span className="error">{errors.categoria}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="profesor">Profesor</label>
                    <input
                        type="text"
                        id="profesor"
                        value={formData.profesor}
                        onChange={(e) => handleInputChange('profesor', e.target.value)}
                        placeholder="Nombre del instructor"
                        disabled={loading}
                    />
                    {errors.profesor && <span className="error">{errors.profesor}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="dia">Día de la semana</label>
                    <select
                        id="dia"
                        value={formData.dia}
                        onChange={(e) => handleInputChange('dia', parseInt(e.target.value))}
                        disabled={loading}
                    >
                        <option value={1}>Lunes</option>
                        <option value={2}>Martes</option>
                        <option value={3}>Miércoles</option>
                        <option value={4}>Jueves</option>
                        <option value={5}>Viernes</option>
                        <option value={6}>Sábado</option>
                        <option value={7}>Domingo</option>
                    </select>
                    {errors.dia && <span className="error">{errors.dia}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="hora_inicio">Hora de inicio</label>
                    <input
                        type="time"
                        id="hora_inicio"
                        value={formData.hora_inicio}
                        onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                        disabled={loading}
                    />
                    {errors.hora_inicio && <span className="error">{errors.hora_inicio}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="hora_fin">Hora de finalización</label>
                    <input
                        type="time"
                        id="hora_fin"
                        value={formData.hora_fin}
                        onChange={(e) => handleInputChange('hora_fin', e.target.value)}
                        disabled={loading}
                    />
                    {errors.hora_fin && <span className="error">{errors.hora_fin}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="cupos">Cupos Disponibles</label>
                    <input
                        type="number"
                        id="cupos"
                        value={formData.cupos}
                        onChange={(e) => handleInputChange('cupos', parseInt(e.target.value) || 1)}
                        min="1"
                        disabled={loading}
                    />
                    {errors.cupos && <span className="error">{errors.cupos}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción de la actividad..."
                        rows="4"
                        disabled={loading}
                    />
                    {errors.descripcion && <span className="error">{errors.descripcion}</span>}
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Actividad'}
                    </button>
                    <button type="button" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ActivityForm
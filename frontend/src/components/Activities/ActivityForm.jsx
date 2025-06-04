import React, { useState } from 'react'

const ActivityForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: '',
        profesor: '',
        dia: 'Lunes',
        horario: '',
        cupos: 0,
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

        if (!formData.horario.trim()) {
            newErrors.horario = 'El horario es requerido'
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
        const success = await onSubmit(formData)
        setLoading(false)

        if (success) {
            setFormData({
                nombre: '',
                categoria: '',
                profesor: '',
                dia: 'Lunes',
                horario: '',
                cupos: 0,
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
                    <label htmlFor="dia">Día de la Semana</label>
                    <select
                        id="dia"
                        value={formData.dia}
                        onChange={(e) => handleInputChange('dia', e.target.value)}
                        disabled={loading}
                    >
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="horario">Horario</label>
                    <input
                        type="text"
                        id="horario"
                        value={formData.horario}
                        onChange={(e) => handleInputChange('horario', e.target.value)}
                        placeholder="Ej: 08:00 - 09:30"
                        disabled={loading}
                    />
                    {errors.horario && <span className="error">{errors.horario}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="cupos">Cupos Disponibles</label>
                    <input
                        type="number"
                        id="cupos"
                        value={formData.cupos}
                        onChange={(e) => handleInputChange('cupos', parseInt(e.target.value) || 0)}
                        min="1"
                        disabled={loading}
                    />
                    {errors.cupos && <span className="error">{errors.cupos}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción (Opcional)</label>
                    <textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción de la actividad..."
                        rows="4"
                        disabled={loading}
                    />
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
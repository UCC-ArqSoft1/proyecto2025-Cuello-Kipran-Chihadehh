import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const { login, error: authError, loading } = useAuth()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(formData.username, formData.password)
    }

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <h2 className="login-title">Bienvenido</h2>
                        <p className="login-subtitle">Inicia sesión en tu cuenta</p>
                        {authError && <div className="error-message">{authError}</div>}
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="admin"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="admin123"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`login-button ${loading ? 'loading' : ''}`}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
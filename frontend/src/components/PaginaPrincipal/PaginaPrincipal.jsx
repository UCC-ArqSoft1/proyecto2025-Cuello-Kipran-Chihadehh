import { useAuth } from '../../context/AuthContext'
import './PaginaPrincipal.css'

const PaginaPrincipal = () => {
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="pagina-principal">
            <header className="header">
                <div className="header-content">
                    <h1>Panel Principal</h1>
                    <div className="user-info">
                        <span>Bienvenido, {user?.username}</span>
                        <button onClick={handleLogout} className="logout-button">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="dashboard">
                    <h2>Dashboard</h2>
                    <p>Has iniciado sesión exitosamente.</p>
                    <div className="cards-container">
                        <div className="card">
                            <h3>Estadísticas</h3>
                            <p>Información general del sistema</p>
                        </div>
                        <div className="card">
                            <h3>Configuración</h3>
                            <p>Ajustes de la aplicación</p>
                        </div>
                        <div className="card">
                            <h3>Reportes</h3>
                            <p>Generar y ver reportes</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PaginaPrincipal
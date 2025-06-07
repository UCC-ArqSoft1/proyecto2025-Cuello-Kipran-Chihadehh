import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        // Actualiza el state para mostrar la UI de error
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // Puedes registrar el error en un servicio de logging
        console.error('Error capturado por ErrorBoundary:', error, errorInfo)
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    handleReload = () => {
        // Recargar la página para intentar recuperarse del error
        window.location.reload()
    }

    handleReset = () => {
        // Reiniciar el estado del error boundary
        this.setState({ hasError: false, error: null, errorInfo: null })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '20px',
                    margin: '20px',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    <h2>¡Oops! Algo salió mal</h2>
                    <p>Ha ocurrido un error inesperado en la aplicación.</p>

                    <div style={{ marginTop: '20px' }}>
                        <button
                            onClick={this.handleReload}
                            style={{
                                padding: '10px 15px',
                                marginRight: '10px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                        >
                            Recargar Página
                        </button>
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '10px 15px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
                        >
                            Intentar de Nuevo
                        </button>
                    </div>

                    {/* Mostrar detalles del error solo en desarrollo */}
                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ marginTop: '20px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                Detalles del Error (Solo en Desarrollo)
                            </summary>
                            <div style={{
                                marginTop: '10px',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                overflow: 'auto',
                                maxHeight: '400px'
                            }}>
                                <strong>Error:</strong><br />
                                {this.state.error ? this.state.error.toString() : 'Error desconocido'}
                                <br /><br />
                                <strong>Stack Trace:</strong><br />
                                {this.state.error && this.state.error.stack ? this.state.error.stack : 'Stack trace no disponible'}
                                <br /><br />
                                <strong>Component Stack:</strong><br />
                                {this.state.errorInfo && this.state.errorInfo.componentStack
                                    ? this.state.errorInfo.componentStack
                                    : 'Component stack no disponible'
                                }
                            </div>
                        </details>
                    )}
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
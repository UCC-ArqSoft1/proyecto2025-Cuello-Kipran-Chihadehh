import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const login = async (username, password) => {
        try {
            setLoading(true)
            setError(null)
            // Simulación de API
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Validación simple (en producción usaría una API real)
            if (username === 'admin' && password === 'admin123') {
                setUser({ username })
                return true // Login exitoso
            } else {
                throw new Error('Credenciales incorrectas')
            }
        } catch (err) {
            setError(err.message)
            return false // Login fallido
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{
            user,
            error,
            loading,
            login,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Verificar si hay un token guardado al cargar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                // Limpiar datos corruptos
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Función para iniciar sesión
    const login = (userData, token) => {
        console.log('Login called with:', { userData, token }); // Debug
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // También limpiar cookies si las usas
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    // Función para obtener el token
    const getToken = () => {
        return localStorage.getItem('authToken');
    };

    // Función para hacer peticiones autenticadas
    const authenticatedFetch = async (url, options = {}) => {
        const token = getToken();

        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });
    };

    // Función corregida para obtener el ID del usuario
    const getUserId = () => {
        if (user && user.id) {
            return user.id;
        }

        // Como fallback, intentar obtener del localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                return parsedUser.id;
            } catch (error) {
                console.error('Error parsing saved user:', error);
                return null;
            }
        }

        return null;
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        getToken,
        getUserId,
        authenticatedFetch
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
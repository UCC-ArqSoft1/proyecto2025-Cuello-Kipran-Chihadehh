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
        const token = localStorage.getItem('token'); // CAMBIAR de 'authToken' a 'token'
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    // Función para hacer requests autenticados
    const authenticatedFetch = async (url, options = {}) => {
        const token = localStorage.getItem('token');

        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });
    };

    // Función para iniciar sesión
    const login = (userData, token) => {
        localStorage.setItem('token', token); // CAMBIAR de 'authToken' a 'token'
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Función para obtener el token
    const getToken = () => {
        return localStorage.getItem('token'); // CAMBIAR de 'authToken' a 'token'
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        getToken,
        authenticatedFetch // AGREGAR authenticatedFetch al contexto
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
// MultipleFiles/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

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
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        console.log('Login called with:', { userData, token });
        localStorage.setItem('authToken', token);
        // Asegurarse de que isAdmin esté en userData antes de guardarlo
        const userToSave = { ...userData, isAdmin: userData.is_admin || false }; // Asume que el backend envía 'is_admin'
        localStorage.setItem('user', JSON.stringify(userToSave));
        setUser(userToSave);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    const getToken = () => {
        return localStorage.getItem('authToken');
    };

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

    const getUserId = () => {
        if (user && user.id) {
            return user.id;
        }
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

    // Nueva función para obtener el estado de administrador
    const isAdmin = () => {
        return user ? user.isAdmin : false;
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        getToken,
        getUserId,
        authenticatedFetch,
        isAdmin // Exportar la función isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

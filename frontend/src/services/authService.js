// src/services/authService.js
import { API_BASE_URL, LOGIN_ENDPOINT } from '../config/apiConfig';
import { login as loginRequest } from '../services/authService';


export const login = async (email, password) => {
    const response = await loginRequest(username, password);
  localStorage.setItem('token', response.data.token);
    return api.post('/login', { email, password });
    try {
        const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al iniciar sesión');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
    
};
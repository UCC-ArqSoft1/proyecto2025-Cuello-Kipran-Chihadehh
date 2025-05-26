// src/utils/authUtils.js
export const getAuthToken = () => localStorage.getItem('authToken');
export const isAuthenticated = () => !!getAuthToken();
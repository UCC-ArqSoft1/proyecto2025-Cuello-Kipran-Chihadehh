import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserList = ({ users: propUsers }) => {
    const [users, setUsers] = useState([]); // ✅ Inicializar siempre con array vacío
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getToken } = useAuth();

    useEffect(() => {
        // Si se pasan usuarios como prop, usarlos
        if (propUsers && Array.isArray(propUsers) && propUsers.length > 0) {
            setUsers(propUsers);
            setLoading(false);
        } else {
            fetchUsers();
        }
    }, [propUsers]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null); // ✅ Limpiar errores previos
            const token = getToken();

            const response = await fetch('http://localhost:8080/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // ✅ Verificar que data sea un array
            if (Array.isArray(data)) {
                setUsers(data);
            } else if (data && Array.isArray(data.users)) {
                // Si la respuesta tiene estructura { users: [...] }
                setUsers(data.users);
            } else {
                console.warn('La respuesta no contiene un array de usuarios:', data);
                setUsers([]);
            }
        } catch (err) {
            setError(err.message);
            setUsers([]); // ✅ Asegurar que users sea siempre un array
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            return;
        }

        try {
            const token = getToken();

            const response = await fetch(`http://localhost:8080/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            // ✅ Verificar que users sea un array antes de filtrar
            setUsers(prevUsers =>
                Array.isArray(prevUsers)
                    ? prevUsers.filter(user => user.id !== userId)
                    : []
            );
        } catch (err) {
            setError(err.message);
            console.error('Error deleting user:', err);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'No disponible';
        try {
            return new Date(date).toLocaleDateString('es-ES');
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="text-lg">Cargando usuarios...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong>Error:</strong> {error}
                <button
                    onClick={() => {
                        setError(null);
                        fetchUsers(); // ✅ Opción de reintentar
                    }}
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                >
                    Reintentar
                </button>
                <button
                    onClick={() => setError(null)}
                    className="ml-2 text-red-700 hover:text-red-900"
                >
                    ×
                </button>
            </div>
        );
    }

    // ✅ Verificación adicional antes del render
    const safeUsers = Array.isArray(users) ? users : [];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Lista de Usuarios</h2>
                <button
                    onClick={fetchUsers}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Actualizar
                </button>
            </div>

            {safeUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No hay usuarios disponibles</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha de Registro
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {safeUsers.map((user) => (
                                    <tr key={user?.id || Math.random()} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {(user?.name || user?.username || user?.email || '?')[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user?.name || user?.username || 'Sin nombre'}
                                                    </div>
                                                    {user?.username && user?.name && (
                                                        <div className="text-sm text-gray-500">@{user.username}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user?.email || 'No disponible'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user?.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user?.role || 'usuario'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(user?.createdAt || user?.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteUser(user?.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                                disabled={!user?.id}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
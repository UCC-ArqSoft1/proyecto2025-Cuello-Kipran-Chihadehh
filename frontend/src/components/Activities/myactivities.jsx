import React, { useEffect, useState } from "react";

// Helper function para convertir número de día a nombre
const getDayName = (dayNumber) => {
    const days = {
        1: 'Lunes',
        2: 'Martes',
        3: 'Miércoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sábado',
        7: 'Domingo'
    };
    return days[dayNumber] || 'Día inválido';
};

const MyActivities = ({ authenticatedFetch }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await authenticatedFetch("http://localhost:8080/inscriptions/myactivities");
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setActivities(data.activities || data);
            } catch (err) {
                console.error("Error fetching activities:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [authenticatedFetch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>My Activities</h2>
            <ul>
                {activities.map((activity) => (
                    <li key={activity.id}>
                        {activity.nombre || activity.name} - {activity.categoria} - {activity.profesor} - {getDayName(activity.dia)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyActivities
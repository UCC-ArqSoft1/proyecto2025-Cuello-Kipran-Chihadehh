import React, { useEffect, useState } from "react";

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
                        {activity.nombre} - {activity.categoria} - {activity.profesor}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyActivities
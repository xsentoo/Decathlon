import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/Home.css'; // Pour les styles de la liste

// URL de l'API de classement
const API_URL_LEADERBOARD = "http://localhost:8080/api/exercises/leaderboard";

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                // Si pas de token, on ne peut pas charger le classement sécurisé
                setLoading(false);
                return;
            }

            try {
                // Configuration pour l'envoi du Token JWT
                const config = {
                    headers: { 'Authorization': `Bearer ${token}` }
                };

                // Appel à l'API du classement
                const response = await axios.get(API_URL_LEADERBOARD, config);
                setLeaderboardData(response.data);

            } catch (err) {
                console.error("Erreur de récupération du classement:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <p>Chargement du classement...</p>;
    }

    if (leaderboardData.length === 0) {
        return <p>Aucun athlète dans le classement pour l'instant.</p>;
    }

    // Affichage des données (Mapping du DTO LeaderboardEntry)
    return (
        <ul className="leaderboard-list">
            {leaderboardData.map((user, index) => (
                <li key={user.pseudo} className="leaderboard-item">
                    <span className="rank">#{index + 1}</span>
                    <span className="name">{user.pseudo}</span>
                    <span className="score">{user.point} pts</span>
                    <span className="badge">{user.badge}</span>
                </li>
            ))}
        </ul>
    );
}

export default Leaderboard;
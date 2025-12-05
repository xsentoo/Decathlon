import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import decathlonLogo from '../assets/decathlon-logo.svg';
import Leaderboard from '../components/Leaderboard.jsx'; // 👈 On garde l'import externe

// --- Composant pour la Barre de Progression ---
const ProgressBar = ({ points, level }) => {
    // Définition des objectifs de niveau (doit correspondre à la logique Java)
    const TARGET_SCORES = {
        'Novice': 500,
        'Debutant': 500,
        'Intermediaire': 1500,
        'Expert': 2000,
    };

    const currentLevelTarget = TARGET_SCORES[level] || 500;
    const percent = level === 'Expert' ? 100 : Math.min(100, (points / currentLevelTarget) * 100);

    return (
        <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${percent}%` }}></div>
        </div>
    );
};

/* ATTENTION : LE COMPOSANT LEADERBOARD EST SUPPRIMÉ ICI
POUR UTILISER L'IMPORTATION EXTERNE (import Leaderboard from '../components/Leaderboard.jsx';)
*/

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL_USER_PROFILE = "http://localhost:8080/api/users/profile";
    const API_URL_EXERCISES = "http://localhost:8080/api/exercises";
    const API_URL_LEADERBOARD = "http://localhost:8080/api/exercises/leaderboard";

    useEffect(() => {
        const fetchUserDataAndExercises = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/auth');
                return;
            }

            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            setLoading(true);

            try {
                // 1. Récupérer les données de l'utilisateur et du profil
                const userResponse = await axios.get(API_URL_USER_PROFILE, config);
                setUser(userResponse.data);
                const sportFocus = userResponse.data.sportFocus;
                const painArea = userResponse.data.painArea;

                // 2. Récupérer les exercices (Moteur intelligent : Sport OU Douleur)
                const exercisesResponse = await axios.get(`${API_URL_EXERCISES}/filter?sport=${sportFocus}&pain=${painArea}`, config);
                setExercises(exercisesResponse.data);

                // 3. Récupérer le classement
                const leaderboardResponse = await axios.get(API_URL_LEADERBOARD, config);
                setLeaderboard(leaderboardResponse.data);


            } catch (err) {
                console.error("Erreur lors de la récupération des données:", err.response || err);
                setError("Impossible de charger les données. (Vérifiez votre Token/Session)");
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    localStorage.clear();
                    navigate('/auth');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataAndExercises();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth');
    };

    // --- Extraction des Produits pour la Section Recommandations ---
    const recommendedProduct = exercises.length > 0 ? exercises[0] : null;

    if (loading) {
        return <div className="loading-screen">Chargement du coach...</div>;
    }

    if (error) {
        return <div className="error-screen">{error}</div>;
    }

    return (
        <div className="home-layout">
            {/* TOP BAR / PROFIL & DÉCONNEXION */}
            <header className="home-header">
                <div className="logo-section">
                    <img src={decathlonLogo} alt="Decathlon Logo" className="header-logo" />
                    <span className="app-title">Coach Postural</span>
                </div>

                <div className="user-profile-section">
                    {user && (
                        <>
                            <div className="user-info">
                                <span className="user-pseudo">Bienvenue, {user.pseudo}</span>
                                <div className="user-level">Niveau : {user.level}</div>
                                <ProgressBar points={user.point} level={user.level} />
                                <span className="user-points">{user.point} points</span>
                            </div>
                            <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
                        </>
                    )}
                </div>
            </header>

            <main className="home-content">
                {/* SECTION PRINCIPALE : EXERCICES */}
                <section className="exercises-section">
                    <h2>Programme Postural ({user.sportFocus} & {user.painArea})</h2>
                    <div className="exercise-list">
                        {exercises.length > 0 ? (
                            exercises.map(exercise => (
                                // Le clic mène à la page détaillée pour faire l'exercice
                                <div key={exercise.id} className="exercise-card" onClick={() => navigate(`/exercise/${exercise.id}`)}>
                                    <h3>{exercise.title}</h3>
                                    <p>{exercise.instructions.substring(0, 70)}...</p>
                                    <span className="exercise-difficulty">Difficulté: {exercise.difficulty} | Récompense: {exercise.pointsReward} pts</span>
                                </div>
                            ))
                        ) : (
                            <p>Aucun exercice trouvé pour votre profil. Veuillez mettre à jour votre profil sportif.</p>
                        )}
                    </div>
                </section>

                {/* SECTION CLASSEMENT & PRODUITS (Colonne latérale) */}
                <aside className="sidebar-sections">
                    {/* LEADERBOARD (Niveau 3) */}
                    <section className="leaderboard-section">
                        <h2>🏆 Top Athlètes (Classement)</h2>
                        {/* 👈 Utilisation du composant importé (Leaderboard.jsx) */}
                        <Leaderboard leaderboardData={leaderboard} />
                    </section>

                    {/* PRODUITS DECATHLON (Niveau 4) */}
                    <section className="products-section">
                        <h2>🛒 Équipement Recommandé</h2>
                        {recommendedProduct ? (
                            <div className="product-display">
                                <img src={recommendedProduct.productImage} alt={recommendedProduct.productName} className="product-img" />
                                <p className="product-name">{recommendedProduct.productName}</p>
                                <a href={recommendedProduct.productUrl} target="_blank" rel="noopener noreferrer" className="btn-buy-sidebar">Acheter (Niveau 4)</a>
                            </div>
                        ) : (
                            <p>Ajoutez des exercices pour voir les recommandations produits.</p>
                        )}
                    </section>
                </aside>
            </main>
        </div>
    );
}

export default Home;
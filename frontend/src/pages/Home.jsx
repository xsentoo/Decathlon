import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import decathlonLogo from '../assets/decathlon-logo.svg';
import Leaderboard from '../components/Leaderboard.jsx';

// === Barre de progression ===
const ProgressBar = ({ points, level }) => {
  const TARGET_SCORES = {
    Novice: 500,
    Debutant: 500,
    Intermediaire: 1500,
    Expert: 2000,
  };

  const target = TARGET_SCORES[level] || 500;
  const percent = level === 'Expert'
    ? 100
    : Math.min(100, (points / target) * 100);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${percent}%` }} />
    </div>
  );
};

// === En-tête de section réutilisable ===
const SectionHeader = ({ title, subtitle, right }) => (
  <div className="section-header">
    <div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
    {right && <div className="section-right">{right}</div>}
  </div>
);

// === Carte exercice réutilisable ===
const ExerciseCard = ({ exercise, onClick }) => (
  <article className="exercise-card" onClick={onClick}>
    <header className="exercise-card-header">
      <h3>{exercise.title}</h3>
      <span
        className={`badge-difficulty badge-${String(exercise.difficulty)
          .toLowerCase()
          .trim()}`}
      >
        {exercise.difficulty}
      </span>
    </header>

    <p className="exercise-description">
      {exercise.instructions
        ? `${exercise.instructions.substring(0, 110)}...`
        : 'Instructions à venir.'}
    </p>

    <footer className="exercise-meta">
      <span className="exercise-reward">+ {exercise.pointsReward} pts</span>
      <span className="exercise-cta">Voir l’exercice →</span>
    </footer>
  </article>
);

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL_USER_PROFILE = 'http://localhost:8080/api/users/profile';
  const API_URL_EXERCISES = 'http://localhost:8080/api/exercises';
  const API_URL_LEADERBOARD =
    'http://localhost:8080/api/exercises/leaderboard';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/auth');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      setLoading(true);

      try {
        const userRes = await axios.get(API_URL_USER_PROFILE, config);
        setUser(userRes.data);

        const { sportFocus, painArea } = userRes.data;

        const exRes = await axios.get(
          `${API_URL_EXERCISES}/filter?sport=${sportFocus}&pain=${painArea}`,
          config
        );
        setExercises(exRes.data);

        const lbRes = await axios.get(API_URL_LEADERBOARD, config);
        setLeaderboard(lbRes.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError(
          'Impossible de charger les données. (Vérifiez votre session ou votre connexion.)'
        );
        if (err.response && [401, 403].includes(err.response.status)) {
          localStorage.clear();
          navigate('/auth');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const recommendedProduct = exercises[0] || null;

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loader-dot" />
        <span className="loader-dot" />
        <span className="loader-dot" />
        <span className="loader-text">Chargement du coach...</span>
      </div>
    );
  }

  if (error) return <div className="error-screen">{error}</div>;
  if (!user) return null;

  return (
    <div className="home-layout">
      {/* === HEADER === */}
      <header className="home-header">
        <div className="logo-section">
          <img src={decathlonLogo} alt="Decathlon" className="header-logo" />
        </div>

        <div className="user-profile-section">
          <div className="user-info">
            <span className="user-pseudo">{user.pseudo}</span>
            <div className="user-level-row">
              <span className="user-level-badge">Niveau {user.level}</span>
              <span className="user-points">{user.point} pts</span>
            </div>
            <ProgressBar points={user.point} level={user.level} />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn-logout"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* === CONTENU === */}
      <main className="home-content">
        {/* Colonne gauche : programme */}
        <section className="panel exercises-section">
          <SectionHeader
            title="Programme postural du jour"
            subtitle={
              <>
                Personnalisé pour <strong>{user.sportFocus}</strong> · Zone
                sensible : <strong>{user.painArea}</strong>
              </>
            }
            right={
              <div className="section-tags">
                <span className="tag-pill">
                  {user.sportFocus || 'Sport'}
                </span>
                <span className="tag-pill tag-pill-soft">
                  {user.painArea || 'Zone douloureuse'}
                </span>
              </div>
            }
          />

          <div className="exercise-list">
            {exercises.length ? (
              exercises.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  onClick={() => navigate(`/exercise/${ex.id}`)}
                />
              ))
            ) : (
              <p className="empty-state">
                Aucun exercice trouvé pour votre profil.
                <br />
                <span>
                  Mettez à jour votre profil sportif pour recevoir un programme
                  adapté.
                </span>
              </p>
            )}
          </div>
        </section>

        {/* Colonne droite : leaderboard + produit */}
        <aside className="sidebar-sections">
          <section className="panel leaderboard-section">
            <SectionHeader title="Top Athlètes" />
            <Leaderboard leaderboardData={leaderboard} />
          </section>

          <section className="panel products-section">
            <SectionHeader title="Équipement recommandé" />

            {recommendedProduct ? (
              <div className="product-display">
                {recommendedProduct.productImage && (
                  <img
                    src={recommendedProduct.productImage}
                    alt={recommendedProduct.productName}
                    className="product-img"
                  />
                )}
                <p className="product-name">
                  {recommendedProduct.productName}
                </p>
                <a
                  href={recommendedProduct.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-buy-sidebar"
                >
                  Voir sur Decathlon.fr
                </a>
              </div>
            ) : (
              <p className="empty-state-products">
                Ajoutez ou complétez vos exercices pour obtenir une
                recommandation produit adaptée.
              </p>
            )}
          </section>
        </aside>
      </main>
    </div>
  );
}

export default Home;

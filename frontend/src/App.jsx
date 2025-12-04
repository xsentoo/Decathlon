import { useState } from 'react'
import axios from 'axios'
import Quiz from './Quiz'
import ExerciseCard from './components/ExerciseCard'
import './App.css'

function App() {
    const [view, setView] = useState('home'); // 'home', 'quiz', 'results'
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    const handleQuizFinish = async (answers) => {
        setUserProfile(answers);
        setView('results');
        setLoading(true);

        try {
            // APPEL AU BACKEND SPRING BOOT
            const response = await axios.get(`http://localhost:8080/api/exercises/filter?sport=${answers.sport}`);
            setExercises(response.data);
        } catch (error) {
            console.error("Erreur API:", error);
            alert("Erreur de connexion au Backend (Port 8080) !");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <h1>DECATHLON <span>COACH</span></h1>
            </nav>

            <main className="content">
                {/* ÉCRAN 1 : ACCUEIL */}
                {view === 'home' && (
                    <div className="hero-section">
                        <h2>Prévenez les blessures</h2>
                        <p>Un diagnostic rapide pour adapter votre échauffement.</p>
                        <button className="btn-start" onClick={() => setView('quiz')}>
                            Commencer le diagnostic
                        </button>
                    </div>
                )}

                {/* ÉCRAN 2 : QUIZ */}
                {view === 'quiz' && (
                    <Quiz onFinish={handleQuizFinish} />
                )}

                {/* ÉCRAN 3 : RÉSULTATS */}
                {view === 'results' && (
                    <div className="results-section">
                        <h2>Recommandé pour : {userProfile?.sport}</h2>

                        {loading && <p>Chargement des exercices...</p>}

                        <div className="cards-grid">
                            {exercises.map(ex => (
                                <ExerciseCard key={ex.id} data={ex} />
                            ))}
                        </div>

                        {exercises.length === 0 && !loading && (
                            <div className="no-results">
                                <p>Aucun exercice trouvé pour ce sport.</p>
                                <small>(Astuce : Essayez "Yoga" ou "Running" pour la démo)</small>
                            </div>
                        )}

                        <button className="btn-reset" onClick={() => setView('home')}>Refaire le test</button>
                    </div>
                )}
            </main>
        </div>
    )
}

export default App
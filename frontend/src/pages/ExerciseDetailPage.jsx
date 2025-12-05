import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExerciseDetailPage.css'; // CSS séparé

function ExerciseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [completionStatus, setCompletionStatus] = useState(null);

    const API_URL_EXERCISE = `http://localhost:8080/api/exercises/${id}`;
    const API_URL_COMPLETE = `http://localhost:8080/api/exercises/${id}/complete`;

    const EXERCISE_DURATION = 10;

    // --- 1. CHARGEMENT DE L'EXERCICE ---
    useEffect(() => {
        const fetchExercise = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return navigate('/auth');

            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.get(API_URL_EXERCISE, config);
                setExercise(response.data);
                setTimer(EXERCISE_DURATION);
            } catch (error) {
                console.error("Erreur de chargement de l'exercice:", error);
                navigate('/home');
            } finally {
                setLoading(false);
            }
        };
        fetchExercise();
    }, [id, navigate]);

    // --- 2. LOGIQUE DU COMPTEUR ---
    useEffect(() => {
        let interval = null;
        if (isRunning && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        } else if (isRunning && timer === 0) {
            setIsRunning(false);
            handleCompletion();
        }
        return () => clearInterval(interval);
    }, [isRunning, timer]);

    // --- 3. VALIDATION DE L'EXERCICE ---
    const handleCompletion = async () => {
        const token = localStorage.getItem('authToken');
        const email = localStorage.getItem('userEmail');

        if (!token || completionStatus) return;

        try {
            setCompletionStatus('done');
            const payload = { email };
            const response = await axios.post(API_URL_COMPLETE, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert(`🎉 Succès ! ${response.data.message} Score total: ${response.data.newScore}`);
            setCompletionStatus('success');
            setTimeout(() => navigate('/home'), 3000);
        } catch (error) {
            console.error("Erreur de validation des points:", error);
            setCompletionStatus('fail');
            alert("Erreur: L'exercice a déjà été validé ou token expiré.");
        }
    };

    if (loading) return <div className="loading-screen">Préparation de l'exercice...</div>;
    if (!exercise) return <div className="error-screen">Exercice non trouvé ou données manquantes.</div>;

    return (
        <div className="detail-layout">
            <button onClick={() => navigate('/home')} className="btn-back">← Retour au Dashboard</button>

            <div className="exercise-container">
                <h1>{exercise.title}</h1>

                <div className="gif-area">
                    <img src={exercise.gifUrl} alt={exercise.title} />
                </div>

                <div className="instructions-box">
                    <h3>Instructions</h3>
                    <p>{exercise.instructions}</p>
                </div>

                <div className="game-area">
                    <div className={`timer ${timer < 4 ? 'alert' : ''}`}>
                        {timer === 0 ? "✅ FINI !" : `${timer}s`}
                    </div>

                    <button
                        className={`btn-start-exo ${isRunning ? 'stop' : ''}`}
                        onClick={() => setIsRunning(!isRunning)}
                        disabled={completionStatus === 'success'}
                    >
                        {isRunning ? '🛑 STOP' : '▶️ DÉMARRER L\'EXERCICE'}
                    </button>

                    {completionStatus === 'success' && <p className="success-msg">🎉 EXERCICE VALIDÉ ! Points ajoutés.</p>}
                </div>

                <div className="product-display-detail">
                    <h4>Équipement recommandé</h4>
                    <img src={exercise.productImage} alt={exercise.productName} className="product-thumb-large"/>
                    <a href={exercise.productUrl} target="_blank" rel="noopener noreferrer" className="btn-buy-lg">
                        Acheter {exercise.productName}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ExerciseDetailPage;
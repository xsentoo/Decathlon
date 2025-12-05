import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import '../App.css';

function ProfilingPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // URL de l'API de mise à jour sécurisée que nous avons codée
    const API_URL_UPDATE = "http://localhost:8080/api/users/profile-update";

    const [profileForm, setProfileForm] = useState({
        sportFocus: '',
        painArea: '',
    });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validation front (on vérifie que l'utilisateur a sélectionné quelque chose)
        if (!profileForm.sportFocus || !profileForm.painArea) {
            setError("Veuillez sélectionner votre sport et votre zone de douleur.");
            setLoading(false);
            return;
        }

        try {
            // Récupération des infos de connexion
            const token = localStorage.getItem("authToken");

            if (!token) {
                setError("Session expirée. Veuillez vous reconnecter.");
                navigate("/auth");
                return;
            }

            const payload = {
                sportFocus: profileForm.sportFocus,
                painArea: profileForm.painArea,
            };

            // 1. Appel sécurisé à l'API (PUT /profile-update)
            await axios.put(API_URL_UPDATE, payload, {
                headers: {
                    // Envoi du Token JWT dans le Header Authorization
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            // 2. Succès : Redirection vers le Tableau de Bord (Home)
            navigate("/home");

        } catch (err) {
            console.error("Erreur de mise à jour du profil:", err.response ? err.response.data : err.message);
            setError("Erreur API : Impossible de mettre à jour le profil.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout" style={{background: '#042365'}}>
            <div className="auth-right">
                <div className="auth-panel" style={{background: '#1b4fb8', padding: '30px', borderRadius: '15px'}}>
                    <h1 style={{color: 'white', textAlign: 'center'}}>Étape 1 : Finalisation du Profil</h1>
                    <p style={{color: 'white', opacity: 0.8, textAlign: 'center', marginBottom: '1.5rem'}}>
                        Pour vous fournir les meilleurs conseils de prévention, répondez à ces questions.
                    </p>

                    {error && <p style={{ color: 'yellow', textAlign: 'center' }}>{error}</p>}

                    <form className="auth-form" onSubmit={handleProfileSubmit}>

                        {/* CHAMP 1 : SPORT */}
                        <label style={{color: 'white'}}>Sport principal :
                            <select
                                name="sportFocus"
                                value={profileForm.sportFocus}
                                onChange={(e) => setProfileForm({...profileForm, sportFocus: e.target.value})}
                                required
                                style={{padding: '0.6rem 0.2rem', background: 'transparent', border: 'none', borderBottom: '2px solid rgba(255, 255, 255, 0.35)', color: 'white', fontSize: '1rem'}}
                            >
                                <option value="" disabled hidden style={{backgroundColor: '#042365'}}>-- Choisir un sport --</option>
                                <option value="Running" style={{backgroundColor: '#042365'}}>Running</option>
                                <option value="Yoga" style={{backgroundColor: '#042365'}}>Yoga</option>
                                <option value="Musculation" style={{backgroundColor: '#042365'}}>Musculation</option>
                                <option value="Surf" style={{backgroundColor: '#042365'}}>Surf</option>
                            </select>
                        </label>

                        {/* CHAMP 2 : DOULEUR */}
                        <label style={{color: 'white'}}>Zone de douleur actuelle :
                            <select
                                name="painArea"
                                value={profileForm.painArea}
                                onChange={(e) => setProfileForm({...profileForm, painArea: e.target.value})}
                                required
                                style={{padding: '0.6rem 0.2rem', background: 'transparent', border: 'none', borderBottom: '2px solid rgba(255, 255, 255, 0.35)', color: 'white', fontSize: '1rem'}}
                            >
                                <option value="" disabled hidden style={{backgroundColor: '#042365'}}>-- Choisir la zone --</option>
                                <option value="Aucune" style={{backgroundColor: '#042365'}}>Aucune</option>
                                <option value="Dos" style={{backgroundColor: '#042365'}}>Dos</option>
                                <option value="Genoux" style={{backgroundColor: '#042365'}}>Genoux</option>
                                <option value="Epaules" style={{backgroundColor: '#042365'}}>Épaules</option>
                            </select>
                        </label>

                        <button type="submit" className="btn-primary" disabled={loading} style={{marginTop: '20px', marginLeft: 'auto', marginRight: 'auto'}}>
                            {loading ? "Mise à jour..." : "Valider et Accéder au Coach"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilingPage;
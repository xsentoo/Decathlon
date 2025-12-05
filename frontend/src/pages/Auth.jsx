import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import decathlonLogo from "../assets/decathlon-logo.svg";

function Auth() {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = "http://localhost:8080/api/auth";

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    pseudo: "", // Nom d'affichage
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'login') {
      setLoginForm({ ...loginForm, [name]: value });
    } else {
      setSignupForm({ ...signupForm, [name]: value });
    }
  };


  // --- LOGIQUE DE CONNEXION ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Appel à POST /api/auth/login
      const response = await axios.post(`${API_URL}/login`, loginForm);

      const token = response.data.token;
      const pseudo = response.data.pseudo;
      const email = loginForm.email;

      // 🚨 NOUVEAU : Récupération des données de profilage
      const { sportFocus, painArea } = response.data;

      // 2. Stockage du Token JWT et de l'identité
      localStorage.setItem("authToken", token);
      localStorage.setItem("userPseudo", pseudo);
      localStorage.setItem("userEmail", email);

      // 3. LOGIQUE CONDITIONNELLE (Le fix UX)
      // On vérifie si le profil est encore à l'état par défaut 'NOT_SET'
      if (sportFocus === "NOT_SET" || painArea === "NOT_SET") {
        // Si le profil n'est pas rempli, on redirige vers le Quiz
        navigate("/profiling");
      } else {
        // Sinon, on va directement au Tableau de Bord
        navigate("/home");
      }

    } catch (err) {
      setError("Erreur de connexion : Email ou mot de passe incorrect.");
      console.error("Login API Error:", err);
    }
  };

  // --- LOGIQUE D'INSCRIPTION ---
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (signupForm.password !== signupForm.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const payload = {
        email: signupForm.email,
        password: signupForm.password,
        pseudo: signupForm.pseudo,
        // Valeurs par défaut pour ne pas casser l'API
        sportFocus: "NOT_SET",
        painArea: "NOT_SET",
      };

      await axios.post(`${API_URL}/register`, payload);

      alert("Compte créé ! Veuillez maintenant vous connecter.");
      setMode("login");

    } catch (err) {
      setError("Erreur d'inscription : Cet email est peut-être déjà utilisé.");
      console.error("Signup API Error:", err);
    }
  };


  return (
      <div className="auth-layout">
        {/* COLONNE GAUCHE (Visuel) */}
        <div className="auth-left">
          <div className="auth-left-inner">
            <img src={decathlonLogo} alt="Decathlon Logo" className="auth-logo-img" />
            <h2 className="auth-title">Coach Postural</h2>
            <p className="auth-subtitle">Prépare ton corps avant l'effort, améliore ta posture et évite les blessures.</p>
          </div>
        </div>


        {/* COLONNE DROITE (Formulaires) */}
        <div className="auth-right">
          <div className="auth-panel">
            <h1 className="auth-heading">
              {mode === "login" ? "Se connecter" : "Créer un compte"}
            </h1>

            {/* Onglets */}
            <div className="auth-tabs">
              <button type="button" className={mode === "login" ? "tab active" : "tab"} onClick={() => setMode("login")}>Connexion</button>
              <button type="button" className={mode === "signup" ? "tab active" : "tab"} onClick={() => setMode("signup")}>Inscription</button>
            </div>

            {error && <p style={{ color: 'yellow', textAlign: 'center' }}>{error}</p>}


            {/* FORM LOGIN */}
            {mode === "login" && (
                <form className="auth-form" onSubmit={handleLoginSubmit}>
                  <label>Email<input type="email" required name="email" value={loginForm.email} onChange={(e) => handleChange(e, 'login')} placeholder="exemple@mail.com" /></label>
                  <label>Mot de passe<input type="password" required name="password" value={loginForm.password} onChange={(e) => handleChange(e, 'login')} placeholder="••••••••" /></label>

                  <button type="submit" className="btn-primary">Se connecter</button>

                  <p className="small-text">Pas encore de compte ? <button type="button" className="link-button" onClick={() => setMode("signup")}>S&apos;inscrire</button></p>
                </form>
            )}

            {/* FORM SIGNUP */}
            {mode === "signup" && (
                <form className="auth-form" onSubmit={handleSignupSubmit}>
                  <label>Nom d&apos;affichage (Pseudo)<input type="text" required name="pseudo" value={signupForm.pseudo} onChange={(e) => handleChange(e, 'signup')} placeholder="Ex: MonCoach78" /></label>
                  <label>Email<input type="email" required name="email" value={signupForm.email} onChange={(e) => handleChange(e, 'signup')} placeholder="exemple@mail.com" /></label>
                  <label>Mot de passe<input type="password" required name="password" value={signupForm.password} onChange={(e) => handleChange(e, 'signup')} placeholder="••••••••" /></label>
                  <label>Confirmation<input type="password" required name="confirm" value={signupForm.confirm} onChange={(e) => handleChange(e, 'signup')} placeholder="••••••••" /></label>

                  <button type="submit" className="btn-primary">Créer mon compte</button>

                  <p className="small-text">Déjà inscrit ? <button type="button" className="link-button" onClick={() => setMode("login")}>Se connecter</button></p>
                </form>
            )}
          </div>
        </div>
      </div>
  );
}

export default Auth;
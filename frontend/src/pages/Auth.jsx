import React, { useState } from "react";
import "./Auth.css";
import decathlonLogo from "../assets/decathlon-logo.svg";
import { Typewriter } from "react-simple-typewriter";



function Auth() {
  const [mode, setMode] = useState("login"); 

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("LOGIN", loginForm);
    alert("Connexion simulée ✅ (backend à brancher)");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    console.log("SIGNUP", signupForm);
    alert("Inscription simulée ✅ (backend à brancher)");
  };

  return (
    <div className="auth-layout">
      {/* COLONNE GAUCHE */}
       <div className="auth-left">
            <div className="auth-left-inner">
  <img
    src={decathlonLogo}
    alt="Decathlon"
    className="auth-logo-img"
  />

  <h1 className="auth-title">Coach Postural</h1>

  <p className="auth-subtitle">
    Prépare ton corps avant l'effort, améliore ta posture et évite les
    blessures grâce à un diagnostic simple et guidé.
  </p>

  <div className="auth-badge">
    <Typewriter
      words={[
        "Analyse posturale intelligente…",
        "Conseils posturaux en temps réel…",
        "Routine adaptée à ton niveau…",
      ]}
      loop={true}
      cursor
      cursorStyle="|"
      typeSpeed={60}
      deleteSpeed={40}
      delaySpeed={1800}
    />
  </div>
</div>

            </div>


      {/* COLONNE DROITE */}
      <div className="auth-right">
        <div className="auth-panel">
          <h1 className="auth-heading">
            {mode === "login" ? "Se connecter" : "Créer un compte"}
          </h1>

          {/* Onglets */}
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "tab active" : "tab"}
              onClick={() => setMode("login")}
            >
              Connexion
            </button>
            <button
              type="button"
              className={mode === "signup" ? "tab active" : "tab"}
              onClick={() => setMode("signup")}
            >
              Inscription
            </button>
          </div>

          {/* FORM LOGIN */}
          {mode === "login" && (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <label>
                Email
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  placeholder="exemple@mail.com"
                />
              </label>

              <label>
                Mot de passe
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
              </label>

              <button type="submit" className="btn-primary">
                Se connecter
              </button>

              <p className="small-text">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setMode("signup")}
                >
                  S&apos;inscrire
                </button>
              </p>
            </form>
          )}

          {/* FORM SIGNUP */}
          {mode === "signup" && (
            <form className="auth-form" onSubmit={handleSignupSubmit}>
              <div className="grid-2">
                <label>
                  Prénom
                  <input
                    type="text"
                    required
                    value={signupForm.firstName}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="Entrer votre prénom"
                  />
                </label>

                <label>
                  Nom
                  <input
                    type="text"
                    required
                    value={signupForm.lastName}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="Entrer votre nom"
                  />
                </label>
              </div>

              <label>
                Email
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                  placeholder="exemple@mail.com"
                />
              </label>

              <div className="grid-2">
                <label>
                  Mot de passe
                  <input
                    type="password"
                    required
                    value={signupForm.password}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        password: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                  />
                </label>

                <label>
                  Confirmation
                  <input
                    type="password"
                    required
                    value={signupForm.confirm}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        confirm: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                  />
                </label>
              </div>

              <button type="submit" className="btn-primary">
                Créer mon compte
              </button>

              <p className="small-text">
                Déjà inscrit ?{" "}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setMode("login")}
                >
                  Se connecter
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;

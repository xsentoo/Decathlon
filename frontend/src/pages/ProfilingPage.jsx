import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import "../App.css";
import "./ProfilingPage.css";

const sportOptions = ["Running", "Yoga", "Musculation", "Surf"];
const painOptions = ["Aucune", "Dos", "Genoux", "Épaules"];

// ======= SELECT CUSTOM DÉCATHLON =======
function DecaSelect({ label, placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="profil-field">
      <span className="profil-label">{label}</span>

      <div
        className="deca-select"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={`deca-select-value ${!value ? "deca-select-placeholder" : ""}`}>
          {value || placeholder}
        </span>
        <span className="deca-select-arrow">▾</span>
      </div>

      {open && (
        <div className="deca-options">
          {options.map((opt) => (
            <button
              type="button"
              key={opt}
              className={`deca-option ${
                opt === value ? "deca-option--active" : ""
              }`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ======= PAGE PRINCIPALE =======
function ProfilingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL_UPDATE = "http://localhost:8080/api/users/profile-update";

  const [profileForm, setProfileForm] = useState({
    sportFocus: "",
    painArea: "",
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!profileForm.sportFocus || !profileForm.painArea) {
      setError("Veuillez sélectionner votre sport et votre zone de douleur.");
      setLoading(false);
      return;
    }

    try {
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

      await axios.put(API_URL_UPDATE, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      navigate("/home");
    } catch (err) {
      console.error(
        "Erreur de mise à jour du profil:",
        err.response ? err.response.data : err.message
      );
      setError("Erreur API : Impossible de mettre à jour le profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profiling-page">
      <div className="profil-card">
        {/* Étapes */}
        <div className="profil-steps">
          <div className="profil-step profil-step--active">
            <span className="profil-step-dot" />
            <span>Étape 1 · Profil</span>
          </div>
          <div className="profil-step-divider" />
          <div className="profil-step">
            <span className="profil-step-dot" />
            <span>Étape 2 · Coach</span>
          </div>
          <div className="profil-step">
            <span className="profil-step-dot" />
            <span>Étape 3 · Prévention</span>
          </div>
        </div>

        {/* Header */}
        <div className="profil-header">
          <h1 className="profil-title">
            Finalisation <span>du Profil</span>
          </h1>
          <p className="profil-subtitle">
            Quelques questions pour adapter les conseils de prévention à ton
            sport et à ta zone de fragilité. 100% dans l’esprit Décathlon.
          </p>
        </div>

        {error && <p className="profil-error">{error}</p>}

        <form className="profil-form" onSubmit={handleProfileSubmit}>
          {/* SPORT */}
          <DecaSelect
            label="Sport principal"
            placeholder="-- Choisir un sport --"
            options={sportOptions}
            value={profileForm.sportFocus}
            onChange={(val) =>
              setProfileForm((prev) => ({ ...prev, sportFocus: val }))
            }
          />

          {/* DOULEUR */}
          <DecaSelect
            label="Zone de douleur actuelle"
            placeholder="-- Choisir la zone --"
            options={painOptions}
            value={profileForm.painArea}
            onChange={(val) =>
              setProfileForm((prev) => ({ ...prev, painArea: val }))
            }
          />

          <div className="profil-actions">
            <button
              type="submit"
              className="profil-btn-primary"
              disabled={loading}
            >
              {loading ? "Mise à jour..." : "Valider et Accéder au Coach"}
            </button>
          </div>

          <p className="profil-footnote">
            Ces informations nous aident à personnaliser tes exercices pour
            limiter les risques de blessure. Elles restent confidentielles.
          </p>
        </form>
      </div>
    </div>
  );
}

export default ProfilingPage;

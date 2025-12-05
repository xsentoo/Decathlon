import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import ProfilingPage from "./pages/ProfilingPage.jsx";
import Test from "./pages/Test.jsx";

// 👇 IMPORTS DES PAGES MANQUANTES (Ton partenaire doit les créer)
// import LeaderboardPage from "./pages/LeaderboardPage.jsx";
// import ExerciseDetailPage from "./pages/ExerciseDetailPage.jsx";

// ----------------------------------------------------
// COMPOSANT CRITIQUE : Protection des Routes Sécurisées
// ----------------------------------------------------
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('authToken');
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};
// ----------------------------------------------------


function App() {
    return (
        <Routes>

            {/* 1. ROUTES PUBLIQUES */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />

            {/* 2. ROUTES PROTÉGÉES */}

            {/* 🚨 FLUX POST-LOGIN */}
            <Route path="/profiling" element={<ProtectedRoute><ProfilingPage /></ProtectedRoute>} />

            {/* TABLEAU DE BORD / HOME */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            {/* CLASSEMENT (Si la page LeaderboardPage.jsx est créée) */}
            {/* <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} /> */}

            {/* PAGE D'EXERCICE DÉTAILLÉE (avec l'ID de l'exo en paramètre) */}
            {/* <Route path="/exercise/:id" element={<ProtectedRoute><ExerciseDetailPage /></ProtectedRoute>} /> */}

            {/* Route de Test */}
            <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />

            {/* Redirection en cas d'URL inconnue */}
            <Route path="*" element={<Navigate to to="/auth" replace />} />
        </Routes>
    );
}

export default App;
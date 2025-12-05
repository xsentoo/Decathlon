import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import ProfilingPage from "./pages/ProfilingPage.jsx";
import Test from "./pages/Test.jsx";
// 👇 Importation des pages pour le flux complet
import ExerciseDetailPage from "./pages/ExerciseDetailPage.jsx";
// import LeaderboardPage from "./pages/LeaderboardPage.jsx"; // Laissons celle-ci commentée car elle n'est pas encore faite

// ----------------------------------------------------
// COMPOSANT CRITIQUE : Protection des Routes Sécurisées
// ----------------------------------------------------
const ProtectedRoute = ({ children }) => {
    // Vérifie si le Token JWT existe (preuve de connexion)
    const isAuthenticated = localStorage.getItem('authToken');

    if (!isAuthenticated) {
        // Si pas de Token, on redirige vers l'écran de Login
        return <Navigate to="/auth" replace />;
    }
    // Si Token présent, on affiche le contenu demandé
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

            {/* FLUX POST-LOGIN */}
            <Route path="/profiling" element={<ProtectedRoute><ProfilingPage /></ProtectedRoute>} />

            {/* TABLEAU DE BORD / HOME */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            {/* 🚨 NOUVELLE ROUTE : PAGE D'EXERCICE DÉTAILLÉE */}
            <Route path="/exercise/:id" element={<ProtectedRoute><ExerciseDetailPage /></ProtectedRoute>} />

            {/* Le classement sera ici : */}
            {/* <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} /> */}

            {/* Route de Test */}
            <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />

            {/* Redirection en cas d'URL inconnue */}
            <Route path="*" element={<Navigate  to="/auth" replace />} />
        </Routes>
    );
}

export default App;
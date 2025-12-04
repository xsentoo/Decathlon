import { useState } from 'react'
import './App.css'

function App() {
    return (
        <div className="app-container">
            {/* HEADER DECATHLON */}
            <nav className="navbar">
                <h1>DECATHLON <span>COACH</span></h1>
            </nav>

            {/* CONTENU PRINCIPAL */}
            <main className="content">
                <h2>Votre Santé Posturale</h2>
                <p>Préparez votre corps avant l'effort pour éviter les blessures.</p>

                <div className="card-container">
                    {/* On affichera le Quiz ici bientôt */}
                    <button className="btn-start">Commencer le diagnostic</button>
                </div>
            </main>
        </div>
    )
}

export default App
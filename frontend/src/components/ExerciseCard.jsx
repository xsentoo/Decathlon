import React from 'react';

function ExerciseCard({ data }) {
    return (
        <div className="exercise-card">
            {/* NIVEAU 3 : VISUEL (GIF) */}
            <div className="card-image">
                <img src={data.gifUrl} alt={data.title} />
                <span className="badge-difficulty">{data.difficulty}</span>
            </div>

            <div className="card-content">
                {/* NIVEAU 2 : INSTRUCTIONS */}
                <h3>{data.title}</h3>
                <p className="instructions">{data.instructions}</p>

                <div className="points-badge">
                    🏆 +{data.pointsReward} pts
                </div>

                {/* NIVEAU 4 : BONUS BUSINESS DECATHLON */}
                <div className="product-recommendation">
                    <p className="reco-title">💡 L'équipement recommandé :</p>
                    <div className="product-row">
                        <img src={data.productImage} alt={data.productName} className="product-thumb"/>
                        <div className="product-info">
                            <span>{data.productName}</span>
                            <a href={data.productUrl} target="_blank" rel="noreferrer" className="btn-buy">
                                Voir sur Decathlon.fr
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExerciseCard;
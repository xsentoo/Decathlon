import { useState } from 'react';

function Quiz({ onFinish }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({
        sport: '',
        level: '',
        pain: false
    });

    const questions = [
        {
            question: "Quel est votre sport de prédilection ?",
            key: "sport",
            options: ["Running", "Yoga", "Musculation", "Surf"]
        },
        {
            question: "Quel est votre niveau actuel ?",
            key: "level",
            options: ["Debutant", "Intermediaire", "Expert"]
        },
        {
            question: "Ressentez-vous des douleurs ?",
            key: "pain",
            options: ["Oui (Dos/Genoux)", "Non, tout va bien"]
        }
    ];

    const handleOptionClick = (value) => {
        const currentKey = questions[step].key;
        const newAnswers = { ...answers, [currentKey]: value };
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            onFinish(newAnswers);
        }
    };

    const currentQ = questions[step];

    return (
        <div className="quiz-card">
            <h3>Question {step + 1} / {questions.length}</h3>
            <p className="question-text">{currentQ.question}</p>

            <div className="options-grid">
                {currentQ.options.map((option) => (
                    <button
                        key={option}
                        className="btn-option"
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Quiz;
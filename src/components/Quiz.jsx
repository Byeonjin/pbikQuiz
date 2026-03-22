import { useState, useEffect, useRef } from 'react';
import otter from "../../public/otter.jpg";

export default function Quiz({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const question = questions[currentIndex];

  const advance = (newResults) => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setAttempts(0);
      setFeedback(null);
    } else {
      onComplete(newResults);
    }
  };

  const handleChoice = (choice) => {
    if (feedback) return;

    const isCorrect = choice === question.correctAnswer;

    if (isCorrect) {
      setFeedback('correct');
      const newResults = [...results, { word: question.word, meaning: question.meaning, passed: true }];
      setResults(newResults);
      timerRef.current = setTimeout(() => advance(newResults), 300);
    } else {
      setFeedback('wrong');
      if (attempts === 0) {
        timerRef.current = setTimeout(() => {
          setAttempts(1);
          setFeedback(null);
        }, 300);
      } else {
        const newResults = [...results, { word: question.word, meaning: question.meaning, passed: false }];
        setResults(newResults);
        timerRef.current = setTimeout(() => advance(newResults), 300);
      }
    }
  };

  return (
    <div className="quiz">
      <div className="quiz-progress">
        {currentIndex + 1} / {questions.length}
      </div>
      <div className="quiz-prompt">{question.prompt}</div>

      {feedback && (
        <div className={`feedback-overlay ${feedback}`}>
          <img src={otter} alt="" className="feedback-otter" />
          <span className="feedback-mark">
            {feedback === "correct" ? "O" : "X"}
          </span>
        </div>
      )}

      <div className="choices">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            className="choice-btn"
            onClick={() => handleChoice(choice)}
            disabled={!!feedback}
          >
            {i + 1}. {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

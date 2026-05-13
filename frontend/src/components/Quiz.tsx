import { useState } from 'react';
import type { QuizQuestion } from '../types';
import { RotateCcw, ArrowRight } from 'lucide-react';

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    setIsSubmitted(true);
    if (idx === questions[currentIdx].correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizComplete(false);
  };

  if (!questions || questions.length === 0) return <div>No quiz available</div>;

  if (quizComplete) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{ marginBottom: '1rem' }}>Quiz Complete!</h2>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
          {score} / {questions.length}
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Keep up the great studying!</p>
        <button className="btn-primary" style={{ margin: '0 auto' }} onClick={resetQuiz}>
          <RotateCcw size={18} /> Retake Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.95rem', opacity: 0.7 }}>Question {currentIdx + 1} of {questions.length}</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Score: {score}</span>
      </div>
      
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.35rem', lineHeight: 1.4 }}>{q.question}</h3>
      
      <div>
        {q.options.map((opt, idx) => {
          let classes = "quiz-option";
          if (isSubmitted) {
            if (idx === q.correct_answer) classes += " correct";
            else if (idx === selectedOption) classes += " wrong";
          }
          
          return (
            <button 
              key={idx} 
              className={classes}
              onClick={() => handleAnswer(idx)}
              disabled={isSubmitted}
              style={{ fontSize: '1.1rem', padding: '1.2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{fontWeight:600, opacity: 0.6}}>{String.fromCharCode(65 + idx)}.</span>
                <span>{opt.replace(/^[A-D][\.\)]\s*/, '')}</span>
              </div>
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div className="explanation" style={{ padding: '1.2rem', marginTop: '1.5rem' }}>
          <strong style={{fontSize: '1.1rem'}}>{selectedOption === q.correct_answer ? "✅ Correct!" : "❌ Not quite."}</strong>
          <p style={{ marginTop: '0.75rem', fontSize: '1.05rem', lineHeight: 1.5 }}>{q.explanation}</p>
          
          <button 
            className="btn-primary" 
            style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
            onClick={handleNext}
          >
            {currentIdx === questions.length - 1 ? "Finish" : "Next Question"} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

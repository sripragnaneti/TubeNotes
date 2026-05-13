import { useState } from 'react';
import type { Flashcard as FlashcardType } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Flashcards({ data }: { data: FlashcardType[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 200);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
    }, 200);
  };

  if (!data || data.length === 0) return null;

  return (
    <div>
      <div 
        className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <h2 style={{textAlign: 'center', fontSize: '1.8rem'}}>{data[currentIndex].front}</h2>
          </div>
          <div className="flashcard-back">
            <p style={{fontSize: '1.25rem', lineHeight: 1.6, fontWeight: 500}}>{data[currentIndex].back}</p>
          </div>
        </div>
      </div>
      
      <div className="controls">
        <button className="circle-btn" onClick={handlePrev} disabled={data.length <= 1}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {currentIndex + 1} / {data.length}
        </div>
        <button className="circle-btn" onClick={handleNext} disabled={data.length <= 1}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

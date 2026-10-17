import { useState, useEffect } from 'react';
import styles from './MatchGame.module.css';

const SHAPES = [
  { name: 'مثلث', emoji: '🔺' },
  { name: 'مربع', emoji: '🟦' },
  { name: 'دائرة', emoji: '🔵' },
  { name: 'نجمة', emoji: '⭐' },
];

export default function MatchGame({ onClose }) {
  const [currentShape, setCurrentShape] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    nextQuestion();
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextQuestion = () => {
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const shuffled = [...SHAPES].sort(() => Math.random() - 0.5);
    setCurrentShape(randomShape);
    setOptions(shuffled);
  };

  const handleAnswer = (answer) => {
    if (gameOver) return;
    if (answer === currentShape.name) {
      setScore(score + 10);
      nextQuestion();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <button onClick={onClose} className={styles.closeBtn}>✕</button>
          <div className={styles.timer}>⏱️ {timeLeft}s</div>
          <div className={styles.score}>النقاط: {score}</div>
        </div>

        {gameOver ? (
          <div className={styles.gameOver}>
            <h2>انتهى الوقت!</h2>
            <p>نقاطك: {score}</p>
            <button onClick={onClose} className={styles.btn}>العودة</button>
          </div>
        ) : (
          <>
            <div className={styles.question}>
              <span className={styles.bigEmoji}>{currentShape?.emoji}</span>
              <h3>ما هذا الشكل؟</h3>
            </div>
            <div className={styles.options}>
              {options.map((opt) => (
                <button key={opt.name} onClick={() => handleAnswer(opt.name)} className={styles.optionBtn}>
                  {opt.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
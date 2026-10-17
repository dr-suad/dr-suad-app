import { useState, useEffect, useRef } from 'react';
import styles from './MatchGame.module.css';

const SHAPES = [
  { emoji: '🔺', name: 'متساوي الأضلاع' },
  { emoji: '🟦', name: 'مربع الألوان' },
  { emoji: '⚪', name: 'دائرة البقعة' },
  { emoji: '⭐', name: 'نجمة السطوع' },
];

const questions = [
  { emoji: '🔺', correct: 'متساوي الأضلاع' },
  { emoji: '🟦', correct: 'مربع الألوان' },
  { emoji: '⚪', correct: 'دائرة البقعة' },
  { emoji: '⭐', correct: 'نجمة السطوع' },
];

export default function MatchGame({ onClose, onComplete }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [shuffled, setShuffled] = useState([]);
  const [shown, setShown] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const intervalRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setFinalScore(0);
    nextQuestion();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setGameOver(true);
          setFinalScore(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextQuestion = () => {
    const remaining = questions.filter((q) => q.emoji !== shown);
    if (remaining.length === 0) {
      setGameOver(true);
      setFinalScore(score);
      clearInterval(intervalRef.current);
      return;
    }
    const q = remaining[Math.floor(Math.random() * remaining.length)];
    setShown(q.emoji);
    const opts = [q.correct, ...Object.values(SHAPES).map((s) => s.name)].sort(() => Math.random() - 0.5).slice(0, 4);
    setShuffled(opts);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  if (gameOver) {
    return (
      <div className={styles.resultOverlay}>
        <div className={styles.resultCard}>
          <div className={styles.celebration}>{score >= 15 ? '🎉🏆' : score >= 10 ? '🎉' : '💪'}</div>
          <h2 className={styles.resultTitle}>نهاية المطابقة</h2>
          <p className={styles.resultText}>نقاطك النهائية: {finalScore} من {30 * 10}</p>
          <div className={styles.resultActions}>
            <button className={styles.closeBtn} onClick={onClose}>إغلاق</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.score}>النقاط: {score}</span>
          <span className={styles.timer}>⏱ {timeLeft}s</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.questionArea}>
          <span className={styles.emoji}>{shown}</span>
          <span className={styles.questionText}>ما هذا الشكل؟</span>
        </div>

        <div className={styles.options}>
          {shuffled.map((opt, i) => (
            <button key={i} className={styles.option} onClick={() => {
              if (opt === shown) {
                setScore(score + 10);
                nextQuestion();
              }
            }}>
              {opt}
            </button>
          ))}
        </div>

        <div className={styles.status}>
          {timeLeft <= 10 && timeLeft > 0 && <span className={styles.warning}>⏰ وقت قصير!</span>}
        </div>
      </div>
    </div>
  );
}
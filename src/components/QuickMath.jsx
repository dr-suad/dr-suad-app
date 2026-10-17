import { useState, useEffect, useRef } from 'react';
import styles from './QuickMath.module.css';

const OPERATIONS = [
  { symbol: '+', a: 1, b: 1, max: 10 },
  { symbol: '-', a: 5, b: 1, max: 20 },
  { symbol: '×', a: 2, b: 2, max: 5 },
  { symbol: '÷', a: 4, b: 1, max: 10 },
];

export default function QuickMath({ onClose, onComplete }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQ, setCurrentQ] = useState(0);
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const intervalRef = useRef(null);

  const generateQuestion = () => {
    const op = OPERATIONS[Math.floor(Math.random() * OPERATIONS.length)];
    const a = Math.floor(Math.random() * op.max) + 1;
    const b = Math.floor(Math.random() * op.max) + 1;
    let answer;
    let opts;
    switch (op.symbol) {
      case '+':
        answer = a + b;
        opts = [answer, answer + 1, answer - 1, answer + 2];
        break;
      case '-':
        answer = a - b;
        opts = [answer, answer + 1, answer - 1, answer + 2];
        break;
      case '×':
        answer = a * b;
        opts = [answer, answer + 1, answer - 1, answer + 2];
        break;
      case '÷':
        answer = a / b;
        opts = [answer, answer + 1, answer - 1, answer + 2];
        break;
    }
    // Shuffle options
    opts.sort(() => Math.random() - 0.5);
    setCurrentQ((prev) => (prev + 1) % 10);
    setOptions(opts);
    setAnswered(false);
    setResult(null);
  };

  const checkAnswer = (opt) => {
    if (answered || gameOver) return;
    if (opt === result) {
      setScore(score + 10);
      setResult('correct');
      setTimeout(generateQuestion, 600);
    } else {
      setResult('wrong');
      setTimeout(() => {
        if (!gameOver) {
          setResult(null);
          setTimeout(generateQuestion, 600);
        }
      }, 600);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setFinalScore(0);
    setAnswered(false);
    setResult(null);
    generateQuestion();
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

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  if (gameOver) {
    return (
      <div className={styles.resultOverlay}>
        <div className={styles.resultCard}>
          <div className={styles.celebration}>{finalScore >= 50 ? '🎉🏆' : finalScore >= 25 ? '🎉' : '💪'}</div>
          <h2 className={styles.resultTitle}>نهاية الاختبار</h2>
          <p className={styles.resultText}>نقاطك النهائية: {finalScore}</p>
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
          <span className={styles.equation}>
            {Math.floor(currentQ / 4) + 1}.
          </span>
          <span className={styles.equationSymbol}>{currentQ + 1}</span>
          <span className={styles.symbol}>{OPERATIONS[currentQ % 4].symbol}</span>
          <span className={styles.equationB}>{OPERATIONS[currentQ % 4].b}</span>
          <span className={styles.equationResult}>= ؟</span>
        </div>

        <div className={styles.options}>
          {options.map((opt, i) => (
            <button
              key={i}
              className={`${styles.option} ${answered ? (opt === result ? styles.correct : styles.wrong) : ''}`}
              onClick={() => {
                if (!answered) checkAnswer(opt);
              }}
              disabled={answered}
            >
              {opt}
            </button>
          ))}
        </div>

        {result === 'correct' && <div className={styles.success}>✓ إجابة صحيحة! +10 نقاط</div>}
        {result === 'wrong' && <div className={styles.failure}>✗ إجابة خاطئة، حاول مرة أخرى</div>}

        {answered && (
          <div className={styles.nextBtn}>
            <button onClick={generateQuestion}>السؤال التالي →</button>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import styles from './QuickMath.module.css';
import { useAdaptive } from '../hooks/useAdaptive.js';

export default function QuickMath({ onClose }) {
  const [question, setQuestion] = useState({ text: '', answer: 0 });
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const { level, levelKey, recordAnswer } = useAdaptive();

  useEffect(() => {
    generateQuestion();
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

  const generateQuestion = () => {
    let max;
    if (levelKey === 'easy') max = 5;
    else if (levelKey === 'medium') max = 10;
    else max = 20;

    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    const isPlus = Math.random() > 0.5;
    const answer = isPlus ? a + b : a - b;
    const text = `${a} ${isPlus ? '+' : '-'} ${b} = ؟`;
    const wrongOptions = new Set();
    while (wrongOptions.size < 3) {
      const wrong = answer + Math.floor(Math.random() * 10) - 5;
      if (wrong !== answer && wrong >= 0) wrongOptions.add(wrong);
    }
    const allOptions = [answer, ...Array.from(wrongOptions)].sort(() => Math.random() - 0.5);
    setQuestion({ text, answer });
    setOptions(allOptions);
  };

  const handleAnswer = (selected) => {
    if (gameOver) return;
    const isCorrect = selected === question.answer;
    recordAnswer(isCorrect);
    if (isCorrect) {
      setScore(score + 10);
      generateQuestion();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <button onClick={onClose} className={styles.closeBtn}>✕</button>
          <div className={styles.timer}>⏱️ {timeLeft}s</div>
          <div className={styles.score}>النقاط: {score}</div>
          <div className={styles.level}>المستوى: {level}</div>
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
              <h3 className={styles.questionText}>{question.text}</h3>
            </div>
            <div className={styles.options}>
              {options.map((num, idx) => (
                <button key={idx} onClick={() => handleAnswer(num)} className={styles.optionBtn}>
                  {num}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
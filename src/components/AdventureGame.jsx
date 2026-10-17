import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AdventureGame.module.css';
import { playSuccess, playError, playStep, playCelebration } from '../utils/sounds.js';
import GlowButton from './GlowButton.jsx';

const STORY = [
  { id: 1, title: 'مصباح الغابة', emoji: '🌲', question: 'كم هو ٢ + ٣؟', options: ['٤', '٥', '٦', '٧'], correct: 1 },
  { id: 2, title: 'الضفدع الصغير', emoji: '🐸', question: 'كم هو ١٠ − ٣؟', options: ['٥', '٦', '٧', '٨'], correct: 2 },
  { id: 3, title: 'السلحفاة الخضراء', emoji: '🐢', question: 'كم هو ٤ × ٢؟', options: ['٦', '٨', '١٠', '١٢'], correct: 1 },
  { id: 4, title: 'السحاب الناشر', emoji: '☁️', question: 'كم هو ٩ ÷ ٣؟', options: ['٢', '٣', '٤', '٥'], correct: 1 },
  { id: 5, title: 'النحلة القادمة', emoji: '🐝', question: 'كم هو ٧ + ٥؟', options: ['١٢', '١٣', '١٤', '١٥'], correct: 0 },
  { id: 6, title: 'الدب البني', emoji: '🐻', question: 'كم هو ٨ − ٥؟', options: ['١', '٢', '٣', '٤'], correct: 2 },
  { id: 7, title: 'الجمبري البنية', emoji: '🦐', question: 'كم هو ٣ × ٦؟', options: ['١٨', '١٩', '٢٠', '٢١'], correct: 0 },
  { id: 8, title: 'السمكة الزنجية', emoji: '🐟', question: 'كم هو ١٢ ÷ ٤؟', options: ['١', '٢', '٣', '٤'], correct: 2 },
  { id: 9, title: 'النمر السريع', emoji: '🐆', question: 'كم هو ٦ + ٧؟', options: ['١٢', '١٣', '١٤', '١٥'], correct: 1 },
  { id: 10, title: 'الجزرة الذهبية', emoji: '🥕', question: 'كم هو ٨ − ٨؟', options: ['٠', '١', '٢', '٤'], correct: 0 },
];

export default function AdventureGame({ onClose, onComplete }) {
  const [station, setStation] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === STORY[station].correct) {
      setCorrect(correct + 1);
      playSuccess();
      playStep();
      if (station < STORY.length - 1) {
        setStation(station + 1);
        setSelected(null);
      } else {
        setShowResult(true);
        playCelebration();
      }
    } else {
      playError();
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => {
        if (station < STORY.length - 1) setStation(station + 1);
        else setShowResult(true);
      }, 1000);
      setTimeout(() => setSelected(null), 1500);
    }
  };

  if (showResult) {
    return (
      <div className={styles.resultOverlay}>
        <div className={styles.resultCard}>
          <div className={styles.celebration}>
            {correct === STORY.length ? '🎉 🥕 🎉' : `🥕 ${correct}/${STORY.length}`}
          </div>
          <h2 className={styles.resultTitle}>
            {correct === STORY.length ? 'بهجة! لقد وصلت للجزرة الذهبية!' : 'المغامرة انتهت'}
          </h2>
          <p className={styles.resultText}>اكتملت {correct} من {STORY.length} محطة</p>
          <div className={styles.resultActions}>
            <button className={styles.closeBtn} onClick={onClose}>
              ☕ عودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.card}
        animate={shaking ? { x: [0, -12, 12, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
          <span className={styles.stationNumber}>المحطة {station + 1}</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.story}>
          <motion.span
            key={station}
            className={styles.emoji}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          >
            {STORY[station].emoji}
          </motion.span>
          <span className={styles.storyText}>
            أرنب {STORY[station].title}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={station}
            className={styles.question}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {STORY[station].question}
          </motion.div>
        </AnimatePresence>

        <div className={styles.options}>
          {STORY[station].options.map((opt, i) => (
            <motion.button
              key={i}
              className={`${styles.option} ${selected === i ? styles.selected : ''}`}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        <div className={styles.status}>
          {(selected !== null) && (
            <motion.span
              className={`${styles.statusText} ${selected === STORY[station].correct ? styles.correct : styles.wrong} `}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {selected === STORY[station].correct ? 'إجابة صحيحة! ⭐' : 'إجابة خاطئة، حاول مرة أخرى 😅'}
            </motion.span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
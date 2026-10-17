import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMascot } from '../context/MascotContext.jsx';
import { playSuccess, playWrong } from '../utils/sounds.js';
import styles from './LessonQuiz.module.css';

function getQuestions(lesson) {
  const lessonsMap = {
    'c1-l1': [
      { id: 'q1', text: 'كم عدد التفاحات؟ 🍎🍎', options: ['1', '2', '3'], answer: '2' },
      { id: 'q2', text: 'أي رقم أكبر: 1 أم 3؟', options: ['1', '2', '3'], answer: '3' },
      { id: 'q3', text: 'اختر الرقم 2.', options: ['1', '2', '3'], answer: '2' },
    ],
    'c1-l2': [
      { id: 'q4', text: 'كم عدد النجوم؟ ⭐⭐⭐⭐', options: ['4', '5', '6'], answer: '4' },
      { id: 'q5', text: 'ما الرقم بعد 4؟', options: ['3', '4', '5'], answer: '5' },
      { id: 'q6', text: 'اختر الرقم 5.', options: ['4', '5', '6'], answer: '5' },
    ],
    'c1-l3': [
      { id: 'q7', text: 'كم عدد الأقلام؟ ✏️✏️✏️✏️✏️✏️✏️', options: ['7', '8', '9'], answer: '7' },
      { id: 'q8', text: 'ما الرقم قبل 9؟', options: ['7', '8', '9'], answer: '8' },
      { id: 'q9', text: 'اختر الرقم 8.', options: ['7', '8', '9'], answer: '8' },
    ],
    'c1-l4': [
      { id: 'q10', text: 'أيهما أكبر: 5 أم 8؟', options: ['5', '8'], answer: '8' },
      { id: 'q11', text: 'أيهما أصغر: 2 أم 7؟', options: ['2', '7'], answer: '2' },
      { id: 'q12', text: 'رتب من الأصغر للأكبر: 3, 1, 2', options: ['1، 2، 3', '3، 2، 1', '2، 3، 1'], answer: '1، 2، 3' },
    ],
    'c1-l5': [
      { id: 'q13', text: '2 + 3 = ؟', options: ['4', '5', '6'], answer: '5' },
      { id: 'q14', text: '4 + 1 = ؟', options: ['4', '5', '6'], answer: '5' },
      { id: 'q15', text: '5 + 3 = ؟', options: ['7', '8', '9'], answer: '8' },
    ],
    'c1-l6': [
      { id: 'q16', text: '5 - 2 = ؟', options: ['2', '3', '4'], answer: '3' },
      { id: 'q17', text: '7 - 3 = ؟', options: ['3', '4', '5'], answer: '4' },
      { id: 'q18', text: '9 - 4 = ؟', options: ['4', '5', '6'], answer: '5' },
    ],
    'c2-l1': [
      { id: 'q19', text: 'ما الرقم بعد 20؟', options: ['19', '20', '21'], answer: '21' },
      { id: 'q20', text: 'كم عشرة في 45؟', options: ['2', '4', '5'], answer: '4' },
      { id: 'q21', text: 'اختر الرقم 30.', options: ['20', '30', '40'], answer: '30' },
    ],
    'c2-l2': [
      { id: 'q22', text: '20 + 15 = ؟', options: ['35', '36', '34'], answer: '35' },
      { id: 'q23', text: '30 - 12 = ؟', options: ['18', '19', '20'], answer: '18' },
      { id: 'q24', text: '40 + 8 = ؟', options: ['48', '49', '47'], answer: '48' },
    ],
    'c2-l3': [
      { id: 'q25', text: '2 × 3 = ؟', options: ['5', '6', '7'], answer: '6' },
      { id: 'q26', text: '3 × 4 = ؟', options: ['7', '12', '13'], answer: '12' },
      { id: 'q27', text: '2 × 5 = ؟', options: ['7', '10', '12'], answer: '10' },
    ],
    'c2-l4': [
      { id: 'q28', text: '8 ÷ 2 = ؟', options: ['3', '4', '5'], answer: '4' },
      { id: 'q29', text: '10 ÷ 5 = ؟', options: ['2', '3', '4'], answer: '2' },
      { id: 'q30', text: '6 ÷ 3 = ؟', options: ['2', '3', '4'], answer: '2' },
    ],
  };
  return lessonsMap[lesson.id] || [];
}

export default function LessonQuiz({ lesson, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const { say } = useMascot();

  const questions = getQuestions(lesson);
  const q = questions[current];

  if (!q) {
    const correct = selected === null;
    const passed = correct;
    onComplete(lesson.id, passed);
    return null;
  }

  const handleSelect = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === q.answer) {
      playSuccess();
    } else {
      playWrong();
      say('صحّح: الإجابة الصحيحة هي ' + q.answer);
    }
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const passed = selected === q.answer;
      onComplete(lesson.id, passed);
    }
  };

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <span className={styles.quizTitle}>{lesson.title}</span>
        <span className={styles.quizProgress}>
          السؤال {current + 1} / {questions.length}
        </span>
      </div>

      <motion.div
        key={current}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={styles.quizBody}
      >
        <h3 className={styles.quizQuestion}>{q.text}</h3>

        <div className={styles.optionsGrid}>
          {q.options.map((opt) => {
            let btnClass = styles.optionBtn;
            if (answered) {
              if (opt === q.answer) btnClass += ` ${styles.correct}`;
              else if (opt === selected && opt !== q.answer) btnClass += ` ${styles.wrong}`;
            }
            return (
              <motion.button
                key={opt}
                className={btnClass}
                onClick={() => handleSelect(opt)}
                disabled={answered}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        {answered && (
          <motion.p
            key={answered ? 'show' : 'hide'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${styles.feedback} ${selected === q.answer ? styles.feedbackOk : styles.feedbackNo}`}
          >
            {selected === q.answer
              ? '👏 إجابة صحيحة!' 
              : '❌ الإجابة الصحيحة: ' + q.answer}
          </motion.p>
        )}

        {answered && (
          <motion.button
            className={styles.nextBtn}
            onClick={handleNext}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {current + 1 < questions.length ? 'السؤال التالي →' : 'إنهاء التقييم ✓'}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

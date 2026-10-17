import { useState, useEffect } from 'react';
import styles from './DailyChallenge.module.css';

const DAILY_QUESTIONS = [
  { id: 'd1', text: 'كم هو ٥ + ٣؟', answer: '٨', options: ['٦', '٧', '٨', '٩'] },
  { id: 'd2', text: 'كم هو ٩ − ٤؟', answer: '٥', options: ['٤', '٥', '٦', '٧'] },
  { id: 'd3', text: 'كم هو ٢ × ٤؟', answer: '٨', options: ['٦', '٧', '٨', '٩'] },
];

const TODAY = new Date().toDateString();

export default function DailyChallenge({ showToast }) {
  const [completed, setCompleted] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem('suad:dailyChallenge'));
      if (data && data.date === TODAY) return data.completed;
      return false;
    } catch {
      return false;
    }
  });
  const [streak, setStreak] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('suad:daily-streak')) || 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'suad:dailyChallenge',
        JSON.stringify({ date: TODAY, completed })
      );
      if (completed) {
        localStorage.setItem('suad:daily-streak', JSON.stringify(streak + 1));
      }
    } catch {}
  }, [completed, streak, TODAY]);

  const handleComplete = () => {
    setCompleted(true);
    setStreak((prev) => prev + 1);
    if (showToast) showToast('تهانينا! أكملت تحدي اليوم! 🎉', 'success');
  };

  return (
    <section className={styles.challengeSection}>
      <div className={styles.container}>
        <div className={styles.challengeCard}>
          <div className={styles.challengeHeader}>
            <span className={styles.badge}>📅 تحدي اليوم</span>
            <span className={styles.streak}>
              {completed ? '✅ مكتمل' : `🔥 ${streak} أيام متتالية`}
            </span>
          </div>
          <h3 className={styles.challengeTitle}>حلل هذه المسائل الثلاث:</h3>
          <div className={styles.questions}>
            {DAILY_QUESTIONS.map((q) => (
              <div key={q.id} className={styles.questionCard}>
                <p className={styles.questionText}>{q.text}</p>
                <div className={styles.options}>
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      className={styles.option}
                      onClick={() => {
                        if (opt === q.answer) {
                          handleComplete();
                        }
                      }}
                      disabled={completed}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {completed && (
            <div className={styles.celebration}>
              🎉 تهانينا! أكملت تحدي اليوم بنجاح!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
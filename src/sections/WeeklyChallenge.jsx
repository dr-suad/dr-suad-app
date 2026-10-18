import { motion } from 'framer-motion';
import GlowButton from '../components/GlowButton.jsx';
import { useWeeklyChallenge } from '../hooks/useWeeklyChallenge.js';
import { useXP } from '../hooks/useXP.js';
import styles from './WeeklyChallenge.module.css';

export default function WeeklyChallenge({ showToast }) {
  const wc = useWeeklyChallenge();
  const { addXP } = useXP();

  const claim = () => {
    if (!wc.complete || wc.done.claimed) return;
    wc.claim();
    addXP(50);
    if (showToast) showToast('+50 XP! أكملت تحدي الأسبوع 🎉', 'success');
  };

  return (
    <section className={styles.section} id="weekly">
      <div className={styles.container}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.badge}>📅 تحدي الأسبوع</span>
            <span className={styles.countdown}>⏳ {wc.endsIn}</span>
          </div>
          <h2 className={styles.title}>تحدَّ نفسك هذا الأسبوع!</h2>
          <div className={styles.tasks}>
            <div className={styles.task}>
              <span>📚 أكمل دروساً</span>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  animate={{ width: `${(wc.done.lessons / wc.lessonsNeed) * 100}%` }}
                  transition={{ type: 'spring', damping: 20 }}
                />
              </div>
              <span className={styles.count}>{wc.done.lessons}/{wc.lessonsNeed}</span>
            </div>
            <div className={styles.task}>
              <span>🎮 العب ألعاباً</span>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  animate={{ width: `${(wc.done.games / wc.gamesNeed) * 100}%` }}
                  transition={{ type: 'spring', damping: 20 }}
                />
              </div>
              <span className={styles.count}>{wc.done.games}/{wc.gamesNeed}</span>
            </div>
          </div>
          {wc.complete && !wc.done.claimed ? (
            <GlowButton variant="sunshine" onClick={claim}>استلم +50 XP 🎁</GlowButton>
          ) : wc.done.claimed ? (
            <p className={styles.done}>✅ تم استلام المكافأة! أحسنت يا بطل</p>
          ) : (
            <p className={styles.hint}>أكمل المهام لاستلام المكافأة</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

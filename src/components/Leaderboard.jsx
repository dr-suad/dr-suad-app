import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Leaderboard.module.css';

const FAKE_FRIENDS = [
  { name: 'أحمد البطل', xp: 850, stars: 45 },
  { name: 'سارة النشيطة', xp: 720, stars: 38 },
  { name: 'عمر الذكي', xp: 610, stars: 32 },
  { name: 'ليلى المتميزة', xp: 540, stars: 28 },
  { name: 'يوسف المجتهد', xp: 480, stars: 25 },
  { name: 'مريم المتفوقة', xp: 420, stars: 22 },
  { name: 'خالد الشجاع', xp: 350, stars: 18 },
  { name: 'نور المضيئة', xp: 280, stars: 15 },
  { name: 'فارس السريع', xp: 210, stars: 11 },
];

function loadMyStats() {
  let xp = 0;
  let stars = 0;
  try {
    xp = Number(localStorage.getItem('suad:xp')) || 0;
    const prog = JSON.parse(localStorage.getItem('suad:progress'));
    if (prog && typeof prog.stars === 'number') stars = prog.stars;
  } catch {}
  return { xp, stars };
}

export default function Leaderboard() {
  const [open, setOpen] = useState(false);
  const my = loadMyStats();
  const rows = [...FAKE_FRIENDS.map((f) => ({ ...f, me: false })), { name: 'أنت ⭐', xp: my.xp, stars: my.stars, me: true }]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);
  const myRank = rows.findIndex((r) => r.me) + 1;

  return (
    <>
      <button className={styles.triggerBtn} onClick={() => setOpen(true)} aria-label="فتح لوحة الشرف">
        🏆 لوحة الشرف
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.header}>
                <h2 className={styles.title}>🏆 لوحة الشرف</h2>
                <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="إغلاق">✕</button>
              </div>
              <p className={styles.myRank}>أنت رقم {myRank} من {rows.length}! 🎉</p>
              <div className={styles.table}>
                <div className={`${styles.row} ${styles.headRow}`}>
                  <span>الترتيب</span>
                  <span>الاسم</span>
                  <span>XP</span>
                  <span>⭐</span>
                </div>
                {rows.map((r, i) => (
                  <motion.div
                    key={r.name}
                    className={`${styles.row} ${r.me ? styles.meRow : ''}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className={styles.rank}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </span>
                    <span className={styles.name}>{r.name}</span>
                    <span className={styles.xp}>{r.xp}</span>
                    <span className={styles.stars}>{r.stars}</span>
                  </motion.div>
                ))}
              </div>
              <p className={styles.note}>العب أكثر واكسب XP لتصعد في الترتيب! 🚀</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

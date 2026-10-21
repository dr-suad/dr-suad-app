import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { useSound } from '../hooks/useSound.js';
import { useXP } from '../hooks/useXP.js';
import { playLevelUp } from '../utils/sounds.js';
import ParentReport from './ParentReport.jsx';
import Leaderboard from './Leaderboard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header({ stars, dark, onThemeToggle }) {
  const { muted, toggleMute, play } = useSound();
  const { xp, level, progress, leveledUp, clearLevelUp } = useXP();
  const { user, profile, signOut } = useAuth();
  const prevLevel = useRef(level);

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    if (leveledUp) {
      playLevelUp();
      const t = setTimeout(clearLevelUp, 3000);
      return () => clearTimeout(t);
    }
  }, [leveledUp, clearLevelUp]);

  useEffect(() => {
    prevLevel.current = level;
  }, [level]);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <span className={styles.brandEmoji}>🏫</span>
          <h1>منصة نابلس التعليمية</h1>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.starsCounter}>
            ⭐ {stars}
          </div>
          <button className={styles.soundToggle} aria-label="كتم/تشغيل الصوت" onClick={() => { toggleMute(); if (!muted) play('click'); }}>
            {muted ? '🔇' : '🔊'}
          </button>
          <button className={styles.themeToggle} aria-label="تبديل الوضع الليلي" onClick={onThemeToggle}>
            {dark ? '☀️' : '🌙'}
          </button>
          {user && profile && (
            <div className={styles.userBox}>
              <span className={styles.userName}>
                {profile.name || profile.email}
              </span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                تسجيل الخروج
              </button>
            </div>
          )}
          <Leaderboard />
          <ParentReport />
          <button className={styles.hamburger} aria-label="فتح القائمة الرئيسية">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div className={styles.xpRow}>
        <span className={styles.xpLabel}>المستوى {level} — {xp} XP</span>
        <div className={styles.xpTrack}>
          <motion.div
            className={styles.xpFill}
            animate={{ width: `${progress.percent}%` }}
            transition={{ type: 'spring', damping: 22 }}
          />
        </div>
        <span className={styles.xpNext}>{progress.current}/{progress.total}</span>
      </div>
      <AnimatePresence>
        {leveledUp && (
          <motion.div
            className={styles.levelUpBanner}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            🎉 مبروك! وصلت المستوى {level}! 🎉
          </motion.div>
        )}
      </AnimatePresence>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li><a className={styles.navLink} href="#/home">الرئيسية</a></li>
          <li><a className={styles.navLink} href="#/classes">الصفوف</a></li>
          <li><a className={styles.navLink} href="#/plans">الخطط الفصلية</a></li>
          <li><a className={styles.navLink} href="#/preparations">التحضيرات</a></li>
          <li><a className={styles.navLink} href="#/worksheets">أوراق العمل</a></li>
          <li><a className={styles.navLink} href="#/videos">الفيديوهات التعليمية</a></li>
          <li><a className={styles.navLink} href="#/games">الألعاب التعليمية</a></li>
          <li><a className={styles.navLink} href="#/assessment">التقييم</a></li>
          <li><a className={styles.navLink} href="#/about">عن المعلمة</a></li>
        </ul>
      </nav>
    </header>
  );
}
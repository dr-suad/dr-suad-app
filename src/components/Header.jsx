import styles from './Header.module.css';
import { useSound } from '../hooks/useSound.js';
import ParentReport from './ParentReport.jsx';

export default function Header({ stars, dark, onThemeToggle }) {
  const { muted, toggleMute, play } = useSound();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <span className={styles.brandEmoji}>👩🏫</span>
          <h1>د. سعاد قريني</h1>
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
          <ParentReport />
          <button className={styles.hamburger} aria-label="فتح القائمة الرئيسية">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
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
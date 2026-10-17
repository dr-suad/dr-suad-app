import { useState, useEffect } from 'react';
import styles from './ParentReport.module.css';

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export default function ParentReport() {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!open) return;
    const lessons = loadJSON('suad:lessons', []);
    const stars = loadJSON('suad:stars', 0);
    const adaptive = loadJSON('suad:adaptive', { level: 0, streak: 0 });
    const gameScores = loadJSON('suad:gameScores', {});
    const results = loadJSON('suad:results', []);

    const levelNames = ['سهل 🟢', 'متوسط 🟡', 'صعب 🔴'];

    setStats({
      lessonsCompleted: lessons.length,
      stars,
      level: levelNames[adaptive.level] || levelNames[0],
      streak: adaptive.streak || 0,
      gameScores,
      totalResults: results.length,
      bestScore: results.length ? Math.max(...results.map(r => r.score || 0)) : 0,
    });
  }, [open]);

  return (
    <>
      <button className={styles.triggerBtn} onClick={() => setOpen(true)}>
        👨‍👩‍👧 تقرير للأهل
      </button>

      {open && stats && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>تقرير تقدّم الطالب</h2>
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="إغلاق">✕</button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>📚</span>
                <span className={styles.statValue}>{stats.lessonsCompleted}</span>
                <span className={styles.statLabel}>دروس مكتملة</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>⭐</span>
                <span className={styles.statValue}>{stats.stars}</span>
                <span className={styles.statLabel}>نجمة</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>📊</span>
                <span className={styles.statValue}>{stats.level}</span>
                <span className={styles.statLabel}>المستوى الحالي</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>🏆</span>
                <span className={styles.statValue}>{stats.bestScore}</span>
                <span className={styles.statLabel}>أعلى نتيجة</span>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>ملخص الأداء</h3>
              <ul className={styles.summaryList}>
                <li>عدد الدروس المكتملة: {stats.lessonsCompleted}</li>
                <li>إجمالي النجوم: {stats.stars}</li>
                <li>المستوى الحالي: {stats.level}</li>
                <li>عدد مرات إكمال التقييم: {stats.totalResults}</li>
                <li>أعلى نتيجة في التقييم: {stats.bestScore}</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>نصائح للأهل</h3>
              <ul className={styles.tipsList}>
                <li>🌟 شجّع طفلك على حل تحدي اليوم يومياً</li>
                <li>🎮 العب الألعاب التعليمية معاً</li>
                <li>📖 اقرأوا القصص المصورة قبل النوم</li>
                <li>🏅 احتفلوا بالشارات والإنجازات</li>
                <li>💚 لا تنسوا الدعاء وتشجيع الطفل دائماً</li>
              </ul>
            </div>

            <p className={styles.footer}>تم إنشاء هذا التقرير بواسطة نظام د. سعاد التعليمي</p>
          </div>
        </div>
      )}
    </>
  );
}

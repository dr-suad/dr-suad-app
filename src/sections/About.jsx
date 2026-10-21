import styles from '../App.module.css';

export default function About() {
  return (
    <section className={styles.aboutCard} id="about">
      <div className="container">
        <div className={styles.avatar}>🏫</div>
        <h2>عن المنصة 🏫</h2>

        {/* الفقرة التعريفية */}
        <p className={styles.aboutIntro}>
          منصة تعليمية تفاعلية أُطلقت لدعم طلاب المرحلة الأساسية في مديرية التربية والتعليم - نابلس.
          تهدف إلى تعويض الفاقد التعليمي ودمج القيم الوطنية باستخدام أسلوب التعلم باللعب.
        </p>

        {/* بطاقة هيئة الإشراف */}
        <div className={styles.supervisionCard}>
          <span className={styles.supervisionLabel}>بإشراف</span>
          <span className={styles.supervisionName}>الأستاذ جبران قادوس</span>
          <span className={styles.supervisionRole}>
            ومشرفي المرحلة الأساسية واللغة الإنجليزية
          </span>
          <span className={styles.supervisionRole}>
            ومعلمي المرحلة الأساسية واللغة الإنجليزية
          </span>
          <span className={styles.supervisionOrg}>
            في مديرية التربية والتعليم - نابلس
          </span>
        </div>
      </div>
    </section>
  );
}
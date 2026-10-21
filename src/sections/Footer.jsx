import styles from '../App.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.footerText}>
          © 2026 مديرية التربية والتعليم - نابلس. جميع الحقوق محفوظة.
        </p>
        <p className={styles.footerCredit}>بإشراف الأستاذ جبران قادوس</p>
      </div>
    </footer>
  );
}
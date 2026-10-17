import { useMascot } from '../context/MascotContext';
import styles from './Mascot.module.css';

export default function Mascot() {
  const { say, hide, message, visible } = useMascot();

  return (
    <div className={styles.mascotContainer}>
      <div className={styles.mascot} role="button" tabIndex={0} aria-label="الأرنب ذكي">
        🐰
      </div>

      {visible && (
        <div className={styles.bubbleContainer}>
          <div className={styles.bubble}>
            <span className={styles.bubbleText}>{message}</span>
            <button className={styles.closeBtn} onClick={hide} aria-label="إغلاق الفقاعة">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
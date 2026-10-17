import { motion, AnimatePresence } from 'framer-motion';
import styles from './GameShell.module.css';

export default function GameShell({ title, value, onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            {value && <div className={styles.valueBadge}>{value}</div>}
            <button className={styles.closeBtn} onClick={onClose} aria-label="إغلاق اللعبة">✕</button>
          </div>
          <div className={styles.body}>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

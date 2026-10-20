import { motion } from 'framer-motion';
import styles from './StatCard.module.css';

export default function StatCard({ icon, value, label, desc, color = 'var(--mint)', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -8 }}
      className={styles.card}
      style={{ borderTop: `6px solid ${color}` }}
    >
      <div className={styles.top}>
        <motion.span
          className={styles.icon}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {icon}
        </motion.span>
        <motion.span
          key={value}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className={styles.number}
          style={{ color }}
        >
          {value}
        </motion.span>
      </div>
      <h3 className={styles.label}>{label}</h3>
      {desc && <p className={styles.desc}>{desc}</p>}
    </motion.div>
  );
}

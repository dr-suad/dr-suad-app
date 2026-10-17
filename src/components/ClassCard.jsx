import { motion } from 'framer-motion';
import styles from './ClassCard.module.css';

export default function ClassCard({ classItem }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={styles.classCard}
      style={{ borderTop: `6px solid ${classItem.color}` }}
    >
      <div className={styles.cardHeader}>
        <span className={styles.emoji} style={{ fontSize: '2rem' }}>
          {classItem.emoji}
        </span>
        <span className={styles.number} style={{ background: classItem.color }}>
          {classItem.id}
        </span>
      </div>
      <h3>{classItem.name}</h3>
      <p>{classItem.description}</p>
    </motion.div>
  );
}
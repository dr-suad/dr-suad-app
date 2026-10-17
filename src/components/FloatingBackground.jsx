import { motion } from 'framer-motion';
import styles from './FloatingBackground.module.css';

const ELEMENTS = [
  // الحيوانات
  '🐰', '🦊', '🐻', '🐸', '🐦', '🦋', '🐢', '🐝',
  // عمليات حسابية
  '2 + 5 = 7', '9 - 4 = 5', '3 × 2 = 6', '10 ÷ 2 = 5',
  // أرقام
  '7', '4', '9', '3', '6', '2', '8', '1', '5', '10',
];

const floatVariants = {
  initial: { y: 0, x: 0, rotate: 0, opacity: 0.2 },
  float: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    rotate: [0, 10, -10, 0, 0],
    opacity: [0.2, 0.25, 0.2],
    transition: {
      duration: (Math.random() * 4 + 4).toFixed(2),
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

export default function FloatingBackground() {
  return (
    <div className={styles.background}>
      {ELEMENTS.map((emoji, i) => (
        <motion.span
          key={i}
          className={styles.element}
          style={{
            '--index': i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${2 + Math.random() * 3}rem`,
          }}
          initial="initial"
          animate="float"
          variants={floatVariants}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

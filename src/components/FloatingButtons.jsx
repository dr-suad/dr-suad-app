import { motion } from 'framer-motion';
import GlowButton from './GlowButton.jsx';
import styles from './FloatingButtons.module.css';

export default function FloatingButtons({ onPlay, onStory, onChallenge }) {
  const buttonVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.1, y: -4 },
    tap: { scale: 0.92, y: 0 },
  };

  return (
    <div className={styles.buttons}>
      <motion.button
        className={`${styles.button} ${styles.buttonPlay}`}
        onClick={onPlay}
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        initial="initial"
        animate="initial"
      >
        <span className={styles.buttonIcon}>🎮</span>
        <span className={styles.buttonText}>ابدأ اللعب</span>
      </motion.button>

      <motion.button
        className={`${styles.button} ${styles.buttonStory}`}
        onClick={onStory}
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        initial="initial"
        animate="initial"
      >
        <span className={styles.buttonIcon}>📖</span>
        <span className={styles.buttonText}>قصة جديدة</span>
      </motion.button>

      <motion.button
        className={`${styles.button} ${styles.buttonChallenge}`}
        onClick={onChallenge}
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        initial="initial"
        animate="initial"
      >
        <span className={styles.buttonIcon}>📅</span>
        <span className={styles.buttonText}>تحدي اليوم</span>
      </motion.button>
    </div>
  );
}

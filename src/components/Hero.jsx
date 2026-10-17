import { motion } from 'framer-motion';
import FloatingShapes from '../components/FloatingShapes.jsx';
import GlowButton from '../components/GlowButton.jsx';
import styles from './Hero.module.css';

export default function Hero({ onExplore }) {
  return (
    <section className={styles.hero}>
      <FloatingShapes />
      <div className={styles.heroContent}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.heroTitle}
        >
          أهلاً بكم في عالم<br />
          <span className={styles.heroHighlight}>الرياضيات الممتع</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.heroText}
        >
          تدرّب، العب، واجمع النجوم مع د. سعاد
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.heroCta}
        >
          <GlowButton variant="mint" onClick={onExplore}>
            استكشف الصفوف
          </GlowButton>
        </motion.div>
      </div>
    </section>
  );
}
import { motion } from 'framer-motion';
import styles from './GlowButton.module.css';

export default function GlowButton({ children, variant = 'primary', onClick, className }) {
  const variants = {
    primary: {
      bg: 'var(--mint)',
      glow: 'var(--glow-mint)',
      text: '#fff',
    },
    coral: {
      bg: 'var(--coral)',
      glow: 'var(--glow-coral)',
      text: '#fff',
    },
    sunshine: {
      bg: 'var(--sunshine)',
      glow: 'var(--glow-sun)',
      text: '#2D2D2D',
    },
    sky: {
      bg: 'var(--sky)',
      glow: 'var(--glow-sky)',
      text: '#fff',
    },
    lavender: {
      bg: 'var(--lavender)',
      glow: 'var(--glow-lav)',
      text: '#fff',
    },
    peach: {
      bg: 'var(--peach)',
      glow: 'var(--glow-sky)',
      text: '#fff',
    },
    mint: {
      bg: 'var(--mint)',
      glow: 'var(--glow-mint)',
      text: '#fff',
    },
  };

  const style = variants[variant] || variants.primary;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${styles.glowBtn} ${styles[variant]} ${className || ''}`}
      onClick={onClick}
      style={{
        background: style.bg,
        color: style.text,
        boxShadow: style.glow,
      }}
    >
      {children}
    </motion.button>
  );
}
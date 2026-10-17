import { motion } from 'framer-motion';

export default function Confetti({ count = 50 }) {
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B983FF', '#FF9F68'];

  return (
    <div className="confetti-container">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
          }}
          animate={{
            y: [0, 600],
            rotate: [0, 720],
            opacity: [1, 0],
          }}
          transition={{
            times: [0, 0.8, 1],
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}
    </div>
  );
}
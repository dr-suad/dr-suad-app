import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="grade-badges">
          <span className="badge" style={{ background: '#FF6B6B' }}>١</span>
          <span className="badge" style={{ background: '#FFD93D' }}>٢</span>
          <span className="badge" style={{ background: '#6BCB77' }}>٣</span>
          <span className="badge" style={{ background: '#4D96FF' }}>٤</span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-title"
        >
          أهلاً بكم في عالم الرياضيات الممتع
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-subtitle"
        >
          تدرّب، العب، واجمع النجوم مع د. سعاد
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hero-cta"
        >
          <a href="#/classes" className="btn-glow primary">
            استكشف الصفوف
          </a>
        </motion.div>
      </div>
      <div className="hero-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </section>
  );
}
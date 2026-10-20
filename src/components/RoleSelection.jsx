import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import GlowButton from './GlowButton.jsx';
import AuthForm from './AuthForm.jsx';
import styles from './RoleSelection.module.css';

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const titleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.4, ease: 'easeOut' },
  },
};

export default function RoleSelection() {
  const { signInAnonymously } = useAuth();
  const [mode, setMode] = useState(null);
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStudentJoin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const { error: err } = await signInAnonymously();
    if (err) {
      setError(err.message);
      setSubmitting(false);
      return;
    }
    localStorage.setItem('pending_class_code', classCode);
    setSubmitting(false);
  };

  const roles = [
    {
      id: 'admin',
      title: 'أنا المشرف/ة',
      desc: 'إدارة كاملة للمدارس والمعلمات والطلاب',
      icon: '👩‍🏫',
      accent: 'var(--coral)',
      glow: 'var(--glow-coral)',
    },
    {
      id: 'teacher',
      title: 'أنا معلم/ة',
      desc: 'متابعة تقدم طلاب صفك',
      icon: '👩‍🏫',
      accent: 'var(--sky)',
      glow: 'var(--glow-sky)',
    },
    {
      id: 'student',
      title: 'أنا طالب/ة',
      desc: 'أدخل كود الصف للعب والتعلم',
      icon: '🧒',
      accent: 'var(--sunshine)',
      glow: 'var(--glow-sun)',
    },
  ];

  return (
    <div className={styles.page} dir="rtl">
      <div className={styles.floatingShapesWrap}>
        {['➕', '➖', '✖️', '➗', '🔢', '🔺', '🔵', '⭐'].map((emoji, i) => (
          <motion.span
            key={i}
            className={styles.bgShape}
            style={{
              left: `${10 + i * 11}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>
      <div className={styles.container}>
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className={styles.hero}
        >
          <motion.span
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className={styles.badge}
          >
            ✨ مرحباً بك
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={styles.title}
          >
            علم وتميز: عنوان التعليم في نابلس
            <br />
            نحو مستقبل أفضل
          </motion.h1>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            className={styles.supervision}
          >
            <p>بإشراف</p>
            <p>الأستاذ جبران قادوس</p>
            <p>ومشرفي المرحلة الأساسية و اللغة الإنجليزية</p>
            <p>ومعلمي المرحلة الأساسية واللغة الانجليزية</p>
            <p>في مديرية نابلس</p>
          </motion.div>
        </motion.div>

        <div className={styles.grid}>
          {roles.map((role, i) => {
            const selected = mode === role.id;
            return (
              <motion.button
                key={role.id}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode(role.id)}
                className={`${styles.roleCard}${selected ? ` ${styles.roleCardSelected}` : ''}`}
                style={{ borderTopColor: role.accent, color: role.accent }}
              >
                <motion.span
                  className={`${styles.roleIcon} ${styles.pulseIcon}`}
                  animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: 'easeInOut',
                  }}
                >
                  {role.icon}
                </motion.span>
                <span className={styles.roleTitle}>{role.title}</span>
                <span className={styles.roleDesc}>{role.desc}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {(mode === 'admin' || mode === 'teacher') && (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35 }}
              className={styles.panel}
            >
              <AuthForm role={mode} />
            </motion.div>
          )}
          {mode === 'student' && (
            <motion.div
              key="student"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35 }}
              className={styles.panel}
            >
              <div className={styles.studentCard}>
                <h2 className={styles.studentTitle}>انضم إلى صفك 🧒</h2>
                <p className={styles.studentSub}>اطلب كود الصف من معلمتك</p>
                <form onSubmit={handleStudentJoin} className={styles.form}>
                  <div className={styles.field}>
                    <label>كود الصف</label>
                    <input
                      type="text"
                      value={classCode}
                      onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                      required
                      maxLength={10}
                      className={styles.input}
                      placeholder="GAZA-4A"
                    />
                  </div>
                  <GlowButton
                    variant="sunshine"
                    type="submit"
                    disabled={submitting || !classCode}
                    className={styles.fullBtn}
                  >
                    {submitting ? 'جاري الانضمام...' : 'انضم إلى صفك ✨'}
                  </GlowButton>
                  {error && <p className={styles.error}>{error}</p>}
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {mode && (
          <div className={styles.backRow}>
            <button type="button" onClick={() => setMode(null)} className={styles.backBtn}>
              تراجع عن الاختيار
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

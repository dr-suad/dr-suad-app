import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './StudentHome.module.css';

/**
 * شاشة انضمام الطالب:
 *  - "لدي كود صف"  -> ربط الحساب بالصف عبر الكود
 *  - "دخول كزائر" -> تجربة سريعة بدون كود صف
 */
export default function StudentHome() {
  const { profile, joinClass, signInAnonymously, signOut, isGuest } = useAuth();
  const [mode, setMode] = useState(null); // 'code' | 'guest'
  const [classCodeInput, setClassCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // إن وصلنا بتTMP كود معلّق من شاشة اختيار الدور، نفتح نموذج الكود مباشرة
  useEffect(() => {
    const pending = localStorage.getItem('pending_class_code');
    if (pending) {
      setClassCodeInput(pending.toUpperCase());
      setMode('code');
      localStorage.removeItem('pending_class_code');
    }
  }, []);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    const code = classCodeInput.trim().toUpperCase();
    if (!code) {
      setError('يرجى إدخال كود الصف');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error: err } = await joinClass(code);
      if (err) throw err;
      setMode(null);
    } catch (err) {
      setError(err?.message || 'تعذر الانضمام للصف');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: err } = await signInAnonymously();
      if (err) throw err;
    } catch (err) {
      setError(err?.message || 'تعذر الدخول كزائر');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className={styles.page} dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={styles.card}
      >
        <span className={styles.avatar}>🧒</span>
        <h1 className={styles.title}>مرحباً يا بطل!</h1>
        <p className={styles.subtitle}>
          اختر كيف تريد أن تبدأ اليوم
          {isGuest ? ' — أنت حالياً في وضع الزائر' : ''}
        </p>

        {error && <p className={styles.error}>{error}</p>}

        {mode !== 'code' && (
          <div className={styles.options}>
            <button
              type="button"
              className={`${styles.optionBtn} ${mode === 'guest' ? styles.optionBtnActive : ''}`}
              onClick={() => { setMode('code'); setError(''); }}
              disabled={loading}
            >
              <span className={styles.optionIcon}>🔑</span>
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>لدي كود صف</span>
                <span className={styles.optionDesc}>أدخل الكود الذي أعطته لك معلمتك للانضمام إلى صفك</span>
              </span>
            </button>

            <button
              type="button"
              className={`${styles.optionBtn} ${mode === 'guest' ? styles.optionBtnActive : ''}`}
              onClick={handleGuest}
              disabled={loading}
            >
              <span className={styles.optionIcon}>🧒</span>
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>دخول كزائر (تجربة سريعة)</span>
                <span className={styles.optionDesc}>العب وتعلم الآن بدون كود — نتائجك لن تظهر للمعلمة</span>
              </span>
            </button>
          </div>
        )}

        {mode === 'code' && (
          <form onSubmit={handleJoinClass} className={styles.form}>
            <label className={styles.label} htmlFor="class-code">كود الصف</label>
            <input
              id="class-code"
              className={styles.input}
              type="text"
              value={classCodeInput}
              onChange={(e) => setClassCodeInput(e.target.value.toUpperCase())}
              placeholder="GAZA-4A"
              maxLength={10}
              autoComplete="off"
              autoFocus
            />
            <button type="submit" className={styles.primaryBtn} disabled={loading || !classCodeInput.trim()}>
              {loading ? 'جاري الانضمام...' : 'انضم إلى صفك ✨'}
            </button>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={() => { setMode(null); setError(''); }}
              disabled={loading}
            >
              ← رجوع
            </button>
            <p className={styles.hint}>اطلب كود الصف من معلمتك إن لم يكن لديك.</p>
          </form>
        )}

        <p className={styles.footerNote}>
          {profile?.class_id
            ? `أنت مرتبط بالصف: ${profile.class_id}`
            : 'يمكنك دائماً تجربة التطبيق كزائر والعودة لاحقاً.'}
        </p>
      </motion.div>
    </div>
  );
}

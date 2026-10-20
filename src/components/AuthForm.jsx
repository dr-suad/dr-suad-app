import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import GlowButton from './GlowButton.jsx';
import styles from './AuthForm.module.css';

const LOGIN_ERRORS = {
  'Invalid login credentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة — تحققي من البيانات وحاولي مجدداً',
  'Email not confirmed': 'لم يتم تأكيد البريد — افحصي بريدك واضغطي رابط التفعيل، أو أنشئي حساباً جديداً',
  'User not found': 'لا يوجد حساب بهذا البريد — سجّلي حساباً جديداً أولاً',
  'email rate limit exceeded': 'محاولات كثيرة — انتظري دقيقة ثم حاولي مجدداً',
  'For security purposes, you can only request this once': 'لأسباب أمنية — انتظري قليلاً قبل المحاولة مجدداً',
};

const SIGNUP_ERRORS = {
  'User already registered': 'هذا البريد مسجل بالفعل — سجّلي الدخول بدل إنشاء حساب جديد',
  'Email already registered': 'هذا البريد مسجل بالفعل — سجّلي الدخول بدل إنشاء حساب جديد',
  'Password should be at least 6 characters': 'كلمة المرور قصيرة — استخدمي 6 أحرف على الأقل',
  'Password should contain at least one character': 'كلمة المرور ضعيفة — أضيفي حروفاً وأرقاماً',
  'Unable to validate email address: invalid format': 'صيغة البريد الإلكتروني غير صحيحة — تحققي منه (مثال: name@school.com)',
  'Email address is invalid': 'صيغة البريد الإلكتروني غير صحيحة — تحققي منه (مثال: name@school.com)',
  'email rate limit exceeded': 'تم تجاوز حد إنشاء الحسابات مؤقتاً — انتظري ساعة ثم حاولي، أو اطلبي من الدكتورة كود دعوة',
  'Signups not allowed': 'إنشاء الحسابات متوقف حالياً — تواصلي مع الدكتورة',
  'Kod alssaf ghayr sahih': 'كود الصف غير صحيح',
};

export function getErrorMessage(err, mode = 'login') {
  const msg = err?.message || err || '';
  const dict = mode === 'signup' ? SIGNUP_ERRORS : LOGIN_ERRORS;
  for (const [en, ar] of Object.entries(dict)) {
    if (msg.includes(en)) return { text: ar, rateLimited: /rate limit/i.test(en) };
  }
  // رسائل عامة حسب الوضع — لا نخلط رسائل الدخول مع الإنشاء أبداً
  if (mode === 'signup') {
    if (/rate limit/i.test(msg)) {
      return { text: SIGNUP_ERRORS['email rate limit exceeded'], rateLimited: true };
    }
    if (/invalid.*email|email.*invalid/i.test(msg)) return { text: 'صيغة البريد الإلكتروني غير صحيحة — تحققي منه (مثال: name@school.com)' };
    if (/password|weak/i.test(msg)) return { text: 'كلمة المرور غير مقبولة — استخدمي 6 أحرف على الأقل مع حروف وأرقام' };
    if (/already|exists|duplicate/i.test(msg)) return { text: 'هذا البريد مسجل بالفعل — سجّلي الدخول بدل إنشاء حساب جديد' };
    return { text: msg || 'فشل إنشاء الحساب — تحققي من البيانات وحاولي مجدداً' };
  }
  if (/invalid.*email|email.*invalid/i.test(msg)) return { text: 'صيغة البريد الإلكتروني غير صحيحة' };
  return { text: msg || 'حدث خطأ غير متوقع' };
}

// رابط لوحة تحكم Supabase — يُبنى من متغير البيئة تلقائياً
export function getSupabaseDashboardUrl() {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const m = url.match(/https:\/\/([a-z0-9-]+)\.supabase\.co/);
  const ref = m ? m[1] : '';
  return ref
    ? `https://supabase.com/dashboard/project/${ref}/auth/users`
    : 'https://supabase.com/dashboard';
}

export default function AuthForm({ role }) {
  const { signIn, signUp, signInAnonymously } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [errorInfo, setErrorInfo] = useState(null);
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showGuestLogin, setShowGuestLogin] = useState(false);

  const switchMode = (toLogin) => {
    setIsLogin(toLogin);
    setError('');
    setErrorInfo(null);
    setInfo('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setErrorInfo(null);
    setInfo('');

    try {
      if (isLogin) {
        const { error: err } = await signIn(email.trim(), password, role);
        if (err) {
          // عرض زر الدخول كزائر إذا كان الخطأ متعلقاً بتأكيد البريد أو RLS
          if (err.message?.includes('Email not confirmed') || err.message?.includes('RLS') || err.message?.includes('profiles')) {
            setShowGuestLogin(true);
            setInfo('يمكنك تجربة التطبيق كزائر دون تسجيل الدخول — سيُطلب منك كود الصف لاحقاً.');
          }
          throw err;
        }
      } else {
        // وضع الإنشاء يستدعي signUp حصراً — لا signIn هنا أبداً
        const { data, error: err } = await signUp(email, password, name, role);
        if (err) throw err;
        // إذا كان تأكيد البريد مفعّلاً ولا توجد جلسة، وجّهي المعلمة للخطوة التالية
        if (data && !data.session) {
          setInfo('تم إنشاء حسابك! افحصي بريدك لتأكيده، ثم سجّلي الدخول وأدخلي كود الدعوة في لوحتك.');
        }
      }
    } catch (err) {
      const parsed = getErrorMessage(err, isLogin ? 'login' : 'signup');
      const text = typeof parsed === 'string' ? parsed : parsed.text;
      const limited = typeof parsed === 'object' && parsed.rateLimited;
      setError(text);
      setErrorInfo(limited ? { rateLimited: true } : null);
    } finally {
      setSubmitting(false);
    }
  };

  const roleLabels = { admin: 'دكتورة', teacher: 'معلمة' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.wrap}
    >
      <div className={styles.card}>
        <div className={styles.head}>
          <h2>
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <p>
            {isLogin ? 'مرحباً بعودتك' : 'انضم إلينا ك' + roleLabels[role]}
          </p>
        </div>

        {error && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            <p>{error}</p>
            {errorInfo?.rateLimited && (
              <div className={styles.rateBox}>
                <p className={styles.rateHint}>
                  الحل السريع: اطلبي من الدكتورة كود دعوة (تبويب "إرسال دعوة" في لوحة الإشراف) — لا يحتاج بريداً ولا حد له.
                </p>
                <a
                  href={getSupabaseDashboardUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.manualLink}
                >
                  🔧 الدكتورة: إنشاء الحساب يدوياً من Supabase
                </a>
              </div>
            )}
          </div>
        )}

        {info && (
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="example@school.com"
            />
          </div>

          {!isLogin && (
            <div className={styles.field}>
              <label>اسمك الكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.input}
                placeholder="أحمد محمد"
              />
            </div>
          )}

          <div className={styles.field}>
            <label>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <GlowButton
            variant={role === 'admin' ? 'primary' : 'coral'}
            type="submit"
            disabled={submitting}
            className={styles.fullBtn}
          >
            {submitting ? 'جاري المعالجة...' : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </GlowButton>

          {showGuestLogin && (
            <div className={styles.guestBox}>
              <p className={styles.guestHint}>⚠️ لا يمكنك تسجيل الدخول الآن؟</p>
              <GlowButton
                variant="sky"
                onClick={async () => {
                  const { error: guestErr } = await signInAnonymously();
                  if (guestErr) {
                    setError('فشل الدخول كزائر: ' + guestErr.message);
                    return;
                  }
                  setProfile({ id: 'guest', name: 'زائر', role: 'student', email: '' });
                }}
                disabled={submitting}
                className={styles.fullBtn}
              >
                🧒 دخول كزائر (تجربة سريعة)
              </GlowButton>
            </div>
          )}
        </form>

        <div className={styles.foot}>
          <button
            type="button"
            onClick={() => switchMode(!isLogin)}
            className={styles.switchBtn}
          >
            {isLogin ? 'ليس لديك حساب؟ سجّل الآن' : 'لديك حساب بالفعل؟ سجّل دخول'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
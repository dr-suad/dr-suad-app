import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import { generateSchoolCode, generateInviteCode, generateClassCode, createClassWithCode, extractClassCode } from '../lib/adminUtils.js';

const getSupabaseUsersUrl = () => {
  const supaUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const mm = supaUrl.match(/https:\/\/([a-z0-9-]+)\.supabase\.co/);
  return mm ? 'https://supabase.com/dashboard/project/' + mm[1] + '/auth/users' : 'https://supabase.com/dashboard';
};
import GlowButton from './GlowButton.jsx';
import StatCard from './StatCard.jsx';
import FloatingShapes from './FloatingShapes.jsx';
import Confetti from './Confetti.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { user, signOut, profile } = useAuth();
  const [stats, setStats] = useState({ schools: 0, teachers: 0, students: 0 });
  const [schools, setSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '', school_id: '' });
  const [invites, setInvites] = useState([]);
  const [teacherTab, setTeacherTab] = useState('invite');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confetti, setConfetti] = useState(false);

  // إضافة طالب — مودال (الدكتورة)
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [classesForSchool, setClassesForSchool] = useState([]);
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [studentMsg, setStudentMsg] = useState('');
  const [studentClassCode, setStudentClassCode] = useState('');

  const celebrate = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  };

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [schoolsRes, teachersRes, studentsRes, invitesRes] = await Promise.all([
        supabase.from('schools').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('role', 'teacher'),
        supabase.from('profiles').select('*').eq('role', 'student'),
        supabase.from('teacher_invites').select('*').order('created_at', { ascending: false }),
      ]);
      // جدول الدعوات اختياري — قد لا يكون موجوداً بعد تشغيل SQL
      if (!invitesRes.error) setInvites(invitesRes.data || []);
      // عرض أي خطأ من أي استعلام بوضوح بدل الشاشة الفارغة
      const firstErr = schoolsRes.error || teachersRes.error || studentsRes.error;
      if (firstErr) {
        throw new Error(
          `فشل تحميل البيانات: ${firstErr.message} — تحققي من سياسات RLS على جداول schools و profiles في Supabase`
        );
      }
      setSchools(schoolsRes.data || []);
      setTeachers(teachersRes.data || []);
      setStats({
        schools: schoolsRes.data?.length || 0,
        teachers: teachersRes.data?.length || 0,
        students: studentsRes.data?.length || 0,
      });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // 1) إضافة مدرسة — الكود يُولّد تلقائياً في الخلفية
  const handleAddSchool = async (e) => {
    e.preventDefault();
    const name = newSchoolName.trim();
    if (!name) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const code = generateSchoolCode(name);
      const { error: insErr } = await supabase.from('schools').insert([{ name, code }]);
      if (insErr) throw insErr;
      setShowAddSchool(false);
      setNewSchoolName('');
      celebrate();
      setSuccess(`تم إنشاء المدرسة "${name}"! كودها: ${code} — شاركيه مع المعلمات والطلاب.`);
      await loadData();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  // 3-أ) إرسال دعوة معلمة — لا ينشئ حساباً ولا بريداً (يتجنب rate limit تماماً)
  // المعلمة تنشئ حسابها بنفسها ثم تدخل كود الدعوة لربط نفسها بالمدرسة
  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!newTeacher.email || !newTeacher.name) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const code = generateInviteCode();
      const { error: insErr } = await supabase.from('teacher_invites').insert([{
        email: newTeacher.email.trim().toLowerCase(),
        name: newTeacher.name.trim(),
        school_id: newTeacher.school_id || null,
        code,
      }]);
      if (insErr) throw insErr;
      const schoolName = schools.find((s) => s.id === newTeacher.school_id)?.name || '';
      setShowAddTeacher(false);
      setTeacherTab('invite');
      setNewTeacher({ name: '', email: '', password: '', school_id: '' });
      setSuccess(`تم إرسال الدعوة! كود الدعوة: ${code} — أرسليه للمعلمة مع ${schoolName ? `مدرسة "${schoolName}" و` : ''} هذه التعليمات: أنشئي حسابك من صفحة الدخول ثم أدخلي الكود في لوحتك.`);
      celebrate();
      await loadData();
    } catch (err) {
      if (err.message?.includes('teacher_invites') || err.code === '42P01') {
        setError('جدول الدعوات غير موجود — نفّذي ملف supabase_teacher_invites.sql في SQL Editor أولاً.');
      } else {
        setError(err.message);
      }
    }
    finally { setSaving(false); }
  };

  // 3-ب) إنشاء مباشر (احتياطي) — برسالة rate limit واضحة بالعربية
  // 3) إضافة معلمة — عبر signUp العادي (وليس admin.createUser الذي يحتاج service key)
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacher.email || !newTeacher.password || !newTeacher.name) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { data, error: signErr } = await supabase.auth.signUp({
        email: newTeacher.email,
        password: newTeacher.password,
        options: { data: { name: newTeacher.name, role: 'teacher' } },
      });
      if (signErr) {
        if (signErr.message?.includes('rate limit') || signErr.message?.includes('email rate')) {
          throw new Error('RATE-LIMIT-DIRECT');
        }
        throw signErr;
      }
      if (data.user) {
        const { error: profErr } = await supabase.from('profiles').upsert({
          id: data.user.id,
          name: newTeacher.name,
          email: newTeacher.email,
          role: 'teacher',
          school_id: newTeacher.school_id || null,
        }, { onConflict: 'id' });
        if (profErr) throw profErr;
      }
      setShowAddTeacher(false);
      setNewTeacher({ name: '', email: '', password: '', school_id: '' });
      celebrate();
      setSuccess(`تم إنشاء حساب المعلمة (${newTeacher.email})! يمكنها الآن تسجيل الدخول.`);
      await loadData();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  // جلب صفوف المدرسة المختارة لعرضها في قائمة الاختيار
  const handleSchoolChange = async (schoolId) => {
    setSelectedSchoolId(schoolId);
    setSelectedClassId('');
    if (!schoolId) {
      setClassesForSchool([]);
      return;
    }
    try {
      const { data: classesRes, error: classesErr } = await supabase
        .from('classes')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });
      if (classesErr) throw classesErr;
      setClassesForSchool(classesRes.data || []);
    } catch (err) {
      setClassesForSchool([]);
    }
  };

  // إضافة طالب جديد (الدكتورة — لأي مدرسة/صف)
  const handleAddStudent = async (e) => {
    e?.preventDefault?.();
    const name = newStudentName.trim();
    if (!name || !user) return;
    setCreatingStudent(true);
    setStudentMsg('');
    try {
      let classId = selectedClassId;
      let classCode = studentClassCode;

      // إذا لم يتم اختيار صف موجود، أنشئ صفًا جديدًا للمدرسة المختارة
      if (!classId) {
        if (!selectedSchoolId) throw new Error('يرجى اختيار المدرسة أولاً');
        const className = `صف جديد`;
        classCode = generateClassCode(className);
        const { classData: newClass, error: classErr } = await createClassWithCode({
          name: className,
          schoolId: selectedSchoolId,
          code: classCode,
        });
        if (classErr) throw classErr;
        classId = newClass.id;
        setSelectedClassId(classId);
      } else {
        const { data: existingClass } = await supabase
          .from('classes')
          .select('*')
          .eq('id', classId)
          .maybeSingle();
        classCode = extractClassCode(existingClass) || generateClassCode(classId);
        setStudentClassCode(classCode);
      }

      // إنشاء حساب الطالب بشكل مجهول (بدون بريد وبدون rate limit)
      const { data: authData, error: signErr } = await supabase.auth.signInAnonymously();
      if (signErr) throw signErr;
      if (!authData.user) throw new Error('فشل إنشاء حساب الطالب');

      // إنشاء profile للطالب
      const schoolRes = await supabase.from('schools').select('id').eq('id', selectedSchoolId || null).maybeSingle();
      const { error: profErr } = await supabase.from('profiles').insert([{
        id: authData.user.id,
        name,
        full_name: name,
        role: 'student',
        class_id: classId,
        school_id: selectedSchoolId || null,
      }]);
      if (profErr) throw profErr;

      // تسجيل الخروج من الحساب المجهول حتى لا تظل الدكتورة مسجلة دخول كطالب مجهول
      await supabase.auth.signOut();

      setNewStudentName('');
      setSelectedSchoolId('');
      setSelectedClassId('');
      setClassesForSchool([]);
      setShowAddStudent(false);
      setStudentMsg(`تم إضافة الطالب "${name} بنجاح! كود الصف: ${classCode}\nالرجاء تسجيل الدخول مرة أخرى لمتابعة العمل.`);
    } catch (err) {
      setStudentMsg(err.message || 'فشل إضافة الطالب — حاولي مجدداً.');
    } finally {
      setCreatingStudent(false);
    }
  };

  const handleLogout = async () => { await signOut(); };
  if (loading) {
    return (
      <div className={styles.page} dir="rtl">
        <FloatingShapes />
        <div className={styles.loadingWrap}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className={styles.spinner}
          >
            star
          </motion.div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error && schools.length === 0 && teachers.length === 0) {
    return (
      <div className={styles.page} dir="rtl">
        <FloatingShapes />
        <div className={styles.centerWrap}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.errorCard}
          >
            <div className={styles.errorIcon}>⚠️</div>
            <h2>خطأ في تحميل البيانات</h2>
            <p>{error}</p>
            <GlowButton variant="coral" onClick={loadData}>
              محاولة مرة أخرى
            </GlowButton>
          </motion.div>
        </div>
      </div>
    );
  }

  const statItems = [
    { icon: '🏫', value: stats.schools, label: 'المدارس', desc: 'مدرسة مسجلة في المنصة', color: 'var(--sky)', delay: 0 },
    { icon: '👩‍🏫', value: stats.teachers, label: 'المعلمات', desc: 'معلمة تتابع الطلاب', color: 'var(--coral)', delay: 0.1 },
    { icon: '🧒', value: stats.students, label: 'الطلاب', desc: 'طفل يتعلم ويلعب', color: 'var(--mint)', delay: 0.2 },
  ];

  const schoolNameById = (id) => schools.find((s) => s.id === id)?.name || '-';

  const rowAnim = {
    initial: { opacity: 0, x: 30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-20px' },
  };

  return (
    <div className={styles.page} dir="rtl">
      <FloatingShapes />
      <Confetti active={confetti} />

      <div className={styles.container}>
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.header}
        >
          <div className={styles.headerText}>
            <motion.span
              className={styles.headerIcon}
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              👩‍🏫
            </motion.span>
            <div>
              <h1 className={styles.title}>لوحة الإشراف</h1>
              <p className={styles.subtitle}>مرحباً، {profile?.name || profile?.email || 'المدير'} ✨</p>
            </div>
          </div>
          <GlowButton variant="coral" onClick={handleLogout}>
            تسجيل الخروج
          </GlowButton>
        </motion.header>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              className={`${styles.alert} ${styles.alertSuccess}`}
            >
              <span className={styles.alertIcon}>🎉</span>
              <span>{success}</span>
            </motion.div>
          )}
          {error && error !== 'RATE-LIMIT-DIRECT' && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              className={`${styles.alert} ${styles.alertError}`}
            >
              <span className={styles.alertIcon}>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}
          {error === 'RATE-LIMIT-DIRECT' && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              className={`${styles.alert} ${styles.alertError}`}
            >
              <span className={styles.alertIcon}>⚠️</span>
              <span>
                تم تجاوز حد ارسال البريد من Supabase (حد مؤقت). الحلول: (1) تبويب ارسال دعوة (بدون حد)، او (2) انشاء الحساب يدويا من الرابط التالي:
                <br />
                <a href={getSupabaseUsersUrl()} target="_blank" rel="noreferrer" className={styles.mono}>
                  🔧 فتح لوحة Supabase — انشاء الحساب يدويا (Auth Users Add user)
                </a>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.statsGrid}>
          {statItems.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={styles.actions}
        >
          <GlowButton
            variant="mint"
            onClick={() => { setError(''); setSuccess(''); setShowAddSchool(true); }}
          >
            ➕ إضافة مدرسة
          </GlowButton>
          <GlowButton
            variant="sunshine"
            onClick={() => { setError(''); setSuccess(''); setShowAddTeacher(true); }}
          >
            👩‍🏫 إضافة معلمة
          </GlowButton>
          <GlowButton
            variant="sky"
            onClick={() => { setError(''); setSuccess(''); setShowAddStudent(true); setSelectedSchoolId(''); setSelectedClassId(''); setClassesForSchool([]); setStudentMsg(''); setNewStudentName(''); }}
          >
            🧒 إضافة طالب
          </GlowButton>
        </motion.div>
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className={styles.card}
        >
          <h2 className={styles.cardTitle}>
            <span>🏫</span> المدارس المسجلة
            <span className={styles.count}>{schools.length}</span>
          </h2>
          {schools.length === 0 ? (
            <p className={styles.empty}>لا توجد مدارس بعد — اضغطي "إضافة مدرسة" للبدء 🏫</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>اسم المدرسة</th>
                    <th>الكود</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((s, i) => (
                    <motion.tr key={s.id} {...rowAnim} transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }} className={styles.row}>
                      <td className={styles.schoolName}>🏫 {s.name}</td>
                      <td><span className={styles.mono}>{s.code}</span></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className={styles.card}
        >
          <h2 className={styles.cardTitle}>
            <span>👩‍🏫</span> المعلمات
            <span className={styles.count}>{teachers.length}</span>
          </h2>
          {teachers.length === 0 ? (
            <p className={styles.empty}>لا توجد معلمات بعد 👩‍🏫</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>اسم المعلمة</th>
                    <th>البريد</th>
                    <th>المدرسة</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, i) => (
                    <motion.tr key={t.id} {...rowAnim} transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }} className={styles.row}>
                      <td className={styles.teacherName}>{t.name || '-'}</td>
                      <td className={styles.email}>{t.email}</td>
                      <td>{schoolNameById(t.school_id)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
        <AnimatePresence>
                  <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className={styles.card}
        >
          <h2 className={styles.cardTitle}>
            <span>\u2709\uFE0F</span> \u0627\u0644\u062F\u0639\u0648\u0627\u062A \u0627\u0644\u0645\u0631\u0633\u0644\u0629
            <span className={styles.count}>{invites.length}</span>
          </h2>
          {invites.length === 0 ? (
            <p className={styles.empty}>\u0644\u0627 \u062A\u0648\u062C\u062F \u062F\u0639\u0648\u0627\u062A \u0628\u0639\u062F \u2014 \u0627\u0636\u063A\u0637\u064A "\u0625\u0636\u0627\u0641\u0629 \u0645\u0639\u0644\u0645\u0629" \u0648\u0627\u062E\u062A\u0631 \u062A\u0628\u0648\u064A\u0628 \u0627\u0644\u062F\u0639\u0648\u0629.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0644\u0645\u0629</th>
                    <th>\u0627\u0644\u0628\u0631\u064A\u062F</th>
                    <th>\u0643\u0648\u062F \u0627\u0644\u062F\u0639\u0648\u0629 (\u0627\u0646\u0642\u0631 \u0644\u0644\u0646\u0633\u062E)</th>
                    <th>\u0627\u0644\u062D\u0627\u0644\u0629</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((inv) => (
                    <motion.tr key={inv.id} {...rowAnim} className={styles.row}>
                      <td className={styles.teacherName}>{inv.name || '-'}</td>
                      <td className={styles.email}>{inv.email}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.copyBtn}
                          title="انقر للنسخ"
                          onClick={() => {
                            navigator.clipboard?.writeText(inv.code);
                            setSuccess(`تم نسخ الكود: ${inv.code}`);
                          }}
                        >
                          {inv.code} \uD83D\uDCCB
                        </button>
                      </td>
                      <td>
                        {inv.used ? (
                          <span className={`${styles.badge} ${styles.badgeUsed}`}>\u2705 \u0645\u0633\u062A\u062E\u062F\u0645</span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgePending}`}>\u23F3 \u0628\u0627\u0646\u062A\u0638\u0627\u0631</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

          {showAddSchool && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={styles.overlay}
              onClick={() => !saving && setShowAddSchool(false)}
            >
              <motion.div
                initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalIcon}>🏫</div>
                <h3 className={styles.modalTitle}>إضافة مدرسة جديدة</h3>
                <form onSubmit={handleAddSchool} className={styles.form}>
                  <div className={styles.field}>
                    <label>المدارس-NAME</label>
                    <input
                      type="text"
                      value={newSchoolName}
                      onChange={(e) => setNewSchoolName(e.target.value)}
                      required
                      placeholder="مثال: مدرسة الأمل"
                      className={styles.input}
                    />
                    <p className={styles.hint}>سيُنشأ كود المدرسة تلقائياً (مثال: AML-X7K9) وسيظهر بعد الحفظ ✨</p>
                  </div>
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      onClick={() => setShowAddSchool(false)}
                      disabled={saving}
                      className={styles.cancelBtn}
                    >
                      إلغاء
                    </button>
                    <GlowButton type="submit" variant="mint" disabled={saving}>
                      {saving ? 'جاري الحفظ...' : '✨ إضافة المدرسة'}
                    </GlowButton>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddTeacher && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={styles.overlay}
              onClick={() => !saving && setShowAddTeacher(false)}
            >
              <motion.div
                initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalIcon}>👩‍🏫</div>
                <h3 className={styles.modalTitle}>إضافة معلمة جديدة</h3>
                <div className={styles.tabs}>
                  <button
                    type="button"
                    onClick={() => setTeacherTab('invite')}
                    className={teacherTab === 'invite' ? styles.tabActive : styles.tab}
                  >
                    ✉️ إرسال دعوة (بدون حد)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeacherTab('direct')}
                    className={teacherTab === 'direct' ? styles.tabActive : styles.tab}
                  >
                    إنشاء مباشر
                  </button>
                </div>
                {teacherTab === 'invite' ? (
                  <form onSubmit={handleSendInvite} className={styles.form}>
                    <div className={styles.field}>
                      <label>اسم المعلمة</label>
                      <input
                        type="text"
                        value={newTeacher.name}
                        onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                        required
                        placeholder="مثال: سعاد"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={newTeacher.email}
                        onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                        required
                        placeholder="teacher@school.com"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>المدرسة</label>
                      <select
                        value={newTeacher.school_id}
                        onChange={(e) => setNewTeacher({ ...newTeacher, school_id: e.target.value })}
                        className={styles.input}
                      >
                        <option value="">اختر المدرسة (اختياري)</option>
                        {schools.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                      </select>
                    </div>
                    <p className={styles.hint}>لا يتم إرسال أي بريد — المعلمة تنشئ حسابها بنفسها ثم تدخل الكود في لوحتها للارتباط بالمدرسة. بدون حد للإرسال ✨</p>
                    <div className={styles.formActions}>
                      <button
                        type="button"
                        onClick={() => setShowAddTeacher(false)}
                        disabled={saving}
                        className={styles.cancelBtn}
                      >
                        إلغاء
                      </button>
                      <GlowButton type="submit" variant="mint" disabled={saving}>
                        {saving ? 'جاري الإرسال...' : '✉️ إرسال الدعوة'}
                      </GlowButton>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleAddTeacher} className={styles.form}>
                  <div className={styles.field}>
                    <label>اسم المعلمة</label>
                    <input
                      type="text"
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                      required
                      placeholder="مثال: سعاد"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                      required
                      placeholder="teacher@school.com"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>كلمة المرور</label>
                    <input
                      type="password"
                      value={newTeacher.password}
                      onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                      required
                      minLength={6}
                      placeholder="6 أحرف على الأقل"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>المدرسة</label>
                    <select
                      value={newTeacher.school_id}
                      onChange={(e) => setNewTeacher({ ...newTeacher, school_id: e.target.value })}
                      className={styles.input}
                    >
                      <option value="">اختر المدرسة (اختياري)</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      onClick={() => setShowAddTeacher(false)}
                      disabled={saving}
                      className={styles.cancelBtn}
                    >
                      إلغاء
                    </button>
                    <GlowButton type="submit" variant="sunshine" disabled={saving}>
                      {saving ? 'جاري الإنشاء...' : '✨ إنشاء الحساب'}
                    </GlowButton>
                  </div>
                </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* مودال إضافة طالب (الدكتورة) */}
        {showAddStudent && (
          <div className={styles.overlay} onClick={() => setShowAddStudent(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalIcon}>🧒</div>
              <h3 className={styles.modalTitle}>إضافة طالب جديد</h3>
              <form onSubmit={handleAddStudent} className={styles.form}>
                <div className={styles.field}>
                  <label>اسم الطالب</label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    required
                    placeholder="مثال: أحمد محمد"
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label>المدرسة</label>
                  <select
                    value={selectedSchoolId}
                    onChange={(e) => handleSchoolChange(e.target.value)}
                    className={styles.input}
                  >
                    <option value="">اختر المدرسة</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>الصف (اختياري — إذا لم يُختار يُنشأ صف جديد)</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className={styles.input}
                  >
                    <option value="">اختر صفاً من المدرسة</option>
                    {classesForSchool.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} {c.class_code ? `— ${c.class_code}` : ''}</option>
                    ))}
                    <option value="new">إنشاء صف جديد لهذه المدرسة</option>
                  </select>
                </div>
                {studentClassCode && (
                  <div className={styles.field}>
                    <label>كود الصف (يُشارك مع الطالب للدخول)</label>
                    <input
                      type="text"
                      value={studentClassCode}
                      readOnly
                      className={styles.input}
                    />
                  </div>
                )}
                {studentMsg && (
                  <div className={`${styles.alert} ${styles.alertSuccess}`}>
                    <span className={styles.alertIcon}>✅</span>
                    <span>{studentMsg}</span>
                  </div>
                )}
                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => setShowAddStudent(false)}
                    disabled={creatingStudent}
                    className={styles.cancelBtn}
                  >
                    إلغاء
                  </button>
                  <GlowButton type="submit" variant="sky" disabled={creatingStudent}>
                    {creatingStudent ? 'جاري الإضافة...' : '✨ إضافة الطالب'}
                  </GlowButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

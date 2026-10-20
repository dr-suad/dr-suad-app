import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import GlowButton from './GlowButton.jsx';
import { generateClassCode, createClassWithCode, extractClassCode } from '../lib/adminUtils.js';
import styles from './TeacherDashboard.module.css';

export default function TeacherDashboard({ showLinkForm = null } = {}) {
  const { user, signOut, profile, refreshProfile } = useAuth();
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState('');
  const [showLink, setShowLink] = useState(showLinkForm !== null ? showLinkForm : !profile?.school_id);

  // إضافة طالب — مودال
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [studentMsg, setStudentMsg] = useState('');
  const [studentClassCode, setStudentClassCode] = useState('');
  const [studentClassId, setStudentClassId] = useState('');

  console.log('School ID:', profile?.school_id);

  useEffect(() => {
    loadData();
    if (showLinkForm !== null) {
      setShowLink(showLinkForm);
    } else {
      setShowLink(!profile?.school_id);
    }
  }, [profile, showLinkForm]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const classId = profile?.class_id;
      if (!classId) {
        setLoading(false);
        return;
      }
      const [studentsRes, progressRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'student').eq('class_id', classId),
        supabase.from('student_progress').select('*'),
      ]);
      if (studentsRes.error) throw studentsRes.error;
      if (progressRes.error) throw progressRes.error;
      setStudents(studentsRes.data || []);
      setProgress(progressRes.data || []);
    } catch (err) { setError(err.message || 'فشل تحميل بيانات الطلاب'); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await signOut(); };

  const handleLinkInvite = async (e) => {
    e?.preventDefault?.();
    const code = inviteCode.trim().toUpperCase();
    if (!code || !user) return;
    setLinking(true);
    setLinkMsg('');
    try {
      const { data: invite, error: invErr } = await supabase
        .from('teacher_invites')
        .select('*')
        .eq('code', code)
        .maybeSingle();
      if (invErr) throw invErr;
      if (!invite) {
        setLinkMsg('كود الدعوة غير صحيح — تحققي من الكود وحاولي مجدداً.');
        return;
      }
      if (invite.used && invite.used_by && invite.used_by !== user.id) {
        setLinkMsg('هذا الكود مستخدم بالفعل من حساب آخر.');
        return;
      }
      const schoolId = invite.school_id;

      console.log('Updating profile with school_id:', schoolId, 'for user.id:', user.id);
      const { data: profData, error: profErr } = await supabase
        .from('profiles')
        .update({ role: 'teacher', school_id: schoolId })
        .eq('id', user.id)
        .select()
        .maybeSingle();
      console.log('Update profile result:', profData, profErr);
      if (profErr) throw profErr;

      console.log('Marking invite as used:', code);
      const { data: invData, error: markErr } = await supabase
        .from('teacher_invites')
        .update({ used: true })
        .eq('code', code)
        .select()
        .maybeSingle();
      console.log('Update invite result:', invData, markErr);
      if (markErr) throw markErr;

      setLinkMsg('تم ربط حسابك بالمدرسة بنجاح! 🎉 جاري التوجيه للوحة التحكم…');

      // إعادة تحميل الصفحة بالكامل لضمان رؤية App.jsx للتحديث في profile.school_id
      window.location.href = '/dr-suad-app/';
    } catch (err) {
      setLinkMsg(err.message || 'فشل ربط الدعوة — حاولي مجدداً.');
    } finally {
      setLinking(false);
    }
  };

  // إضافة طالب جديد لصف المعلمة
  const handleAddStudent = async (e) => {
    e?.preventDefault?.();
    const name = newStudentName.trim();
    if (!name || !user) return;
    setCreatingStudent(true);
    setStudentMsg('');
    try {
      // 1) تحديد class_id — إذا لم يكن للمعلمة صف، أنشئ صفًا تلقائياً
      let classId = profile?.class_id;
      let classCode = studentClassCode;

      if (!classId) {
        const className = `صف ${profile?.full_name || 'المعلمة'}`;
        classCode = generateClassCode(className);
        const { classData: newClass, error: classErr } = await createClassWithCode({
          name: className,
          teacherId: user.id,
          schoolId: profile?.school_id || null,
          code: classCode,
        });
        if (classErr) throw classErr;
        classId = newClass.id;
        setStudentClassId(classId);
        setStudentClassCode(classCode);
      } else {
        // جلب كود الصف الحالي إن وجد
        const { data: existingClass } = await supabase
          .from('classes')
          .select('*')
          .eq('id', classId)
          .maybeSingle();
        classCode = extractClassCode(existingClass) || generateClassCode(classId);
        setStudentClassCode(classCode);
        setStudentClassId(classId);
      }

      // 2) إنشاء حساب الطالب بشكل مجهول (بدون بريد وبدون rate limit)
      const { data: authData, error: signErr } = await supabase.auth.signInAnonymously();
      if (signErr) throw signErr;
      if (!authData.user) throw new Error('فشل إنشاء حساب الطالب');

      // 3) إنشاء profile للطالب
      const { error: profErr } = await supabase.from('profiles').insert([{
        id: authData.user.id,
        name,
        full_name: name,
        role: 'student',
        class_id: classId,
        school_id: profile?.school_id || null,
      }]);
      if (profErr) throw profErr;

      // تسجيل الخروج من الحساب المجهول حتى لا تظل المعلمة مسجلة دخول كطالب مجهول
      await supabase.auth.signOut();

      // 4) تحديث الطلاب المعروضة
      setStudents((prev) => [...prev, {
        id: authData.user.id,
        name,
        full_name: name,
        email: 'طالب مجهول',
        class_id: classId,
        role: 'student',
        created_at: new Date().toISOString(),
      }]);
      setNewStudentName('');
      setShowAddStudent(false);
      setStudentMsg(`تم إضافة الطالب "${name} بنجاح! كود الصف: ${classCode}\nالرجاء تسجيل الدخول مرة أخرى لمتابعة العمل.`);
    } catch (err) {
      setStudentMsg(err.message || 'فشل إضافة الطالب — حاولي مجدداً.');
    } finally {
      setCreatingStudent(false);
    }
  };

  const statCards = [
    { icon: '🧒', label: 'عدد الطلاب', value: students.length, color: 'var(--coral)' },
    { icon: '📚', label: 'الدروس المكتملة', value: progress.length, color: 'var(--sky)' },
    { icon: '🏫', label: 'المدرسة المرتبطة', value: profile?.school_id ? 'نعم' : 'لا', color: 'var(--mint)' },
  ];

  if (!profile?.school_id && showLink) {
    return (
      <div className={styles.page} dir="rtl">
        <div className={styles.linkCard}>
          <h2 className={styles.linkTitle}>ربط حسابك بالمدرسة 🏫</h2>
          <p className={styles.linkSub}>أدخلي كود الدعوة الذي أرسلته لك الدكتورة لربط حسابك بالمدرسة ✉️</p>
          {linkMsg && (
            <div className={`${styles.alert} ${linkMsg.includes('نجاح') ? styles.alertInfo : styles.alertError}`}>
              <span className={styles.alertIcon}>{linkMsg.includes('نجاح') ? '✅' : '⚠️'}</span>
              <span>{linkMsg}</span>
            </div>
          )}
          <form onSubmit={handleLinkInvite} className={styles.form}>
            <div className={styles.field}>
              <label>كود الدعوة</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                required
                maxLength={10}
                className={styles.input}
                placeholder="TCH-XXXX"
              />
            </div>
            <button type="submit" disabled={linking || !inviteCode} className={styles.linkBtn}>
              {linking ? 'جاري الربط...' : 'ربط بالمدرسة'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.page} dir="rtl">
        <div className={styles.linkCard} style={{ textAlign: 'center', padding: '60px 28px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} className={styles.spinner}>⭐</motion.div>
          <p>جاري تحميل لوحة المعلمة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page} dir="rtl">
        <div className={styles.linkCard} style={{ textAlign: 'center', padding: '60px 28px' }}>
          <div className={`${styles.alert} ${styles.alertError}`}>
            <span className={styles.alertIcon}>⚠️</span>
            <span>{error}</span>
          </div>
          <GlowButton variant="coral" onClick={loadData} className={styles.fullBtn}>محاولة مرة أخرى</GlowButton>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} dir="rtl">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>لوحة المعلمة 👩‍🏫</h1>
            <p className={styles.headerSub}>مرحباً، {profile?.full_name || profile?.email || 'المعلمة'}</p>
          </div>
          <GlowButton variant="coral" onClick={handleLogout} className={styles.logoutBtn}>تسجيل الخروج</GlowButton>
        </div>
        {error && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            <span className={styles.alertIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        <div className={styles.statsGrid}>
          {statCards.map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className={styles.statCard} style={{ borderTopColor: s.color }}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statValue} style={{ color: s.color }}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </motion.div>
          ))}
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}><span>🧒</span> طلاب صفك ({students.length})</h2>
          {students.length === 0 ? (
            <p className={styles.empty}>لا يوجد طلاب في صفك بعد. يمكن للدكتورة إضافة طلاب وربطهم بصفك.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>اسم الطالب</th><th>البريد</th><th>الدروس المكتملة</th><th>المتوسط</th></tr></thead>
                <tbody>
                  {students.map((s) => {
                    const p = progress.filter(pr => pr.student_id === s.id);
                    const avg = p.length ? (p.reduce((sum, pr) => sum + (pr.score || 0), 0) / p.length).toFixed(1) : '0';
                    return (
                      <motion.tr key={s.id} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }} className={styles.row}>
                        <td className={styles.studentName}>🧒 {s.full_name || s.email}</td>
                        <td className={styles.email}>{s.email}</td>
                        <td className={styles.lessons}>{p.length}</td>
                        <td><span className={styles.mono}>{avg}</span></td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <GlowButton variant="sunshine" onClick={() => { const rows = students.map(s => { const p = progress.filter(pr => pr.student_id === s.id); const avg = p.length ? (p.reduce((sum, pr) => sum + (pr.score || 0), 0) / p.length).toFixed(1) : '0'; return { name: s.full_name || s.email, email: s.email, avg_score: avg, lessons: p.length }; }); const headers = Object.keys(rows[0] || {}).join(','); const csv = [headers, ...rows.map(r => Object.values(r).join(','))].join('\n'); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'students_progress.csv'; link.click(); }} className={styles.exportBtn}>📊 تصدير CSV</GlowButton>
          <GlowButton variant="mint" onClick={() => { setStudentMsg(''); setNewStudentName(''); setShowAddStudent(true); }} className={styles.addStudentBtn}>➕ إضافة طالب جديد</GlowButton>
        </div>
      </div>

      {/* مودال إضافة طالب */}
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
              {studentClassCode && (
                <div className={styles.field}>
                  <label>كود الصف (يُشارك مع الطالب للدخول)</label>
                  <input
                    type="text"
                    value={studentClassCode}
                    readOnly
                    className={styles.input}
                  />
                  <small className={styles.hint}>يتم توليد الكود تلقائياً عند إنشاء الصف.</small>
                </div>
              )}
              {studentMsg && (
                <div className={`${styles.alert} ${styles.alertSuccess}`}>
                  <span className={styles.alertIcon}>✅</span>
                  <span>{studentMsg}</span>
                </div>
              )}
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowAddStudent(false)} className={styles.cancelBtn}>إلغاء</button>
                <GlowButton type="submit" variant="mint" disabled={creatingStudent}>
                  {creatingStudent ? 'جاري الإضافة...' : '✨ إضافة الطالب'}
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

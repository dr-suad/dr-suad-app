import { useEffect } from 'react';
import styles from './App.module.css';
import { useMascot } from './context/MascotContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import RoleSelection from './components/RoleSelection.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import TeacherDashboard from './components/TeacherDashboard.jsx';
import StudentHome from './components/StudentHome.jsx';
import KidHome from './components/KidHome.jsx';

export default function App() {
  const { say } = useMascot();
  const { user, profile, loading: authLoading, forceSignOut, isGuest } = useAuth();

  const handleClearSession = async () => {
    if (confirm('هل تريد مسح الجلسة الحالية والعودة إلى صفحة اختيار الدور؟')) {
      await forceSignOut();
    }
  };

  useEffect(() => {
    say('أهلاً بك يا بطل! أنا الأرنب ذكي. هل نلعب معاً؟ 🎉');
  }, [say]);

  if (authLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingBox}>
          <div className={styles.loadingIcon}>🔄</div>
          <p className={styles.loadingText}>جاري التحقق من الدخول...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <RoleSelection />;
  }

  // المستخدم موجود لكن ملفه الشخصي لم يُحمّل بعد (حالة عابرة أثناء
  // إنشاء الملف). بدون هذا الحارس يكون role === undefined فتسقط
  // الحالة في الفرع الافتراضي وتعرض واجهة الطفل خطأً.
  if (!profile) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingBox}>
          <div className={styles.loadingIcon}>🔄</div>
          <p className={styles.loadingText}>جاري التحقق من الدخول...</p>
        </div>
      </div>
    );
  }

  const role = profile?.role;

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'teacher') {
    console.log('Profile:', profile);
    if (profile?.school_id) {
      return <TeacherDashboard showLinkForm={false} />;
    }
    return <TeacherDashboard showLinkForm={true} />;
  }

  if (role === 'student') {
    // الطالب: إن لم يكن مرتبطاً بصف نعرض شاشة الانضمام، وإلا نعرض واجهة الطفل
    if (!profile?.class_id && !isGuest) {
      return <StudentHome />;
    }
    return <KidHome />;
  }

  return (
    <div className={styles.app}>
      {user && (
        <div className={styles.clearSessionBar}>
          ⚠️ <button onClick={handleClearSession} className={styles.clearSessionBtn}>مسح الجلسة وإعادة التوجيه</button>
        </div>
      )}
      <KidHome />
    </div>
  );
}

import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Classes from './sections/Classes.jsx';
import Plans from './sections/Plans.jsx';
import Videos from './sections/Videos.jsx';
import Games from './sections/Games.jsx';
import Assessment from './sections/Assessment.jsx';
import About from './sections/About.jsx';
import Footer from './sections/Footer.jsx';
import Toast from './components/Toast.jsx';
import Confetti from './components/Confetti.jsx';
import AchievementTree from './components/AchievementTree.jsx';
import LearningPath from './components/LearningPath.jsx';
import DailyChallenge from './components/DailyChallenge.jsx';
import Stories from './components/Stories.jsx';
import ParentReport from './components/ParentReport.jsx';
import RecoveryPath from './components/RecoveryPath.jsx';
import FloatingBackground from './components/FloatingBackground.jsx';
import FloatingButtons from './components/FloatingButtons.jsx';
import { useStars } from './hooks/useStars.js';
import { useToast } from './hooks/useToast.js';
import { useMascot } from './context/MascotContext.jsx';
import Mascot from './components/Mascot.jsx';
import { useAuth } from './context/AuthContext.jsx';
import RoleSelection from './components/RoleSelection.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import TeacherDashboard from './components/TeacherDashboard.jsx';
import StudentHome from './components/StudentHome.jsx';

export default function App() {
  const { stars } = useStars();
  const { toast, show } = useToast();
  const { say } = useMascot();
  const { user, profile, loading: authLoading, forceSignOut } = useAuth();
  const [dark, setDark] = useState(false);
  const [confetti, setConfetti] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-gray-600">جاري التحقق من الدخول...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <RoleSelection />;
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
    return <StudentHome />;
  }

  return (
    <div className={styles.app}>
      {user && (
        <div className="fixed top-4 left-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium border border-red-300">
          ⚠️ <button onClick={handleClearSession} className="underline ml-2">مسح الجلسة وإعادة التوجيه</button>
        </div>
      )}
      <FloatingBackground />
      <Header stars={stars} dark={dark} onThemeToggle={() => setDark(!dark)} />
      <FloatingButtons
        onPlay={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
        onStory={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
        onChallenge={() => document.getElementById('dailyChallenge')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <main className={styles.mainContent}>
        <Hero onExplore={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })} />
        <RecoveryPath showToast={show} />
        <AchievementTree showToast={show} />
        <LearningPath showToast={show} />
        <DailyChallenge showToast={show} />
        <Classes showToast={show} />
        <Plans showToast={show} />
        <Videos showToast={show} />
        <Games showToast={show} />
        <Stories showToast={show} />
        <Assessment onStart={() => setConfetti(true)} showToast={show} />
        <About />
      </main>
      <Footer />
      <Toast toast={toast} />
      <Confetti active={confetti} />
      <Mascot />
    </div>
  );
}

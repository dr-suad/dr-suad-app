import { useState } from 'react';
import styles from '../App.module.css';
import Header from './Header.jsx';
import Hero from './Hero.jsx';
import Classes from '../sections/Classes.jsx';
import Plans from '../sections/Plans.jsx';
import Videos from '../sections/Videos.jsx';
import Games from '../sections/Games.jsx';
import Assessment from '../sections/Assessment.jsx';
import About from '../sections/About.jsx';
import Footer from '../sections/Footer.jsx';
import Toast from './Toast.jsx';
import Confetti from './Confetti.jsx';
import AchievementTree from './AchievementTree.jsx';
import LearningPath from './LearningPath.jsx';
import DailyChallenge from './DailyChallenge.jsx';
import Stories from './Stories.jsx';
import RecoveryPath from './RecoveryPath.jsx';
import FloatingBackground from './FloatingBackground.jsx';
import FloatingButtons from './FloatingButtons.jsx';
import { useStars } from '../hooks/useStars.js';
import { useToast } from '../hooks/useToast.js';
import { useMascot } from '../context/MascotContext.jsx';
import Mascot from './Mascot.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * واجهة الطفل — الصفحة الرئيسية الكاملة (Hero, الصفوف, الألعاب...)
 * تُستخدم لكل طالب مرتبط بصف، ولكل زائر (تجربة سريعة بدون كود صف).
 */
export default function KidHome() {
  const { stars } = useStars();
  const { toast, show } = useToast();
  const { say } = useMascot();
  const { isGuest } = useAuth();
  const [dark, setDark] = useState(false);
  const [confetti, setConfetti] = useState(false);

  return (
    <div className={styles.app}>
      <FloatingBackground />
      <Header stars={stars} dark={dark} onThemeToggle={() => setDark(!dark)} />
      <FloatingButtons
        onPlay={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
        onStory={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
        onChallenge={() => document.getElementById('dailyChallenge')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <main className={styles.mainContent}>
        {isGuest && (
          <div className={styles.guestBanner}>
            🧒 أنت في وضع التجربة (زائر) — تلعب وتتعلم بحرية، ولن تظهر نتائجك للمعلمة.
          </div>
        )}
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
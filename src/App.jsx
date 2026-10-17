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
import { useStars } from './hooks/useStars.js';
import { useToast } from './hooks/useToast.js';
import { useMascot } from './context/MascotContext.jsx';
import Mascot from './components/Mascot.jsx';

export default function App() {
  const { stars } = useStars();
  const { toast, show } = useToast();
  const { say } = useMascot();
  const [dark, setDark] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    say('أهلاً بك يا بطل! أنا الأرنب ذكي. هل نلعب معاً؟ 🎉');
  }, [say]);

  return (
    <div className={styles.app}>
      <Header stars={stars} dark={dark} onThemeToggle={() => setDark(!dark)} />
      <main className={styles.mainContent}>
        <Hero onExplore={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })} />
        <AchievementTree showToast={show} />
        <LearningPath showToast={show} />
        <DailyChallenge showToast={show} />
        <Classes showToast={show} />
        <Plans showToast={show} />
        <Videos showToast={show} />
        <Games showToast={show} />
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

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import FloatingShapes from './components/FloatingShapes';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';
import { useStars } from './hooks/useStars';
import classesStyles from './App.module.css';
import Classes from './sections/Classes';
import Plans from './sections/Plans';
import Videos from './sections/Videos';
import Games from './sections/Games';
import Assessment from './sections/Assessment';
import About from './sections/About';
import Footer from './sections/Footer';

const ROUTES = {
  '#/home': 'home',
  '#/classes': 'classes',
  '#/plans': 'plans',
  '#/preparations': 'preparations',
  '#/worksheets': 'worksheets',
  '#/videos': 'videos',
  '#/games': 'games',
  '#/assessment': 'assessment',
  '#/about': 'about',
};

const SectionMap = {
  home: Hero,
  classes: Classes,
  plans: Plans,
  preparations: Plans,
  worksheets: Plans,
  videos: Videos,
  games: Games,
  assessment: Assessment,
  about: About,
};

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#/home');
  const { toast, show } = useToast();
  const { stars, badges, currentBadge } = useStars();

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/home');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const SectionComponent = SectionMap[ROUTES[hash] || 'home'];

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.section
            key={hash}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="route-section"
          >
            {hash === '#/home' ? (
              <>
                <Hero />
                <FloatingShapes />
              </>
            ) : (
              <SectionComponent />
            )}
          </motion.section>
        </AnimatePresence>
      </main>
      <Footer />
      <Toast toast={toast} onClose={() => {}} />
      <div className="stars-badge">
        <span>⭐ {stars}</span>
        {currentBadge && <span className="badge-label">{currentBadge.emoji} {currentBadge.name}</span>}
      </div>
    </div>
  );
}
import { useState } from 'react';
import styles from '../App.module.css';
import AdventureGame from '../components/AdventureGame.jsx';
import MatchGame from '../components/MatchGame.jsx';
import QuickMath from '../components/QuickMath.jsx';
import SectionTitle from '../components/SectionTitle.jsx';

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);

  const openGame = (game) => setActiveGame(game);
  const closeGame = () => setActiveGame(null);

  if (activeGame === 'adventure') {
    return <AdventureGame onClose={closeGame} />;
  }
  if (activeGame === 'match') {
    return <MatchGame onClose={closeGame} />;
  }
  if (activeGame === 'quickmath') {
    return <QuickMath onClose={closeGame} />;
  }

  return (
    <section className={styles.gamesSection} id="games">
      <div className={styles.container}>
        <SectionTitle title="الألعاب التعليمية" />
        <div className={styles.gamesGrid}>
          <div className={styles.gameCard} onClick={() => openGame('adventure')}>
            <div className={styles.gameIcon}>🥕</div>
            <h3>مغامرة الأرنب</h3>
            <p>10 تحديات رياضية للوصول لجزرة الذهبية</p>
            <span className={styles.gameBtn}>ابدأ المغامرة 🥕</span>
          </div>
          <div className={styles.gameCard} onClick={() => openGame('match')}>
            <div className={styles.gameIcon}>🔺</div>
            <h3>مطابقة الأشكال</h3>
            <p>ربط الشكل بالاسم الصحيح في 30 ثانية</p>
            <span className={styles.gameBtn}>اللعبة الآن 🔺</span>
          </div>
          <div className={styles.gameCard} onClick={() => openGame('quickmath')}>
            <div className={styles.gameIcon}>⚡</div>
            <h3>احسب بسرعة</h3>
            <p>60 ثانية من المسائل الحسابية السريعة</p>
            <span className={styles.gameBtn}>حسب بسرعة ⚡</span>
          </div>
        </div>
      </div>
    </section>
  );
}
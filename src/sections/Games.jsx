import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../App.module.css';
import SectionTitle from '../components/SectionTitle.jsx';
import AdventureGame from '../components/AdventureGame.jsx';
import MatchGame from '../components/MatchGame.jsx';
import QuickMath from '../components/QuickMath.jsx';
import CleanNeighborhood from '../components/games/CleanNeighborhood.jsx';
import PalestineColors from '../components/games/PalestineColors.jsx';
import RespectElderly from '../components/games/RespectElderly.jsx';
import RespectTeacher from '../components/games/RespectTeacher.jsx';
import NumberGarden from '../components/games/NumberGarden.jsx';
import PalestineMarket from '../components/games/PalestineMarket.jsx';
import TreasureMap from '../components/games/TreasureMap.jsx';
import OliveGarden from '../components/games/OliveGarden.jsx';
import JusticeScale from '../components/games/JusticeScale.jsx';
import KunafaParty from '../components/games/KunafaParty.jsx';
import MillionBank from '../components/games/MillionBank.jsx';
import PlaceValue from '../components/games/PlaceValue.jsx';
import ExpandedForm from '../components/games/ExpandedForm.jsx';
import NumberTrain from '../components/games/NumberTrain.jsx';

const GAMES = [
  { key: 'adventure', icon: '🥕', title: 'مغامرة الأرنب', desc: '10 تحديات رياضية للوصول لجزرة الذهبية', btn: 'ابدأ المغامرة 🥕' },
  { key: 'match', icon: '🔺', title: 'مطابقة الأشكال', desc: 'اربط الشكل بالاسم الصحيح في 30 ثانية', btn: 'العب الآن 🔺' },
  { key: 'quickmath', icon: '⚡', title: 'احسب بسرعة', desc: '60 ثانية من المسائل الحسابية السريعة', btn: 'حسب بسرعة ⚡' },
  { key: 'clean', icon: '🗑️', title: 'نظّف حيّك', desc: 'فرز النفايات: زوجي أم فردي', btn: 'نظّف الحي 🗑️' },
  { key: 'colors', icon: '🇵🇸', title: 'علّم الألوان', desc: 'ترتيب ألوان العلم الفلسطيني', btn: 'العب الآن 🇵🇸' },
  { key: 'elderly', icon: '👴', title: 'احترم الكبير', desc: 'ساعد الجد في العد', btn: 'العب الآن 👴' },
  { key: 'teacher', icon: '📚', title: 'صديق المعلم', desc: 'أجب بأدب وحساب', btn: 'العب الآن 📚' },
  { key: 'garden', icon: '🌻', title: 'حديقة الأرقام', desc: 'ازرع الزهور بالحساب الصحيح', btn: 'ازرع الآن 🌻' },
  { key: 'market', icon: '🛒', title: 'سوق فلسطين', desc: 'احسب مشترياتك في السوق', btn: 'تسوق الآن 🛒' },
  { key: 'treasure', icon: '🗺️', title: 'خرائط الكنوز', desc: 'استكشف المدن الفلسطينية بالحساب', btn: 'استكشف الآن 🗺️' },
  { key: 'olive', icon: '🫒', title: 'بستان الزيتون', desc: 'ازرع وحصد الزيتون بالحساب', btn: 'ابدأ الحصاد 🫒' },
  { key: 'justice', icon: '⚖️', title: 'ميزان العدل', desc: 'توازن المعادلات الرياضية', btn: 'تحقق من التوازن ⚖️' },
  { key: 'kunafa', icon: '🍮', title: 'طبق الكنافة', desc: 'قسم الكنافة بعدل بين الأفراد', btn: 'قسم الآن 🍮' },
  { key: 'million', icon: '🏦', title: 'مصرف الملايين', desc: 'قراءة وكتابة الأعداد ضمن الملايين', btn: 'العب الآن 🏦' },
  { key: 'placevalue', icon: '🏠', title: 'القيمة المنزلية', desc: 'تحديد قيمة الرقم في العدد', btn: 'العب الآن 🏠' },
  { key: 'expanded', icon: '🧩', title: 'الصورة الموسعة', desc: 'تحويل العدد إلى صورة موسعة', btn: 'العب الآن 🧩' },
  { key: 'train', icon: '🚂', title: 'قطار الأعداد', desc: 'مقارنة وترتيب الأعداد الكبيرة', btn: 'العب الآن 🚂' },
];

const COMPONENTS = {
  match: MatchGame,
  quickmath: QuickMath,
  clean: CleanNeighborhood,
  colors: PalestineColors,
  elderly: RespectElderly,
  teacher: RespectTeacher,
  garden: NumberGarden,
  market: PalestineMarket,
  treasure: TreasureMap,
  olive: OliveGarden,
  justice: JusticeScale,
  million: MillionBank,
  placevalue: PlaceValue,
  expanded: ExpandedForm,
  train: NumberTrain,
};

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);

  const openGame = (game) => setActiveGame(game);
  const closeGame = () => setActiveGame(null);

  if (activeGame) {
    const Game = COMPONENTS[activeGame];
    return <Game onClose={closeGame} />;
  }

  return (
    <section className={styles.gamesSection} id="games">
      <div className={styles.container}>
        <SectionTitle title="الألعاب التعليمية" />
        <div className={styles.gamesGrid}>
          {GAMES.map((game, i) => (
            <motion.div
              key={game.key}
              className={styles.gameCard}
              onClick={() => openGame(game.key)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              whileHover={{ scale: 1.04, y: -6 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className={styles.gameIcon}>{game.icon}</div>
              <h3>{game.title}</h3>
              <p>{game.desc}</p>
              <span className={styles.gameBtn}>{game.btn}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
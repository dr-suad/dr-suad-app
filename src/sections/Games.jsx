import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../App.module.css';
import SectionTitle from '../components/SectionTitle.jsx';
import GlowButton from '../components/GlowButton.jsx';
import { useToast } from '../hooks/useToast.js';

// ---- الألعاب القديمة (الصف الرابع) ----
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

// ---- الألعاب للصفوف 1-3 ----
import CountFruits from '../components/games/CountFruits.jsx';
import OrderNumbers from '../components/games/OrderNumbers.jsx';
import ShapesAround from '../components/games/ShapesAround.jsx';
import BiggerSmaller from '../components/games/BiggerSmaller.jsx';
import TensTreasure from '../components/games/TensTreasure.jsx';
import AddRace from '../components/games/AddRace.jsx';
import SubtractRace from '../components/games/SubtractRace.jsx';
import MultiplyBlocks from '../components/games/MultiplyBlocks.jsx';
import FractionHouse from '../components/games/FractionHouse.jsx';
import CandyShare from '../components/games/CandyShare.jsx';
import MarketProblems from '../components/games/MarketProblems.jsx';
import MeasureRuler from '../components/games/MeasureRuler.jsx';

const GAMES = [
  // الصف الأول
  { key: 'countfruits', icon: '🍎', title: 'عد الفواكه', desc: 'عدّ فواكه وأرقام (الصف الأول)', btn: 'ابدأ العد 🍎', grade: 1 },
  { key: 'ordernums', icon: '🔢', title: 'رتب الأرقام', desc: 'رتب 4 أرقام من الأصغر للأكبر', btn: 'رتّب الآن 🔢', grade: 1 },
  { key: 'shapesaround', icon: '🔺', title: 'الأشكال حولنا', desc: 'تعرّف على أشكال مثلث ودائرة ونجمة', btn: 'اكتشف الأشكال 🔺', grade: 1 },
  { key: 'biggersmaller', icon: '⚖️', title: 'من الأكبر؟', desc: 'قارن عددين كبيرين أو أصغر', btn: 'قارن الآن ⚖️', grade: 1 },
  
  // الصف الثاني
  { key: 'tenstreasure', icon: '💰', title: 'كنز العشرات', desc: 'حدّد العدد من العشرات والآحاد', btn: 'اكتشف الكنز 💰', grade: 2 },
  { key: 'addrace', icon: '🏃', title: 'سباق الجمع', desc: 'أضف مسائل جمع بسرعة (30 ثانية)', btn: 'انطلق 🏃', grade: 2 },
  { key: 'subtractrace', icon: '🏃', title: 'سباق الطرح', desc: 'اطرح مسائل بسرعة (30 ثانية)', btn: 'انطلق 🏃', grade: 2 },
  { key: 'multiplyblocks', icon: '🧊', title: 'ضرب المكعبات', desc: 'استخدم المكعبات لحساب الضرب', btn: 'استخدم المكعبات 🧊', grade: 2 },
  
  // الصف الثالث
  { key: 'fractionhouse', icon: '🏠', title: 'بيت الكسور', desc: 'تعرّف على بيت الكسور وكسره', btn: 'ابدأ الكسر 🏠', grade: 3 },
  { key: 'candyshare', icon: '🍬', title: 'توزيع الحلوى', desc: 'قسّم الحلوى بعدل على الأصدقاء', btn: 'وزّع الآن 🍬', grade: 3 },
  { key: 'marketprobs', icon: '🛒', title: 'مشاكل السوق', desc: 'حل مسائل شراء في السوق', btn: 'حل المسائل 🛒', grade: 3 },
  { key: 'measureruler', icon: '📏', title: 'مسطرة القياس', desc: 'قِس طول الأشياء بالمسطرة', btn: 'قِس الآن 📏', grade: 3 },
  
  // الألعاب القديمة (الصف الرابع)
  { key: 'adventure', icon: '🥕', title: 'مغامرة الأرنب', desc: '10 تحديات رياضية للوصول لجزرة الذهبية', btn: 'ابدأ المغامرة 🥕', grade: 4 },
  { key: 'match', icon: '🔺', title: 'مطابقة الأشكال', desc: 'اربط الشكل بالاسم الصحيح في 30 ثانية', btn: 'العب الآن 🔺', grade: 4 },
  { key: 'quickmath', icon: '⚡', title: 'احسب بسرعة', desc: '60 ثانية من المسائل الحسابية السريعة', btn: 'حسب بسرعة ⚡', grade: 4 },
  { key: 'clean', icon: '🗑️', title: 'نظّف حيّك', desc: 'فرز النفايات: زوجي أم فردي', btn: 'نظّف الحي 🗑️', grade: 4 },
  { key: 'colors', icon: '🇵🇸', title: 'علّم الألوان', desc: 'ترتيب ألوان العلم الفلسطيني', btn: 'العب الآن 🇵🇸', grade: 4 },
  { key: 'elderly', icon: '👴', title: 'احترم الكبير', desc: 'ساعد الجد في العد', btn: 'العب الآن 👴', grade: 4 },
  { key: 'teacher', icon: '📚', title: 'صديق المعلم', desc: 'أجب بأدب وحساب', btn: 'العب الآن 📚', grade: 4 },
  { key: 'garden', icon: '🌻', title: 'حديقة الأرقام', desc: 'ازرع الزهور بالحساب الصحيح', btn: 'ازرع الآن 🌻', grade: 4 },
  { key: 'market', icon: '🛒', title: 'سوق فلسطين', desc: 'احسب مشترياتك في السوق', btn: 'تسوق الآن 🛒', grade: 4 },
  { key: 'treasure', icon: '🗺️', title: 'خرائط الكنوز', desc: 'استكشف المدن الفلسطينية بالحساب', btn: 'استكشف الآن 🗺️', grade: 4 },
  { key: 'olive', icon: '🫒', title: 'بستان الزيتون', desc: 'ازرع وحصد الزيتون بالحساب', btn: 'ابدأ الحصاد 🫒', grade: 4 },
  { key: 'justice', icon: '⚖️', title: 'ميزان العدل', desc: 'توازن المعادلات الرياضية', btn: 'تحقق من التوازن ⚖️', grade: 4 },
  { key: 'kunafa', icon: '🍮', title: 'طبق الكنافة', desc: 'قسم الكنافة بعدل بين الأفراد', btn: 'قسم الآن 🍮', grade: 4 },
  { key: 'million', icon: '🏦', title: 'مصرف الملايين', desc: 'قراءة وكتابة الأعداد ضمن الملايين', btn: 'العب الآن 🏦', grade: 4 },
  { key: 'placevalue', icon: '🏠', title: 'القيمة المنزلية', desc: 'تحديد قيمة الرقم في العدد', btn: 'العب الآن 🏠', grade: 4 },
  { key: 'expanded', icon: '🧩', title: 'الصورة الموسعة', desc: 'تحويل العدد إلى صورة موسعة', btn: 'العب الآن 🧩', grade: 4 },
  { key: 'train', icon: '🚂', title: 'قطار الأعداد', desc: 'مقارنة وترتيب الأعداد الكبيرة', btn: 'العب الآن 🚂', grade: 4 },
];

const GAMES_BY_GRADE = [
  { id: '1', icon: '👶', title: 'الصف الأول' },
  { id: '2', icon: '🧒', title: 'الصف الثاني' },
  { id: '3', icon: '🧑', title: 'الصف الثالث' },
  { id: '4', icon: '👦', title: 'الصف الرابع' },
];

const COMPONENTS = {
  // الصف الرابع
  adventure: AdventureGame,
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
  kunafa: KunafaParty,
  million: MillionBank,
  placevalue: PlaceValue,
  expanded: ExpandedForm,
  train: NumberTrain,

  // الصف الأول
  countfruits: CountFruits,
  ordernums: OrderNumbers,
  shapesaround: ShapesAround,
  biggersmaller: BiggerSmaller,

  // الصف الثاني
  tenstreasure: TensTreasure,
  addrace: AddRace,
  subtractrace: SubtractRace,
  multiplyblocks: MultiplyBlocks,

  // الصف الثالث
  fractionhouse: FractionHouse,
  candyshare: CandyShare,
  marketprobs: MarketProblems,
  measureruler: MeasureRuler,
};

export default function Games({ showToast }) {
  const { showToast: toast } = useToast();
  const [activeGame, setActiveGame] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const openGame = (game) => {
    if (showToast) showToast('🎮 اللعبة بدأت!');
    setActiveGame(game);
  };
  const closeGame = () => setActiveGame(null);
  const selectGrade = (grade) => setSelectedGrade(grade);

  // إذا كانت اللعبة مفتوحة، نعرضها
  if (activeGame) {
    const Game = COMPONENTS[activeGame];
    return <Game onClose={closeGame} />;
  }

  // نعرض اختيار الصفوف ثم الألعاب
  return (
    <section className={styles.gamesSection} id="games">
      <div className={styles.container}>
        <SectionTitle title="الألعاب التعليمية" />
        <div className={styles.gradeButtons}>
          {GAMES_BY_GRADE.map((g) => (
            <GlowButton key={g.id} variant="primary" onClick={() => selectGrade(g.id)}>
              {g.icon} {g.title}
            </GlowButton>
          ))}
        </div>
        {selectedGrade && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.gameSection}
          >
            <h2 className={styles.gradeTitle}>{GAMES_BY_GRADE.find(g => g.id === selectedGrade).title}</h2>
            <div className={styles.gamesGrid}>
              {GAMES.filter(g => g.grade === parseInt(selectedGrade)).map((game, i) => (
                <motion.div
                  key={game.key}
                  className={styles.gameCard}
                  onClick={() => openGame(game.key)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
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
          </motion.div>
        )}
      </div>
    </section>
  );
}

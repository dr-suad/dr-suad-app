import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Stories.module.css';
import { playSuccess, playError } from '../utils/sounds.js';
import GlowButton from './GlowButton.jsx';

const STORIES = [
  {
    id: 1,
    classId: 1,
    title: 'سوق سامي',
    emoji: '🛒',
    scene: '🍎🍎🍎 + 🍌🍌',
    lines: [
      'ذهب سامي إلى السوق مع أمه.',
      'اشترى 3 تفاحات 🍎🍎🍎',
      'واشترى 2 موزات 🍌🍌',
      'كم فاكهة اشترى سامي؟',
    ],
    question: 'كم فاكهة اشترى سامي؟',
    options: ['3', '4', '5', '6'],
    answer: '5',
    value: '🤝 التعاون مع الأم',
  },
  {
    id: 2,
    classId: 2,
    title: 'الفراشات في الحديقة',
    emoji: '🦋',
    scene: '🦋🦋🦋🦋🦋🦋🦋🦋 - 🦋🦋🦋',
    lines: [
      'في الحديقة 8 فراشات ملونة 🦋🦋🦋🦋🦋🦋🦋🦋',
      'طرت 3 فراشات بعيداً 🦋🦋🦋',
      'كم فراشة بقيت في الحديقة؟',
    ],
    question: 'كم فراشة بقيت في الحديقة؟',
    options: ['4', '5', '6', '7'],
    answer: '5',
    value: '🌱 نظافة المكان',
  },
  {
    id: 3,
    classId: 3,
    title: 'حلويات سارة',
    emoji: '🍬',
    scene: '🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬 ÷ 4',
    lines: [
      'لدى سارة 12 حلوى 🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬',
      'أرادت أن تقسمها على 4 أصدقاء',
      'كم حلوى أخذ كل صديق؟',
    ],
    question: 'كم حلوى أخذ كل صديق؟',
    options: ['2', '3', '4', '6'],
    answer: '3',
    value: '🤝 التعاون',
  },
  {
    id: 4,
    classId: 4,
    title: 'غرفة ريم',
    emoji: '📐',
    scene: '📏 5m × 📏 4m = 📐 محيط',
    lines: [
      'غرفة ريم مستطيلة الشكل',
      'طولها 5 أمتار وعرضها 4 أمتار',
      'كم محيط الغرفة؟ (محيط = 2×(الطول+العرض))',
    ],
    question: 'ما محيط الغرفة؟',
    options: ['9 م', '18 م', '20 م', '40 م'],
    answer: '18',
    value: '🧹 النظافة الشخصية',
  },
  {
    id: 5,
    classId: 1,
    title: 'أرانب خديجة',
    emoji: '🐰',
    scene: '🐰🐰🐰🐰 + 🐰🐰',
    lines: [
      'عند خديجة 4 أرانب 🐰🐰🐰🐰',
      'أحضرت لها أمها أرانبين آخرين 🐰🐰',
      'كم أرنب أصبح لدى خديجة؟',
    ],
    question: 'كم أرنب أصبح لدى خديجة؟',
    options: ['4', '5', '6', '7'],
    answer: '6',
    value: '🐰 الرفق بالحيوان',
  },
  {
    id: 6,
    classId: 2,
    title: 'دراجة عمر',
    emoji: '🚲',
    scene: '🚲 15km - 🚲 6km',
    lines: [
      'قطع عمر 15 كيلومتراً على دراجته 🚲',
      'توقف للراحة بعد 6 كيلومترات',
      'كم كيلومتراً تبقّى لعمر؟',
    ],
    question: 'كم كيلومتراً تبقّى لعمر؟',
    options: ['7', '8', '9', '10'],
    answer: '9',
    value: '🚲 السلامة والرياضة',
  },
  {
    id: 7,
    classId: 3,
    title: 'كتاب يوسف',
    emoji: '📚',
    scene: '📚 8 × 6 صفحات',
    lines: [
      'يقرأ يوسف 6 صفحات كل يوم 📚',
      'كم صفحة سيقرأ في 8 أيام؟',
      'الفكرة: العدد × الأيام',
    ],
    question: 'كم صفحة سيقرأ يوسف في 8 أيام؟',
    options: ['36', '42', '48', '56'],
    answer: '48',
    value: '📚 حب القراءة',
  },
  {
    id: 8,
    classId: 4,
    title: 'عسل النحل 🍯',
    emoji: '🐝',
    scene: '🍯 3/4 × 20',
    lines: [
      'لدى النحل 20 كغ من العسل 🍯',
      'أعطى 3/4 منها للجيران',
      'كم كيلوغراماً أبقى النحل؟',
    ],
    question: 'كم كغ أبقى النحل؟',
    options: ['4', '5', '10', '15'],
    answer: '5',
    value: '🤝 المشاركة مع الجيران',
  },
  {
    id: 9,
    classId: 1,
    title: 'طيور الحديقة',
    emoji: '🐦',
    scene: '🐦🐦🐦🐦🐦🐦🐦 - 🐦🐦',
    lines: [
      'في الشجرة 7 طيور 🐦🐦🐦🐦🐦🐦🐦',
      'طارت طائران بعيداً 🐦🐦',
      'كم طائراً بقي في الشجرة؟',
    ],
    question: 'كم طائراً بقي؟',
    options: ['4', '5', '6', '7'],
    answer: '5',
    value: '🐦 حماية الطيور',
  },
  {
    id: 10,
    classId: 3,
    title: 'عملة مجد',
    emoji: '🪙',
    scene: '🪙 96 ÷ 6',
    lines: [
      'جمعت مجد 96 عملة ذهبية 🪙',
      'أرادت توزيعها بالتساوي على 6 أخوات',
      'كم عملة لكل أخت؟',
    ],
    question: 'كم عملة لكل أخت؟',
    options: ['12', '14', '16', '18'],
    answer: '16',
    value: '👧 العدل بين الإخوة',
  },
];

export default function Stories({ showToast }) {
  const [openStory, setOpenStory] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(false);

  const open = (story) => {
    setOpenStory(story);
    setSelected(null);
    setShowResult(false);
  };

  const close = () => {
    setOpenStory(null);
    setSelected(null);
    setShowResult(false);
  };

  const handleAnswer = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const isCorrect = opt === openStory.answer;
    setCorrect(isCorrect);
    setShowResult(true);
    if (isCorrect) {
      playSuccess();
      if (showToast) showToast('إجابة صحيحة! أحسنت 🎉', 'success');
    } else {
      playError();
      if (showToast) showToast('ليست صحيحة، حاول مرة أخرى 💪', 'error');
    }
  };

  if (openStory) {
    return (
      <AnimatePresence>
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.storyTitle}>{openStory.title}</h2>
              {openStory.value && <span className={styles.valueBadge}>{openStory.value}</span>}
              <button className={styles.closeBtn} onClick={close} aria-label="إغلاق القصة">✕</button>
            </div>

            <motion.div
              className={styles.scene}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {openStory.scene}
            </motion.div>

            <div className={styles.lines}>
              {openStory.lines.map((line, i) => (
                <motion.p
                  key={i}
                  className={styles.line}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.12 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

          <div className={styles.questionArea}>
            <p className={styles.question}>{openStory.question}</p>
            <div className={styles.options}>
              {openStory.options.map((opt) => (
                <button
                  key={opt}
                  className={`${styles.option} ${
                    selected === opt ? (correct ? styles.correct : styles.wrong) : ''
                  }`}
                  onClick={() => handleAnswer(opt)}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className={styles.resultArea}>
              {correct ? (
                <span className={styles.successText}>🎉 إجابة صحيحة! رائع!</span>
              ) : (
                <span className={styles.errorText}>😅 ليست صحيحة، حاول مرة أخرى!</span>
              )}
            </div>
          )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <section className={styles.section} id="stories">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>قصص مصورة 📖</h2>
        <p className={styles.sectionDesc}>قصص ممتعة تجمع بين القراءة والحساب!</p>
        <div className={styles.grid}>
          {STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              className={styles.storyCard}
              onClick={() => open(story)}
              style={{ cursor: 'pointer' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: (i % 5) * 0.08 }}
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className={styles.cardEmoji}>{story.emoji}</span>
              <span className={styles.cardTitle}>{story.title}</span>
              <span className={styles.cardBadge}>الصف {['الأول', 'الثاني', 'الثالث', 'الرابع'][story.classId - 1]}</span>
              {story.value && <span className={styles.cardValue}>{story.value}</span>}
              <GlowButton variant="lavender" className={styles.cardGlowBtn}>اقرأ القصة 📖</GlowButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

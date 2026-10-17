import { useState } from 'react';
import styles from './Stories.module.css';
import { playSuccess, playError } from '../utils/sounds.js';

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
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.storyTitle}>{openStory.title}</h2>
            <button className={styles.closeBtn} onClick={close} aria-label="إغلاق القصة">✕</button>
          </div>

          <div className={styles.scene}>{openStory.scene}</div>

          <div className={styles.lines}>
            {openStory.lines.map((line, i) => (
              <p key={i} className={styles.line}>{line}</p>
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
        </div>
      </div>
    );
  }

  return (
    <section className={styles.section} id="stories">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>قصص مصورة 📖</h2>
        <p className={styles.sectionDesc}>قصص ممتعة تجمع بين القراءة والحساب!</p>
        <div className={styles.grid}>
          {STORIES.map((story) => (
            <button
              key={story.id}
              className={styles.storyCard}
              onClick={() => open(story)}
            >
              <span className={styles.cardEmoji}>{story.emoji}</span>
              <span className={styles.cardTitle}>{story.title}</span>
              <span className={styles.cardBadge}>الصف {['الأول', 'الثاني', 'الثالث', 'الرابع'][story.classId - 1]}</span>
              <span className={styles.cardBtn}>اقرأ القصة 📖</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

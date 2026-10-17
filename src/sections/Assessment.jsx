import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle.jsx';
import GlowButton from '../components/GlowButton.jsx';
import styles from '../App.module.css';

const QUESTIONS = [
  { id: 1, text: 'كم هو ٣ + ٤؟', answer: '٧', options: ['٥', '٦', '٧', '٨'] },
  { id: 2, text: 'كم هو ٩ − ٥؟', answer: '٤', options: ['٣', '٤', '٥', '٦'] },
  { id: 3, text: 'كم هو ٢ × ٣؟', answer: '٦', options: ['٤', '٥', '٦', '٨'] },
  { id: 4, text: 'كم هو ١٢ ÷ ٣؟', answer: '٤', options: ['٢', '٣', '٤', '٥'] },
  { id: 5, text: 'أي عدد أكبر: ٨ أم ٥؟', answer: '٨', options: ['٥', '٨', '٦', '٧'] },
];

export default function Assessment() {
  const [step, setStep] = useState('select');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSelectClass = (classId) => {
    setStep('question');
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
  };

  const handleAnswer = (opt) => {
    setSelected(opt);
    setShowAnswer(true);
    if (opt === QUESTIONS[currentQ].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setStep('result');
    }
  };

  const restart = () => {
    setStep('select');
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
  };

  if (step === 'select') {
    return (
      <section className={styles.assessmentSection} id="assessment">
        <div className="container">
          <SectionTitle title="التقييم الحقيقي" />
          <div className={styles.classSelect}>
            {[1, 2, 3, 4].map((id) => (
              <GlowButton
                key={id}
                variant={['coral', 'sunshine', 'mint', 'sky'][id - 1]}
                onClick={() => handleSelectClass(id)}
              >
                الصف {['الأول', 'الثاني', 'الثالث', 'الرابع'][id - 1]}
              </GlowButton>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (step === 'question') {
    const q = QUESTIONS[currentQ];
    return (
      <section className={styles.assessmentSection} id="assessment">
        <div className="container">
          <SectionTitle title="سؤال من ٥" />
          <div className={styles.questionCard}>
            <div className={styles.progress}>
              <span>{currentQ + 1} من {QUESTIONS.length}</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.questionText}
            >
              {q.text}
            </motion.div>
            <div className={styles.options}>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  className={`${styles.option} ${selected ? (selected === opt ? styles.selected : '') : ''} ${showAnswer ? (opt === q.answer ? styles.correct : selected === opt ? styles.wrong : '') : ''}`}
                  onClick={() => handleAnswer(opt)}
                  disabled={showAnswer}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showAnswer && (
              <div className={styles.answerFeedback}>
                {selected === q.answer ? 'إجابة صحيحة! 🎉' : `الإجابة الصحيحة هي: ${q.answer}`}
              </div>
            )}
            <div className={styles.questionActions}>
              <GlowButton variant="sky" onClick={nextQuestion} disabled={!showAnswer}>
                {showAnswer ? 'السؤال التالي' : 'اختر إجابة'}
              </GlowButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.assessmentSection} id="assessment">
      <div className="container">
        <SectionTitle title="النتيجة النهائية" />
        <div className={styles.resultCard}>
          <div className={styles.score}>
            {score} من {QUESTIONS.length}
          </div>
          <p className={styles.resultMessage}>
            {score >= 4 ? 'ممتاز! أنت بطل الرياضيات 👑' : score >= 2 ? 'جيد جداً، قليل من التدريب ويصبح ممتازاً 🌟' : 'بداية جميلة، تابع التدريب وستتقدم 🌱'}
          </p>
          <div className={styles.resultActions}>
            <GlowButton variant="mint" onClick={restart}>
              إعادة التقييم
            </GlowButton>
            <GlowButton variant="lavender" onClick={() => setStep('select')}>
              العودة للرئيسية
            </GlowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
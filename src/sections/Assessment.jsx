import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import GlowButton from '../components/GlowButton';

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
      <section className="assessment-section" id="assessment">
        <div className="container">
          <SectionTitle title="التقييم الحقيقي" />
          <div className="class-select">
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
      <section className="assessment-section" id="assessment">
        <div className="container">
          <SectionTitle title="سؤال من ٥" />
          <div className="question-card">
            <div className="progress">
              <span>{currentQ + 1} من {QUESTIONS.length}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="question-text"
            >
              {q.text}
            </motion.div>
            <div className="options">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  className={`option ${selected ? (selected === opt ? 'selected' : '') : ''} ${showAnswer ? (opt === q.answer ? 'correct' : selected === opt ? 'wrong' : '') : ''}`}
                  onClick={() => handleAnswer(opt)}
                  disabled={showAnswer}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showAnswer && (
              <div className="answer-feedback">
                {selected === q.answer ? 'إجابة صحيحة! 🎉' : `الإجابة الصحيحة هي: ${q.answer}`}
              </div>
            )}
            <div className="question-actions">
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
    <section className="assessment-section" id="assessment">
      <div className="container">
        <SectionTitle title="النتيجة النهائية" />
        <div className="result-card">
          <div className="score">
            {score} من {QUESTIONS.length}
          </div>
          <p className="result-message">
            {score >= 4 ? 'ممتاز! أنت بطل الرياضيات 👑' : score >= 2 ? 'جيد جداً، قليل من التدريب ويصبح ممتازاً 🌟' : 'بداية جميلة، تابع التدريب وستتقدم 🌱'}
          </p>
          <div className="result-actions">
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
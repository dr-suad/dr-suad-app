import { useState } from 'react';
import { motion } from 'framer-motion';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { playSuccess } from '../../utils/sounds.js';

const QUESTIONS = [
  { words: 'خمسة ملايين وواحد', digits: '5,000,001' },
  { words: 'ثلاثة ملايين وأربعمائة وخمسة وخمسون ألفاً', digits: '3,450,000' },
  { words: 'ثمانية ملايين وستمائة وتسعة وعشرون ألفاً', digits: '8,609,020' },
  { words: 'أربعة ملايين وثلاثمائة وعشرون ألفاً', digits: '4,320,000' },
  { words: 'ستة ملايين وخمسة وعشرون ألفاً', digits: '6,025,000' },
  { words: 'عشرة ملايين وتسعة', digits: '10,000,009' },
  { words: 'واحد مليون واثنان مائة ألفاً', digits: '1,200,000' },
  { words: 'عشرة ملايين وثلاثمائة وتسع وسبعون ألفاً', digits: '10,370,000' },
  { words: 'سبعة ملايين واثنان مائة وتسعون ألفاً', digits: '7,200,090' },
  { words: 'خمسة ملايين وأربع مائة ألفاً', digits: '5,400,000' },
];

export default function MillionBank({ onClose }) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const q = QUESTIONS[idx];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === q.digits) {
      setScore((s) => s + 10);
      setSubmitted(true);
      playSuccess();
      setTimeout(() => {
        setIdx((i) => i + 1);
        setInput('');
        setSubmitted(false);
        setShowAnswer(false);
      }, 1200);
    } else {
      setShowAnswer(true);
    }
  };

  const isLast = idx >= QUESTIONS.length - 1;

  const renderResult = (title, emoji, msg, btnLabel, onBtn) => (
    <GameShell title="مصرف الملايين 🏦" value={`أفضل نتيجة: ${score}`} onClose={onClose}>
      <div className="resultBox">
        <motion.span className="resultEmoji" initial={{ scale: 0 }} animate={{ scale: 1 }}>{emoji}</motion.span>
        <h3 className="resultTitle">{title}</h3>
        <p className="resultMsg">{msg}</p>
        <GlowButton variant="coral" onClick={onBtn}>{btnLabel}</GlowButton>
      </div>
    </GameShell>
  );

  if (submitted) {
    return renderResult(
      'صحيح! 💰',
      '💰',
      `جمعت ${score} نقطة`,
      'السؤال التالي',
      () => { setIdx((i) => (i + 1 < QUESTIONS.length ? i + 1 : 0)); setInput(''); setSubmitted(false); setShowAnswer(false); }
    );
  }

  if (idx >= QUESTIONS.length) {
    return renderResult(
      '🌟 حظيت بفرصة درهمية!',
      '🏦',
      `أحصلت على ${score} من ${QUESTIONS.length * 10} نقطة`,
      'العب مرة أخرى',
      () => { setIdx(0); setInput(''); setSubmitted(false); setShowAnswer(false); }
    );
  }

  return (
    <GameShell title="مصرف الملايين 🏦" value="القراءة والكتابة" onClose={onClose}>
      <p className="questionText">{q.words}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
        <label style={{ fontWeight: '600' }}>الرقم بالأرقام:
          <input
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontFamily: 'Cairo, sans-serif', fontSize: '1.1rem', textAlign: 'right' }}
            placeholder="مثلاً: 3,450,000"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={submitted}
            autoFocus
          />
        </label>
        <button
          type="submit"
          disabled={submitted}
          style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#f97316', color: '#fff', fontWeight: '700', fontSize: '1.05rem', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          {submitted ? 'جاهز' : 'تحقق'}
        </button>
        {showAnswer && (
          <p style={{ color: '#dc2626', fontWeight: '700', textAlign: 'center', marginTop: '8px' }}>الإجابة الصحيحة: {q.digits}</p>
        )}
      </form>
    </GameShell>
  );
}

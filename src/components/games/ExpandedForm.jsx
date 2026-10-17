import { useState } from 'react';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { playSuccess, playError } from '../../utils/sounds.js';

const QUESTIONS = [
  { num: '3,450,000', options: ['3,000,000 + 400,000 + 50,000', '3,000,000 + 40,000 + 5,000', '300,000 + 40,000 + 5,000', '3,000,000 + 400,000 + 5,000'], answer: '3,000,000 + 400,000 + 50,000' },
  { num: '7,080,000', options: ['7,000,000 + 80,000', '7,000,000 + 8,000', '7,000,000 + 800,000', '7,000,000 + 8'], answer: '7,000,000 + 80,000' },
  { num: '2,003,005', options: ['2,000,000 + 3,000 + 5', '2,000,000 + 30,000 + 5', '2,000,000 + 3 + 5', '2,000,000 + 3,000 + 50'], answer: '2,000,000 + 3,000 + 5' },
  { num: '6,500,200', options: ['6,000,000 + 500,000 + 200', '6,000,000 + 50,000 + 200', '6,000,000 + 5,000 + 200', '6,000,000 + 500,000 + 2,000'], answer: '6,000,000 + 500,000 + 200' },
  { num: '9,000,000', options: ['9,000,000', '9,000,000 + 0', '9,000,000 + 0 + 0', '9,000,000 + 0'], answer: '9,000,000' },
  { num: '4,020,030', options: ['4,000,000 + 20,000 + 30', '4,000,000 + 2,000 + 30', '4,000,000 + 200 + 30', '4,000,000 + 20,000 + 3'], answer: '4,000,000 + 20,000 + 30' },
  { num: '8,700,000', options: ['8,000,000 + 700,000', '8,000,000 + 7,000', '8,000,000 + 70,000', '8,000,000 + 7'], answer: '8,000,000 + 700,000' },
  { num: '1,000,100', options: ['1,000,000 + 100', '1,000,000 + 10', '1,000,000 + 1', '1,000,000 + 100 + 0'], answer: '1,000,000 + 100' },
  { num: '5,300,400', options: ['5,000,000 + 300,000 + 400', '5,000,000 + 30,000 + 4,000', '5,000,000 + 3,000 + 400', '5,000,000 + 300 + 400'], answer: '5,000,000 + 300,000 + 400' },
  { num: '3,000,004', options: ['3,000,000 + 4', '3,000,000 + 40', '3,000,000 + 400', '3,000,004'], answer: '3,000,000 + 4' },
];

export default function ExpandedForm({ onClose }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const q = QUESTIONS[idx];

  const answer = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    setShowAnswer(true);
    const ok = opt === q.answer;
    if (ok) { setScore((s) => s + 10); playSuccess(); }
    else { playError(); }
  };

  const next = () => {
    if (idx < QUESTIONS.length - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setIdx(0); setSelected(null); setScore(0); setDone(false); setShowAnswer(false);
  };

  if (done) {
    return (
      <GameShell title="الصورة الموسعة 🧩" value={`أفضل نتيجة: ${score}`} onClose={onClose}>
        <div className="resultBox">
          <h3 className="resultTitle">🎉 👍</h3>
          <p className="resultMsg">أحصلت على {score} من 100 نقطة</p>
          <div className="scoreRow"><span className="scorePill">أفضل نتيجة: {score}</span></div>
          <GlowButton variant="coral" onClick={restart}>العب مرة أخرى</GlowButton>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell title="الصورة الموسعة 🧩" value="رياضيات الصف الرابع" onClose={onClose}>
      <div className="questionText">
        <p>أكتب الصورة الموسعة للعدد <strong>{q.num}</strong></p>
        <p style={{ fontSize: '1.2rem', color: '#16a34a' }}>{q.num}</p>
      </div>
      <div className="optionsGrid">
        {q.options.map((opt) => (
          <button
            key={opt}
            className={selected === opt && !done ? 'correct' : ''}
            onClick={() => answer(opt)}
            disabled={selected !== null}
            style={{ padding: '14px', borderRadius: '12px', border: '3px solid #e5e7eb', background: '#f9fafb', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', textAlign: 'center', lineHeight: '1.4' }}
          >
            {opt}
          </button>
        ))}
      </div>
      {showAnswer && (
        <p style={{ color: selected === q.answer ? '#16a34a' : '#dc2626', fontWeight: '700', marginTop: '10px' }}>
          {selected === q.answer ? '👏 إجابة صحيحة!' : `الإجابة الصحيحة: ${q.answer}`}
        </p>
      )}
      {showAnswer && !done && (
        <GlowButton variant="coral" onClick={next} style={{ marginTop: '12px' }}>{idx === QUESTIONS.length - 1 ? 'إنهاء' : 'السؤال التالي'}</GlowButton>
      )}
    </GameShell>
  );
}

import { useState } from 'react';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { playSuccess, playError } from '../../utils/sounds.js';

const QUESTIONS = [
  { num: '5,432,100', digit: '4', options: ['400,000', '40,000', '4,000', '400'], answer: '40,000' },
  { num: '7,823,405', digit: '8', options: ['800,000', '80,000', '8,000', '800'], answer: '800,000' },
  { num: '4,125,067', digit: '1', options: ['1,000,000', '100,000', '10,000', '1,000'], answer: '1,000,000' },
  { num: '9,000,000', digit: '9', options: ['9,000,000', '900,000', '90,000', '9,000'], answer: '9,000,000' },
  { num: '6,340,200', digit: '3', options: ['300,000', '30,000', '3,000', '300'], answer: '300,000' },
  { num: '2,567,890', digit: '5', options: ['500,000', '50,000', '5,000', '500'], answer: '500,000' },
  { num: '8,765,432', digit: '7', options: ['7,000,000', '700,000', '70,000', '7,000'], answer: '700,000' },
  { num: '3,004,050', digit: '4', options: ['4,000', '40,000', '400,000', '4'], answer: '4,000' },
  { num: '1,234,567', digit: '2', options: ['200,000', '20,000', '2,000', '200'], answer: '200,000' },
  { num: '5,678,901', digit: '6', options: ['60,000', '6,000', '600', '6'], answer: '60,000' },
];

export default function PlaceValue({ onClose }) {
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
      <GameShell title="القيمة المنزلية 🏠" value={`أفضل نتيجة: ${score}`} onClose={onClose}>
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
    <GameShell title="القيمة المنزلية 🏠" value="رياضيات الصف الرابع" onClose={onClose}>
      <div className="questionText">
        <p>أي رقم في العدد <strong>{q.num}</strong>؟</p>
        <p style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f97316' }}>{q.digit}</p>
      </div>
      <div className="optionsGrid">
        {q.options.map((opt) => (
          <button
            key={opt}
            className={`${selected === opt && !done ? 'correct' : ''}`}
            onClick={() => answer(opt)}
            disabled={selected !== null}
            style={{ padding: '14px', borderRadius: '12px', border: '3px solid #e5e7eb', background: '#f9fafb', fontWeight: '700', fontSize: '1.05rem', cursor: 'pointer', textAlign: 'center' }}
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

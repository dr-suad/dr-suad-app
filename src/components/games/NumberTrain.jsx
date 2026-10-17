import { useState } from 'react';
import GameShell from './GameShell.jsx';
import GlowButton from '../GlowButton.jsx';
import { playSuccess, playError } from '../../utils/sounds.js';

const QUESTIONS = [
  { type: 'compare', text: 'أيهما أكبر: 3,450,000 أم 3,540,000؟', options: ['3,450,000', '3,540,000'], answer: '3,540,000' },
  { type: 'compare', text: 'أيهما أكبر: 7,000,000 أم 6,999,999؟', options: ['7,000,000', '6,999,999'], answer: '7,000,000' },
  { type: 'compare', text: 'أيهما أكبر: 2,500,000 أم 2,050,000؟', options: ['2,500,000', '2,050,000'], answer: '2,500,000' },
  { type: 'compare', text: 'أيهما أكبر: 1,200,000 أم 1,200,001؟', options: ['1,200,000', '1,200,001'], answer: '1,200,001' },
  { type: 'compare', text: 'أيهما أصغر: 9,800,000 أم 9,800,001؟', options: ['9,800,000', '9,800,001'], answer: '9,800,000' },
  { type: 'order', text: 'رتب تصاعدياً: 1,200,000 / 3,400,000 / 2,100,000', options: ['1,200,000، 2,100,000، 3,400,000'], answer: '1,200,000، 2,100,000، 3,400,000' },
  { type: 'order', text: 'رتب تنازلياً: 4,000,000 / 4,500,000 / 4,100,000', options: ['4,500,000، 4,100,000، 4,000,000'], answer: '4,500,000، 4,100,000، 4,000,000' },
  { type: 'order', text: 'رتب تصاعدياً: 3,000,000 / 2,500,000 / 3,500,000', options: ['2,500,000، 3,000,000، 3,500,000'], answer: '2,500,000، 3,000,000، 3,500,000' },
  { type: 'order', text: 'رتب تنازلياً: 10,000,000 / 9,000,000 / 8,000,000', options: ['10,000,000، 9,000,000، 8,000,000'], answer: '10,000,000، 9,000,000، 8,000,000' },
  { type: 'order', text: 'رتب تصاعدياً: 5,000,000 / 5,100,000 / 5,010,000', options: ['5,000,000، 5,010,000، 5,100,000'], answer: '5,000,000، 5,010,000، 5,100,000' },
];

export default function NumberTrain({ onClose }) {
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
      <GameShell title="قطار الأعداد 🚂" value={`أفضل نتيجة: ${score}`} onClose={onClose}>
        <div className="resultBox">
          <h3 className="resultTitle">🚂 اكتملت رحلة الأعداد!</h3>
          <p className="resultMsg">أحصلت على {score} من 100 نقطة</p>
          <div className="scoreRow"><span className="scorePill">أفضل نتيجة: {score}</span></div>
          <GlowButton variant="coral" onClick={restart}>العب مرة أخرى</GlowButton>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell title="قطار الأعداد 🚂" value="مقارنة وترتيب" onClose={onClose}>
      {q.type === 'compare' ? (
        <>
          <p className="questionText">{q.text}</p>
          <div className="optionsGrid">
            {q.options.map((opt) => (
              <button
                key={opt}
                className={selected === opt && !done ? 'correct' : ''}
                onClick={() => answer(opt)}
                disabled={selected !== null}
                style={{ padding: '14px', borderRadius: '12px', border: '3px solid #e5e7eb', background: '#f9fafb', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', textAlign: 'center' }}
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
        </>
      ) : (
        <>
          <p className="questionText">{q.text}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '1rem' }}>
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                className={selected === opt && !done ? 'correct' : ''}
                onClick={() => answer(opt)}
                disabled={selected !== null}
                style={{ padding: '12px 20px', borderRadius: '12px', border: '3px solid #e5e7eb', background: '#f9fafb', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}
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
        </>
      )}
    </GameShell>
  );
}

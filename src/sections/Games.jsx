import SectionTitle from '../components/SectionTitle';

export default function Games() {
  return (
    <section className="games-section" id="games">
      <div className="container">
        <SectionTitle title="الألعاب التعليمية" />
        <div className="games-grid">
          <div className="game-category">
            <h3>ألعاب تفاعلية</h3>
            <p>ألعاب رقمية على الحاسوب أو الجهاز اللوحي</p>
            <div className="game-chips">
              {['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع'].map((g, i) => (
                <button key={i} className="chip" style={{ borderColor: '#FF6B6B' }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="game-category">
            <h3>ألعاب حركية</h3>
            <p>أنشطة حركية تربط الرياضيات بالحركة واللعب</p>
            <div className="game-chips">
              {['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع'].map((g, i) => (
                <button key={i} className="chip" style={{ borderColor: '#6BCB77' }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
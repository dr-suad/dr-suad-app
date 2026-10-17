import SectionTitle from '../components/SectionTitle.jsx';
import styles from '../App.module.css';

export default function Videos() {
  return (
    <section className="videos-section" id="videos">
      <div className="container">
        <SectionTitle title="الفيديوهات التعليمية" />
        <div className={styles.videosGrid}>
          {[
            { title: 'الأعداد من 1 إلى 9', duration: '٠٥:٣٠', desc: 'تعرّف على الأعداد بطريقة مصورة وممتعة.', color: '#FF6B6B' },
            { title: 'الجمع والطرح', duration: '٠٦:١٥', desc: 'خطوات بسيطة لحل مسائل الجمع والطرح.', color: '#FFD93D' },
            { title: 'مفهوم الضرب', duration: '٠٧:٤٠', desc: 'نفهم الضرب على أنه جمع متكرر.', color: '#6BCB77' },
            { title: 'الكسور', duration: '٠٨:٠٥', desc: 'نتعلم الكسور بتقسيم الأشياء.', color: '#4D96FF' },
            { title: 'وحدات القياس', duration: '٠٦:٥٠', desc: 'نقيس الطول والوزن في حياتنا اليومية.', color: '#FF9F68' },
            { title: 'المحيط والمساحة', duration: '٠٩:١٠', desc: 'كيف نحسب محيط الأشكال ومساحتها.', color: '#FFD93D' },
          ].map((video, i) => (
            <div key={i} className={styles.videoCard} style={{ borderTop: `6px solid ${video.color}` }}>
              <div className={styles.videoThumb}>
                <span className={styles.play}>▶</span>
                <span className={styles.duration}>{video.duration}</span>
              </div>
              <h3>{video.title}</h3>
              <p>{video.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
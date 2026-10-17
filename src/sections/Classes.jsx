import { motion } from 'framer-motion';
import ClassCard from '../components/ClassCard';
import SectionTitle from '../components/SectionTitle';

export default function Classes() {
  return (
    <section className="classes-section" id="classes">
      <div className="container">
        <SectionTitle title="الصفوف الدراسية" />
        <div className="classes-grid">
          {[
            { id: 1, name: 'الصف الأول', color: '#FF6B6B', emoji: '🧮', description: 'الأعداد من 1 إلى 9، المقارنة، الجمع والطرح ضمن 9' },
            { id: 2, name: 'الصف الثاني', color: '#FFD93D', emoji: '🔢', description: 'الأعداد ضمن 99، الجمع والطرح، مفهوم الضرب والقسمة' },
            { id: 3, name: 'الصف الثالث', color: '#6BCB77', emoji: '➗', description: 'الكسور، القسمة، المسائل الحياتية، وحدات القياس' },
            { id: 4, name: 'الصف الرابع', color: '#4D96FF', emoji: '📐', description: 'ضرب الأعداد، الكسور العشرية، المحيط والمساحة، تنظيم البيانات' },
          ].map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              className="class-card"
              style={{ borderTop: `6px solid ${item.color}` }}
            >
              <div className="card-header">
                <span className="emoji" style={{ fontSize: '2rem' }}>
                  {item.emoji}
                </span>
                <span className="number" style={{ background: item.color }}>
                  {item.id}
                </span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
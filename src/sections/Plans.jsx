import SectionTitle from '../components/SectionTitle.jsx';
import styles from '../App.module.css';

export default function Plans() {
  return (
    <section className="plans-section" id="plans">
      <div className="container">
        <SectionTitle title="الخطط الفصلية" />
        <div className={styles.plansGrid}>
          {[
            {
              title: 'خطة الصف الأول — الفصل الدراسي الأول',
              summary: 'مخطط لهيكلة الدروس والنشاطات في الفصل الأول: تعرف على الأعداد، الجمع والطرح.',
            },
            {
              title: 'خطة الصف الثاني — الفصل الدراسي الأول',
              summary: 'مواضيع الجمع والطرح والضرب في حدود 99.',
            },
            {
              title: 'خطة الصف الثالث — الفصل الدراسي الأول',
              summary: 'الكسور، القسمة، المسائل الحياتية، وحدات القياس.',
            },
            {
              title: 'خطة الصف الرابع — الفصل الدراسي الأول',
              summary: 'أعداد، كسور، محيط ومساحة، تنظيم البيانات.',
            },
          ].map((plan, i) => (
            <div key={i} className={styles.planCard} style={{ borderTop: `6px solid var(--mint)` }}>
              <h3>{plan.title}</h3>
              <p className={styles.planSummary}>{plan.summary}</p>
              <button className={styles.soonBtn}>عرض الخطة</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
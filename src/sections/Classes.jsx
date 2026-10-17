import content from '../data/content.json';
import ClassCard from '../components/ClassCard.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import styles from '../App.module.css';

export default function Classes({ showToast }) {
  return (
    <section className="section" id="classes">
      <div className="container">
        <SectionTitle>الصفوف الدراسية</SectionTitle>
        <div className={styles.classesGrid}>
          {content.classes.map((cls, i) => (
            <ClassCard key={cls.id} classItem={cls} />
          ))}
        </div>
      </div>
    </section>
  );
}
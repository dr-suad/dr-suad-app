import styles from '../App.module.css';

export default function About() {
  return (
    <section className={styles.aboutCard} id="about">
      <div className="container">
        <div className={styles.avatar}>👩🏫</div>
        <h2>د. سعاد قريني</h2>
        <p>معلمة رياضيات متخصصة في المرحلة الأساسية الدنيا، تتبع المنهاج الفلسطيني المعتمد.</p>
        <p>طريقة تعليمي مختلطة: شرح للمفاهيم مع تمارين تفاعلية، ألعاب حركية، فيديوهات قصيرة، ومتابعة مستمرة لكل طالب.</p>
      </div>
    </section>
  );
}
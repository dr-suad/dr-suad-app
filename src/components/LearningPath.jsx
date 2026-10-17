import { motion } from 'framer-motion';
import { useMascot } from '../context/MascotContext.jsx';
import { useProgress } from '../hooks/useProgress.js';
import { playCelebration } from '../utils/sounds.js';
import styles from './LearningPath.module.css';

const LESSONS = [
  { id: 'c1-l1', title: 'الأعداد 1-3', classId: 1 },
  { id: 'c1-l2', title: 'الأعداد 4-6', classId: 1 },
  { id: 'c1-l3', title: 'الأعداد 7-9', classId: 1 },
  { id: 'c1-l4', title: 'المقارنة', classId: 1 },
  { id: 'c1-l5', title: 'الجمع ضمن 9', classId: 1 },
  { id: 'c1-l6', title: 'الطرح ضمن 9', classId: 1 },
  { id: 'c2-l1', title: 'الأعداد ضمن 99', classId: 2 },
  { id: 'c2-l2', title: 'الجمع والطرح', classId: 2 },
  { id: 'c2-l3', title: 'مفهوم الضرب', classId: 2 },
  { id: 'c2-l4', title: 'مفهوم القسمة', classId: 2 },
];

export default function LearningPath({ showToast }) {
  const { completeLesson, isLessonCompleted, getCompletedCount } = useProgress();
  const { say } = useMascot();

  const handleComplete = (lessonId) => {
    if (isLessonCompleted(lessonId)) return;
    completeLesson(lessonId);
    playCelebration();
    const count = getCompletedCount() + 1;
    say(`تم إكمال الدرس! إجمالي ${count} درساً مكتملاً 🎉`);
    if (showToast) showToast(`تم إكمال الدرس بنجاح! 🎉`, 'success');
  };

  return (
    <section className={styles.pathSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>خريطة التعلم</h2>
        <div className={styles.path}>
          {LESSONS.map((lesson, i) => {
            const completed = isLessonCompleted(lesson.id);
            return (
              <motion.div
                key={lesson.id}
                className={styles.lessonItem}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className={`${styles.lessonCircle} ${completed ? styles.completed : ''}`}
                  onClick={() => handleComplete(lesson.id)}
                  role="button"
                  tabIndex={0}
                  title={lesson.title}
                  animate={completed ? { scale: [1, 1.25, 1] } : {}}
                  transition={{ duration: 0.45 }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {completed ? '✅' : '🔒'}
                </motion.div>
                <span className={styles.lessonTitle}>{lesson.title}</span>
              </motion.div>
            );
          })}
        </div>
        <div className={styles.progress}>
          تم إكمال {getCompletedCount()} من {LESSONS.length} درساً
        </div>
      </div>
    </section>
  );
}
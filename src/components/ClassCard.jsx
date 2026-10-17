import { motion } from 'framer-motion';

export default function ClassCard({ classItem }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="class-card"
      style={{ borderTop: `6px solid ${classItem.color}` }}
    >
      <div className="card-header">
        <span className="emoji" style={{ fontSize: '2rem' }}>
          {classItem.emoji}
        </span>
        <span className="number" style={{ background: classItem.color }}>
          {classItem.id}
        </span>
      </div>
      <h3>{classItem.name}</h3>
      <p>{classItem.description}</p>
    </motion.div>
  );
}
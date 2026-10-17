import styles from './FloatingShapes.module.css';

const shapes = [
  { emoji: '➕', className: 'shape1' },
  { emoji: '➖', className: 'shape2' },
  { emoji: '✖️', className: 'shape3' },
  { emoji: '➗', className: 'shape4' },
  { emoji: '🔢', className: 'shape5' },
  { emoji: '🔺', className: 'shape6' },
  { emoji: '🔵', className: 'shape7' },
  { emoji: '⭐', className: 'shape8' },
];

export default function FloatingShapes() {
  return (
    <div className={styles.floatingShapes} aria-hidden="true">
      {shapes.map((shape, i) => (
        <span
          key={i}
          className={`${styles.shape} ${styles[shape.className]}`}
        >
          {shape.emoji}
        </span>
      ))}
    </div>
  );
}
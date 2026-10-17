import { useMascot } from '../context/MascotContext.jsx';
import { useProgress } from '../hooks/useProgress.js';
import styles from './AchievementTree.module.css';

const TREE_LEVELS = [
  { min: 0, emoji: '🌱', label: 'بذرة' },
  { min: 5, emoji: '🌿', label: 'نبتة' },
  { min: 10, emoji: '🌳', label: 'شجرة' },
  { min: 15, emoji: '🌳🌸', label: 'شجرة + زهور' },
  { min: 20, emoji: '🌳🍎', label: 'شجرة + ثمار' },
];

export default function AchievementTree({ showToast }) {
  const { getCompletedCount } = useProgress();
  const { say } = useMascot();

  const count = getCompletedCount();
  const level = TREE_LEVELS
    .slice()
    .reverse()
    .find((l) => count >= l.min) || TREE_LEVELS[0];

  const handleClick = () => {
    say(`أكملت ${count} درساً! استمر يا بطل! 🌟`);
    if (showToast) showToast(`أكملت ${count} درساً! استمر يا بطل! 🌟`, 'success');
  };

  return (
    <section className={styles.treeSection}>
      <div className={styles.treeContainer}>
        <div className={styles.tree} onClick={handleClick} role="button" tabIndex={0}>
          <span className={styles.treeEmoji}>{level.emoji}</span>
          <span className={styles.treeLabel}>{level.label}</span>
        </div>
        <div className={styles.progressText}>
          {count} درساً مكتملاً من 20
        </div>
      </div>
    </section>
  );
}
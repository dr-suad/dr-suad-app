import { motion } from 'framer-motion';

export default function Toast({ toast, onClose }) {
  if (!toast.open) return null;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`toast toast-${toast.type}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {toast.message}
    </motion.div>
  );
}
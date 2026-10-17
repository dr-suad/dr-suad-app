import { motion } from 'framer-motion';

export default function FloatingShapes() {
  const shapes = [
    { color: '#FF6B6B', size: '80px', top: '10%', left: '10%', delay: '0s' },
    { color: '#FFD93D', size: '120px', top: '20%', right: '15%', delay: '2s' },
    { color: '#6BCB77', size: '60px', bottom: '20%', left: '20%', delay: '4s' },
    { color: '#4D96FF', size: '100px', bottom: '10%', right: '10%', delay: '1s' },
    { color: '#B983FF', size: '70px', top: '40%', left: '5%', delay: '3s' },
    { color: '#FF9F68', size: '90px', top: '60%', right: '20%', delay: '5s' },
  ];

  return (
    <div className="floating-shapes">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="floating-shape"
          style={{
            backgroundColor: shape.color,
            width: shape.size,
            height: shape.size,
            top: shape.top,
            bottom: shape.bottom,
            left: shape.left,
            right: shape.right,
            animationDelay: shape.delay,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
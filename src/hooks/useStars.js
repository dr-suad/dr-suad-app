import { useState, useEffect } from 'react';

const BADGES = [
  { threshold: 5, name: 'مبتدئ', emoji: '🌱' },
  { threshold: 15, name: 'مجتهد', emoji: '⭐' },
  { threshold: 30, name: 'متميز', emoji: '🏆' },
  { threshold: 50, name: 'بطل الرياضيات', emoji: '👑' },
];

export function useStars() {
  const [stars, setStars] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('suad:progress'))?.stars || 0;
    } catch {
      return 0;
    }
  });
  const [badges, setBadges] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('suad:progress'))?.badges || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('suad:progress', JSON.stringify({ stars, badges }));
    } catch {}
  }, [stars, badges]);

  const addStars = (amount = 1) => {
    setStars((prev) => {
      const newStars = prev + amount;
      const earned = BADGES.filter((b) => newStars >= b.threshold && !badges.includes(b.name));
      if (earned.length > 0) {
        setBadges((prevBadges) => [...prevBadges, ...earned.map((b) => b.name)]);
      }
      return newStars;
    });
  };

  const resetProgress = () => {
    setStars(0);
    setBadges([]);
    try {
      localStorage.removeItem('suad:progress');
    } catch {}
  };

  const currentBadge = BADGES.find((b) => stars >= b.threshold);

  return { stars, badges, addStars, resetProgress, currentBadge };
}
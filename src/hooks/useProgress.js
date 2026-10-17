import { useState, useEffect, useCallback } from 'react';

export function useProgress() {
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('suad:lessons')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('suad:lessons', JSON.stringify(completedLessons));
    } catch {}
  }, [completedLessons]);

  const completeLesson = useCallback((lessonId) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      return [...prev, lessonId];
    });
  }, []);

  const isLessonCompleted = useCallback((lessonId) => {
    return completedLessons.includes(lessonId);
  }, [completedLessons]);

  const getCompletedCount = useCallback(() => {
    return completedLessons.length;
  }, [completedLessons]);

  return {
    completedLessons,
    completeLesson,
    isLessonCompleted,
    getCompletedCount,
  };
}
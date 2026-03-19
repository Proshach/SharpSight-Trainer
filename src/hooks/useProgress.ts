import { useState, useEffect } from 'react';

export interface UserProgress {
  sessions: number;
  points: number;
  streak: number;
  lastDone: string | null;
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('eyeProgress_v2');
    if (saved) return JSON.parse(saved);
    return { sessions: 0, points: 0, streak: 0, lastDone: null };
  });

  useEffect(() => {
    localStorage.setItem('eyeProgress_v2', JSON.stringify(progress));
  }, [progress]);

  const awardPoints = (pts: number) => {
    const today = new Date().toDateString();
    setProgress(prev => {
      let newStreak = prev.streak;
      if (prev.lastDone !== today) {
        if (prev.lastDone) {
          const lastDate = new Date(prev.lastDone);
          const diff = Math.round((new Date(today).getTime() - lastDate.getTime()) / 86400000);
          newStreak = diff === 1 ? prev.streak + 1 : 1;
        } else {
          newStreak = 1;
        }
      }
      return {
        ...prev,
        sessions: prev.sessions + 1,
        points: prev.points + pts,
        streak: newStreak,
        lastDone: today
      };
    });
  };

  return { progress, awardPoints };
}

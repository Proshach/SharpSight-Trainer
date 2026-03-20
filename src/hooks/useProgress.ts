import { useState, useEffect } from 'react';

export interface SoundSettings {
  type: 'beep' | 'chime' | 'bell' | 'custom';
  customUrl?: string;
}

export interface UserProgress {
  sessions: number;
  points: number;
  streak: number;
  lastDone: string | null;
  badges: string[];
  shares: number;
  installs: number;
  soundSettings: SoundSettings;
  language: string;
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('eyeProgress_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.badges) parsed.badges = [];
      if (parsed.shares === undefined) parsed.shares = 0;
      if (parsed.installs === undefined) parsed.installs = 0;
      if (!parsed.soundSettings) parsed.soundSettings = { type: 'beep' };
      if (!parsed.language) parsed.language = 'en';
      return parsed;
    }
    return { 
      sessions: 0, 
      points: 0, 
      streak: 0, 
      lastDone: null, 
      badges: [], 
      shares: 0, 
      installs: 0,
      soundSettings: { type: 'beep' },
      language: 'en'
    };
  });

  useEffect(() => {
    localStorage.setItem('eyeProgress_v2', JSON.stringify(progress));
  }, [progress]);

  const updateSoundSettings = (settings: SoundSettings) => {
    setProgress(prev => ({ ...prev, soundSettings: settings }));
  };

  const setLanguage = (lang: string) => {
    setProgress(prev => ({ ...prev, language: lang }));
  };

  const incrementShares = () => {
    setProgress(prev => ({ ...prev, shares: prev.shares + 1 }));
  };

  const incrementInstalls = () => {
    setProgress(prev => ({ ...prev, installs: prev.installs + 1 }));
  };

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

      const newBadges = [...prev.badges];
      if (newStreak >= 7 && !newBadges.includes('7-day')) newBadges.push('7-day');
      if (newStreak >= 30 && !newBadges.includes('30-day')) newBadges.push('30-day');
      if (newStreak >= 90 && !newBadges.includes('90-day')) newBadges.push('90-day');

      return {
        ...prev,
        sessions: prev.sessions + 1,
        points: prev.points + pts,
        streak: newStreak,
        lastDone: today,
        badges: newBadges
      };
    });
  };

  return { progress, awardPoints, incrementShares, incrementInstalls, updateSoundSettings, setLanguage };
}

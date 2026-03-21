import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Timer, 
  Telescope, 
  Infinity as InfinityIcon, 
  Zap, 
  Flame, 
  Trophy, 
  Moon, 
  Sun, 
  Play, 
  Square, 
  Pause, 
  CheckCircle2,
  Lightbulb,
  Thermometer,
  MoonStar,
  Info,
  Medal,
  Award,
  ShieldCheck,
  Star,
  Share2,
  Download,
  Settings,
  Volume2,
  Music,
  Upload,
  Globe,
  Home,
  ArrowLeft,
  ChevronRight,
  Wind
} from 'lucide-react';
import { useProgress } from './hooks/useProgress';
import { translations } from './i18n';

type TabType = '2020' | 'nearfar' | 'fig8' | 'colorblind' | 'astigmatism' | 'illusion' | 'zigzag';

interface Exercise {
  id: TabType;
  icon: React.ReactNode;
  label: string;
  title: string;
  desc: string;
  steps: string[];
  color: string;
  points: number;
}

export default function App() {
  const { progress, awardPoints, incrementShares, incrementInstalls, updateSoundSettings, setLanguage } = useProgress();
  const [activeTab, setActiveTab] = useState<TabType | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [notif, setNotif] = useState<{ msg: string; icon: React.ReactNode } | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  const t = translations[progress.language] || translations.en;
  const isRTL = progress.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = progress.language;
  }, [progress.language, isRTL]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      incrementInstalls();
      showNotif(t.notifInstalled, <Download size={18} />);
    });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [incrementInstalls]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: t.title,
      text: t.heroDesc,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        incrementShares();
        showNotif(t.notifShared, <Share2 size={18} />);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        incrementShares();
        showNotif(t.notifCopied, <Share2 size={18} />);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const showNotif = (msg: string, icon: React.ReactNode) => {
    setNotif({ msg, icon });
    setTimeout(() => setNotif(null), 3000);
  };

  const playAlert = useCallback((freq = 520, dur = 0.18) => {
    try {
      const { type, customUrl } = progress.soundSettings;

      if (type === 'custom' && customUrl) {
        const audio = new Audio(customUrl);
        audio.play().catch(() => {
          // Fallback to beep if custom fails
          playBeep(freq, dur);
        });
        return;
      }

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const g = ctx.createGain();
      const o = ctx.createOscillator();
      
      if (type === 'chime') {
        o.type = 'sine';
        o.frequency.setValueAtTime(880, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
        g.gain.setValueAtTime(0.3, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.5);
      } else if (type === 'bell') {
        o.type = 'triangle';
        o.frequency.setValueAtTime(1200, ctx.currentTime);
        g.gain.setValueAtTime(0.2, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 1.0);
      } else {
        // Default beep
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.3, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + dur);
      }
    } catch (e) {}
    if ('vibrate' in navigator) navigator.vibrate(150);
  }, [progress.soundSettings]);

  const playBeep = (freq: number, dur: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const g = ctx.createGain();
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  const exercises: Exercise[] = [
    {
      id: '2020',
      icon: <Timer size={24} />,
      label: t.ex01Label,
      title: t.ex01Title,
      desc: t.ex01Desc,
      steps: t.ex01Steps,
      color: 'from-accent to-accent-2',
      points: 10
    },
    {
      id: 'nearfar',
      icon: <Telescope size={24} />,
      label: t.ex02Label,
      title: t.ex02Title,
      desc: t.ex02Desc,
      steps: t.ex02Steps,
      color: 'from-accent-2 to-purple-500',
      points: 15
    },
    {
      id: 'fig8',
      icon: <InfinityIcon size={24} />,
      label: t.ex03Label,
      title: t.ex03Title,
      desc: t.ex03Desc,
      steps: t.ex03Steps,
      color: 'from-accent-3 to-emerald-600',
      points: 20
    },
    {
      id: 'colorblind',
      icon: <Eye size={24} />,
      label: t.ex04Label,
      title: t.ex04Title,
      desc: t.ex04Desc,
      steps: t.ex04Steps,
      color: 'from-orange-400 to-red-500',
      points: 25
    },
    {
      id: 'astigmatism',
      icon: <Zap size={24} />,
      label: t.ex05Label,
      title: t.ex05Title,
      desc: t.ex05Desc,
      steps: t.ex05Steps,
      color: 'from-blue-400 to-indigo-600',
      points: 25
    },
    {
      id: 'illusion',
      icon: <Wind size={24} />,
      label: t.ex06Label,
      title: t.ex06Title,
      desc: t.ex06Desc,
      steps: t.ex06Steps,
      color: 'from-pink-500 to-rose-600',
      points: 20
    },
    {
      id: 'zigzag',
      icon: <Zap size={24} />,
      label: t.ex07Label,
      title: t.ex07Title,
      desc: t.ex07Desc,
      steps: t.ex07Steps,
      color: 'from-yellow-400 to-orange-500',
      points: 20
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-bg-deep text-text-hi' : 'bg-[#f0f2fb] text-[#0d0f1a] light'}`}>
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[60%] h-[40%] bg-accent/10 blur-[100px] rounded-full -translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-accent-2/10 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[40%] h-[60%] bg-accent-3/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <AnimatePresence>
        {notif && (
          <motion.div 
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 20, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            className="fixed top-0 left-1/2 z-50 bg-bg-card border border-white/10 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap"
          >
            <span className="text-accent">{notif.icon}</span>
            <span className="font-medium text-sm">{notif.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-2 rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <Eye size={22} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight font-head">
              Eye<span className="text-accent">Train</span> 2.0
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowLanguage(true)}
              className="w-10 h-10 bg-bg-card border border-white/5 rounded-xl flex items-center justify-center hover:bg-bg-mid transition-all active:scale-90"
            >
              <Globe size={18} className="text-text-lo" />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 bg-bg-card border border-white/5 rounded-xl flex items-center justify-center hover:bg-bg-mid transition-all active:scale-90"
            >
              <Settings size={18} className="text-text-lo" />
            </button>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 bg-bg-card border border-white/5 rounded-xl flex items-center justify-center hover:bg-bg-mid transition-all active:scale-90"
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-accent" />}
            </button>
          </div>
        </header>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSettings(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-bg-card border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6"
              >
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                      <Volume2 size={18} />
                    </div>
                    <h3 className="text-lg font-bold">{t.soundSettings}</h3>
                  </div>
                  <button onClick={() => setShowSettings(false)} className="text-text-lo hover:text-text-hi">
                    <Square size={18} />
                  </button>
                </header>

                <div className="space-y-4">
                  <p className="text-xs text-text-lo uppercase tracking-widest font-bold">{t.alertSound}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['beep', 'chime', 'bell'] as const).map(sound => (
                      <button 
                        key={sound}
                        onClick={() => {
                          updateSoundSettings({ type: sound });
                          setTimeout(() => playAlert(), 100);
                        }}
                        className={`px-4 py-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                          progress.soundSettings.type === sound 
                            ? 'bg-accent/10 border-accent text-accent' 
                            : 'bg-bg-mid border-white/5 text-text-lo hover:border-white/20'
                        }`}
                      >
                        {t[sound]}
                      </button>
                    ))}
                    <button 
                      onClick={() => {
                        const url = prompt('Enter custom sound URL (mp3/wav):', progress.soundSettings.customUrl || '');
                        if (url !== null) {
                          updateSoundSettings({ type: 'custom', customUrl: url });
                        }
                      }}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium capitalize transition-all flex items-center justify-center gap-2 ${
                        progress.soundSettings.type === 'custom' 
                          ? 'bg-accent/10 border-accent text-accent' 
                          : 'bg-bg-mid border-white/5 text-text-lo hover:border-white/20'
                      }`}
                    >
                      <Music size={14} /> {t.custom}
                    </button>
                  </div>

                  {progress.soundSettings.type === 'custom' && progress.soundSettings.customUrl && (
                    <div className="text-[10px] text-text-lo break-all bg-bg-mid p-2 rounded-lg border border-white/5">
                      URL: {progress.soundSettings.customUrl}
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5">
                    <button 
                      onClick={() => playAlert()}
                      className="w-full bg-accent text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <Volume2 size={16} /> {t.testSound}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Language Modal */}
        <AnimatePresence>
          {showLanguage && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLanguage(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-bg-card border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6"
              >
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                      <Globe size={18} />
                    </div>
                    <h3 className="text-lg font-bold">{t.language}</h3>
                  </div>
                  <button onClick={() => setShowLanguage(false)} className="text-text-lo hover:text-text-hi">
                    <Square size={18} />
                  </button>
                </header>

                <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'es', label: 'Español' },
                    { id: 'fr', label: 'Français' },
                    { id: 'de', label: 'Deutsch' },
                    { id: 'ja', label: '日本語' },
                    { id: 'pt', label: 'Português' },
                    { id: 'it', label: 'Italiano' },
                    { id: 'zh', label: '简体中文' },
                    { id: 'ko', label: '한국어' },
                    { id: 'ar', label: 'العربية' },
                    { id: 'ru', label: 'Русский' }
                  ].map(lang => (
                    <button 
                      key={lang.id}
                      onClick={() => {
                        setLanguage(lang.id);
                        setShowLanguage(false);
                      }}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                        progress.language === lang.id 
                          ? 'bg-accent/10 border-accent text-accent' 
                          : 'bg-bg-mid border-white/5 text-text-lo hover:border-white/20'
                      }`}
                      dir={lang.id === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {lang.label}
                      {progress.language === lang.id && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            {t.subtitle}
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">
            {t.heroTitle}<br/>
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">{t.heroAccent}</span>
          </h2>
          <p className="text-text-lo max-w-md mx-auto text-sm md:text-base leading-relaxed">
            {t.heroDesc}
          </p>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard value={progress.sessions} label={t.sessions} icon={<Zap size={14} className="text-accent" />} />
          <StatCard value={`${progress.streak}🔥`} label={t.streak} icon={<Flame size={14} className="text-orange-500" />} />
          <StatCard value={progress.points} label={t.points} icon={<Trophy size={14} className="text-accent-3" />} />
          <StatCard value={progress.installs} label={t.downloads} icon={<Download size={14} className="text-blue-400" />} />
          <StatCard value={progress.shares} label={t.shared} icon={<Share2 size={14} className="text-purple-400" />} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-bg-card border border-white/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-bg-mid transition-all"
          >
            <Share2 size={14} className="text-purple-400" /> {t.shareApp}
          </button>
          {deferredPrompt && (
            <button 
              onClick={handleInstall}
              className="flex items-center gap-2 bg-bg-card border border-white/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-bg-mid transition-all"
            >
              <Download size={14} className="text-blue-400" /> {t.installApp}
            </button>
          )}
        </div>

        {/* Badges */}
        <AnimatePresence>
          {progress.badges.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-bg-card border border-white/5 rounded-2xl p-4 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-3">
                <Medal size={16} className="text-accent" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-lo">{t.earnedBadges}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {progress.badges.map(badge => (
                  <BadgeItem key={badge} type={badge as any} t={t} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Exercise Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((ex) => (
            <motion.div
              key={ex.id}
              whileHover={{ y: -5 }}
              className="bg-bg-card border border-white/5 rounded-[2.5rem] p-8 text-left group relative overflow-hidden shadow-2xl flex flex-col h-full"
            >
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${ex.color} opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10 flex-1 space-y-6">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 bg-gradient-to-br ${ex.color} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-accent/20`}>
                    {ex.icon}
                  </div>
                  <div className="bg-accent-3/10 text-accent-3 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-accent-3/20">
                    +{ex.points} PTS
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">{ex.label}</div>
                  <h3 className="text-2xl font-extrabold tracking-tight mb-3">{ex.title}</h3>
                  <p className="text-text-lo text-sm leading-relaxed line-clamp-3">{ex.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button 
                    onClick={() => setActiveTab(ex.id)}
                    className={`w-full bg-gradient-to-r ${ex.color} text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent/20`}
                  >
                    <Play size={18} fill="currentColor" />
                    {t.startFocus || 'Play Activity'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Fullscreen Exercise Overlay */}
        <AnimatePresence>
          {activeTab && (
            <FullscreenActivity 
              exercise={exercises.find(e => e.id === activeTab)!}
              onClose={() => setActiveTab(null)}
              t={t}
              awardPoints={awardPoints}
              showNotif={showNotif}
              playAlert={playAlert}
            />
          )}
        </AnimatePresence>

        {/* Tips */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TipCard icon={<Lightbulb />} title={t.tip1Title} text={t.tip1Desc} />
          <TipCard icon={<Thermometer />} title={t.tip2Title} text={t.tip2Desc} />
          <TipCard icon={<MoonStar />} title={t.tip3Title} text={t.tip3Desc} />
        </section>
      </main>
    </div>
  );
}

function FullscreenActivity({ 
  exercise, 
  onClose, 
  t, 
  awardPoints, 
  showNotif, 
  playAlert 
}: { 
  exercise: Exercise; 
  onClose: () => void; 
  t: any; 
  awardPoints: (p: number) => void; 
  showNotif: (m: string, i: React.ReactNode) => void;
  playAlert: (f?: number, d?: number) => void;
}) {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-bg-deep flex flex-col overflow-hidden"
    >
      {/* Header - Hidden when started for minimalist feel */}
      {!isStarted && (
        <header className="flex items-center justify-between p-6 md:px-12 border-b border-white/5 bg-bg-card/30 backdrop-blur-md">
          <button 
            onClick={onClose}
            className="flex items-center gap-3 text-text-lo hover:text-text-hi transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-bg-card border border-white/5 flex items-center justify-center group-hover:bg-bg-mid">
              <ArrowLeft size={20} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">{t.home || 'Home'}</span>
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 bg-gradient-to-br ${exercise.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              {exercise.icon}
            </div>
            <h2 className="text-xl font-bold tracking-tight">{exercise.title}</h2>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {!isStarted ? (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl w-full space-y-10 text-center"
            >
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent">{exercise.label}</div>
                <h3 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{exercise.title}</h3>
                <p className="text-text-mid text-lg leading-relaxed">{exercise.desc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {exercise.steps.map((step, i) => (
                  <div key={i} className="bg-bg-card/50 border border-white/5 p-4 rounded-2xl flex gap-4 items-start">
                    <span className="w-6 h-6 min-w-[24px] bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold font-mono">
                      {i + 1}
                    </span>
                    <p className="text-sm text-text-mid leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex flex-col items-center gap-4">
                <button 
                  onClick={() => setIsStarted(true)}
                  className={`bg-gradient-to-r ${exercise.color} text-white px-12 py-5 rounded-[2rem] font-bold text-lg flex items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-accent/20`}
                >
                  <Play size={24} fill="currentColor" />
                  {t.startFocus || 'Start Activity'}
                </button>
                <div className="flex items-center gap-2 text-text-lo text-xs">
                  <Info size={14} />
                  <span>Tip: Rotate device horizontally for better experience</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="activity"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              {/* Minimalist Close Button */}
              <button 
                onClick={() => setIsStarted(false)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-lo transition-all z-[210]"
              >
                <ArrowLeft size={24} />
              </button>

              <div className="w-full max-w-4xl">
                {exercise.id === '2020' && (
                  <Timer2020 onComplete={() => {
                    awardPoints(10);
                    showNotif(t.notifComplete.replace('{pts}', '10'), <CheckCircle2 size={18} />);
                    playAlert();
                    setIsStarted(false);
                  }} playAlert={playAlert} t={t} autoStart={true} minimalist={true} />
                )}
                {exercise.id === 'nearfar' && (
                  <NearFarExercise onComplete={() => {
                    awardPoints(15);
                    showNotif(t.notifNearFar, <CheckCircle2 size={18} />);
                    playAlert();
                    setIsStarted(false);
                  }} t={t} autoStart={true} minimalist={true} />
                )}
                {exercise.id === 'fig8' && (
                  <Figure8Exercise onComplete={() => {
                    awardPoints(20);
                    showNotif(t.notifFig8, <CheckCircle2 size={18} />);
                    playAlert();
                    setIsStarted(false);
                  }} t={t} autoStart={true} minimalist={true} />
                )}
                {exercise.id === 'colorblind' && (
                  <ColorBlindnessTest onComplete={() => {
                    awardPoints(25);
                    showNotif(t.notifColor, <CheckCircle2 size={18} />);
                    playAlert();
                    setIsStarted(false);
                  }} t={t} minimalist={true} />
                )}
                {exercise.id === 'astigmatism' && (
                  <AstigmatismTest onComplete={() => {
                    awardPoints(25);
                    showNotif(t.notifAstig, <CheckCircle2 size={18} />);
                    playAlert();
                    setIsStarted(false);
                  }} t={t} minimalist={true} />
                )}
                {exercise.id === 'illusion' && (
                  <IllusionExercise onComplete={() => {
                    awardPoints(20);
                    showNotif(t.notifIllusion, <CheckCircle2 size={18} />);
                    playAlert();
                    setIsStarted(false);
                  }} t={t} minimalist={true} />
                )}
                {exercise.id === 'zigzag' && (
                  <ZigzagExercise onComplete={() => {
                    awardPoints(20);
                    showNotif(t.notifZigzag, <CheckCircle2 size={18} />);
                    playAlert();
                    setIsStarted(false);
                  }} t={t} minimalist={true} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatCard({ value, label, icon }: { value: string | number; label: string; icon: React.ReactNode }) {
  return (
    <div className="bg-bg-card border border-white/5 rounded-2xl p-4 text-center space-y-1 shadow-sm">
      <div className="flex items-center justify-center gap-1.5">
        {icon}
        <span className="text-lg md:text-2xl font-mono font-bold">{value}</span>
      </div>
      <p className="text-[10px] uppercase tracking-widest text-text-lo font-medium">{label}</p>
    </div>
  );
}

function Timer2020({ onComplete, playAlert, t, autoStart = false, minimalist = false }: { onComplete: () => void; playAlert: (f?: number, d?: number) => void; t: any; autoStart?: boolean; minimalist?: boolean }) {
  const [timeLeft, setTimeLeft] = useState(1200);
  const [isActive, setIsActive] = useState(autoStart);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const WORK_TIME = 1200;
  const BREAK_TIME = 20;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
        onComplete();
      } else {
        setIsBreak(false);
        setTimeLeft(WORK_TIME);
        setIsActive(false);
        playAlert(660);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, isBreak, onComplete, playAlert]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = isBreak ? (timeLeft / BREAK_TIME) : (timeLeft / WORK_TIME);
  const circ = 2 * Math.PI * 54;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 114 114">
          <circle className="fill-none stroke-bg-mid stroke-[6]" cx="57" cy="57" r="54" />
          <circle 
            className="fill-none stroke-accent stroke-[6] ring-fill" 
            cx="57" cy="57" r="54" 
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-mono font-bold">{formatTime(timeLeft)}</div>
          <div className="text-[10px] uppercase tracking-widest text-text-lo mt-1">
            {isBreak ? t.break : t.focus}
          </div>
        </div>
      </div>

      {!minimalist && (
        <div className="flex gap-3">
          {!isActive ? (
            <button onClick={() => setIsActive(true)} className="bg-accent text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-accent/20">
              <Play size={16} /> {t.startSession}
            </button>
          ) : (
            <button onClick={() => setIsActive(false)} className="bg-bg-mid text-text-hi border border-white/5 px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
              <Square size={16} /> {t.stop}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function NearFarExercise({ onComplete, t, autoStart = false, minimalist = false }: { onComplete: () => void; t: any; autoStart?: boolean; minimalist?: boolean }) {
  const [isActive, setIsActive] = useState(autoStart);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<'near' | 'far'>('near');
  const [objectIndex, setObjectIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const objects = [
    { type: 'letter', value: 'A' },
    { type: 'shape2d', value: 'circle' },
    { type: 'letter', value: 'B' },
    { type: 'shape3d', value: 'cube' },
    { type: 'letter', value: 'C' },
    { type: 'shape2d', value: 'square' },
    { type: 'shape3d', value: 'pyramid' },
    { type: 'letter', value: 'D' },
    { type: 'shape2d', value: 'triangle' },
  ];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          const currentPhase = Math.floor((60 - next) / 3) % 2 === 0 ? 'near' : 'far';
          
          if (currentPhase !== phase) {
            setPhase(currentPhase);
            setObjectIndex(prevIdx => (prevIdx + 1) % objects.length);
          }
          
          return next;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, phase, objects.length, onComplete]);

  const currentObj = objects[objectIndex];

  const renderObject = () => {
    switch (currentObj.type) {
      case 'letter':
        return (
          <span className="text-6xl font-bold font-mono text-accent drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]">
            {currentObj.value}
          </span>
        );
      case 'shape2d':
        if (currentObj.value === 'circle') return <div className="w-24 h-24 rounded-full border-4 border-accent-2 shadow-[0_0_20px_rgba(var(--accent-2-rgb),0.3)]" />;
        if (currentObj.value === 'square') return <div className="w-24 h-24 border-4 border-accent-3 shadow-[0_0_20px_rgba(var(--accent-3-rgb),0.3)]" />;
        if (currentObj.value === 'triangle') return (
          <div className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-bottom-[86px] border-bottom-accent" />
        );
        return null;
      case 'shape3d':
        if (currentObj.value === 'cube') {
          return (
            <div className="cube-container w-24 h-24">
              <div className="cube">
                <div className="face front" />
                <div className="face back" />
                <div className="face right" />
                <div className="face left" />
                <div className="face top" />
                <div className="face bottom" />
              </div>
            </div>
          );
        }
        if (currentObj.value === 'pyramid') {
          return (
            <div className="pyramid-container w-24 h-24">
              <div className="pyramid">
                <div className="side s1" />
                <div className="side s2" />
                <div className="side s3" />
                <div className="side s4" />
              </div>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      {/* Single spacious card for exercise */}
      <div className="relative w-full max-w-2xl aspect-video bg-bg-mid/30 rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center p-12 shadow-inner">
        {/* Background Grid for depth */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`${objectIndex}-${phase}`}
            initial={{ scale: phase === 'near' ? 0.2 : 2, opacity: 0 }}
            animate={{ 
              scale: phase === 'near' ? 1.5 : 0.5, 
              opacity: 1,
              rotateY: currentObj.type === 'shape3d' ? [0, 360] : 0
            }}
            exit={{ scale: phase === 'near' ? 2 : 0.2, opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut",
              rotateY: { duration: 3, repeat: Infinity, ease: "linear" }
            }}
            className="relative z-10 flex items-center justify-center"
          >
            {renderObject()}
          </motion.div>
        </AnimatePresence>

        {/* Phase Indicator Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-bg-card/80 backdrop-blur px-4 py-2 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${phase === 'near' ? 'bg-accent animate-pulse' : 'bg-accent-2'}`} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
            {phase === 'near' ? t.near : t.far}
          </span>
        </div>
      </div>

      {/* Progress & Controls */}
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="relative w-full max-w-xs h-2 bg-bg-mid rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-accent-2"
            animate={{ width: `${(timeLeft / 60) * 100}%` }}
          />
        </div>
        
        {!minimalist && (
          <div className="flex items-center gap-4">
            <div className="text-2xl font-mono font-bold text-text-hi">{timeLeft}s</div>
            <div className="h-4 w-[1px] bg-white/10" />
            {!isActive ? (
              <button onClick={() => { setIsActive(true); setTimeLeft(60); }} className="bg-accent text-white px-10 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-accent/20">
                <Play size={16} /> {t.startFocus}
              </button>
            ) : (
              <button onClick={() => setIsActive(false)} className="bg-bg-mid text-text-hi border border-white/5 px-10 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
                <Square size={16} /> {t.stop}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Figure8Exercise({ onComplete, t, autoStart = false, minimalist = false }: { onComplete: () => void; t: any; autoStart?: boolean; minimalist?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(autoStart);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-full max-w-[300px] aspect-square rounded-full border border-white/5 bg-accent/5 overflow-hidden flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 340 340">
          <path 
            d="M 68 170 Q 68 68 170 170 Q 272 272 272 170 Q 272 68 170 170 Q 68 272 68 170 Z"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="text-accent"
          />
        </svg>
        <div className={`w-5 h-5 bg-gradient-to-br from-accent to-accent-2 rounded-full shadow-lg shadow-accent/40 absolute ${isPlaying ? 'fig8-dot-anim' : 'top-1/2 left-[20%] -translate-x-1/2 -translate-y-1/2'}`} />
      </div>

      {!minimalist && (
        <div className="flex gap-3">
          {!isPlaying ? (
            <button onClick={() => setIsPlaying(true)} className="bg-accent text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
              <Play size={16} /> {t.playDot}
            </button>
          ) : (
            <button onClick={() => setIsPlaying(false)} className="bg-bg-mid text-text-hi border border-white/5 px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
              <Pause size={16} /> {t.pause}
            </button>
          )}
          <button onClick={onComplete} className="bg-accent-3/10 text-accent-3 border border-accent-3/20 px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
            <CheckCircle2 size={16} /> {t.done}
          </button>
        </div>
      )}
    </div>
  );
}

function ColorBlindnessTest({ onComplete, t, minimalist = false }: { onComplete: () => void; t: any; minimalist?: boolean }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const plates = [
    { number: 12, colors: ['#e11d48', '#10b981'], dots: 150 },
    { number: 8, colors: ['#f59e0b', '#3b82f6'], dots: 150 },
    { number: 6, colors: ['#8b5cf6', '#ec4899'], dots: 150 },
    { number: 29, colors: ['#10b981', '#f43f5e'], dots: 150 },
  ];

  const handleAnswer = (num: number) => {
    if (num === plates[step].number) setScore(s => s + 1);
    if (step < plates.length - 1) {
      setStep(s => s + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-2">
          <Trophy size={40} />
        </div>
        <h3 className="text-2xl font-bold">{t.done}</h3>
        <p className="text-text-lo">Score: {score} / {plates.length}</p>
        <button onClick={onComplete} className="bg-accent text-white px-10 py-3 rounded-full font-bold text-sm shadow-lg shadow-accent/20">
          {t.done}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div className="relative w-64 h-64 rounded-full bg-bg-mid overflow-hidden border border-white/5 flex items-center justify-center">
        <div className="grid grid-cols-10 gap-1 p-4">
          {Array.from({ length: 100 }).map((_, i) => {
            const isNumber = Math.random() > 0.5; 
            return (
              <div 
                key={i} 
                className="w-4 h-4 rounded-full" 
                style={{ 
                  backgroundColor: isNumber ? plates[step].colors[0] : plates[step].colors[1],
                  opacity: 0.6 + Math.random() * 0.4,
                  transform: `scale(${0.8 + Math.random() * 0.4})`
                }} 
              />
            );
          })}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <span className="text-6xl font-bold opacity-10 select-none" style={{ color: plates[step].colors[0] }}>{plates[step].number}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {[plates[step].number, plates[step].number + 5, plates[step].number - 3, 0].sort((a, b) => a - b).map(n => (
          <button 
            key={n}
            onClick={() => handleAnswer(n)}
            className="bg-bg-card border border-white/5 hover:border-accent/50 py-4 rounded-2xl font-bold transition-all active:scale-95"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function AstigmatismTest({ onComplete, t, minimalist = false }: { onComplete: () => void; t: any; minimalist?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg">
      <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-full bg-text-hi/20"
            style={{ transform: `rotate(${i * 15}deg)` }}
          >
            <div className="h-1/2 w-full bg-text-hi" />
          </div>
        ))}
        <div className="w-4 h-4 bg-accent rounded-full z-10" />
      </div>

      <div className="text-center space-y-4">
        <p className="text-sm text-text-lo max-w-xs mx-auto">
          {t.ex05Steps[1]}
        </p>
        <button onClick={onComplete} className="bg-accent text-white px-10 py-3 rounded-full font-bold text-sm shadow-lg shadow-accent/20">
          {t.done}
        </button>
      </div>
    </div>
  );
}

function IllusionExercise({ onComplete, t, minimalist = false }: { onComplete: () => void; t: any; minimalist?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `repeating-conic-gradient(
              from 0deg,
              #000 0deg 10deg,
              #fff 10deg 20deg
            )`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-full mix-blend-overlay" />
        <div className="w-4 h-4 bg-accent rounded-full z-10 shadow-lg shadow-accent/50" />
      </div>

      <div className="text-center space-y-6">
        <p className="text-text-mid max-w-sm mx-auto leading-relaxed">
          {t.ex06Steps[0]}
        </p>
        <button 
          onClick={onComplete}
          className="bg-accent text-white px-10 py-4 rounded-full font-bold text-sm shadow-xl shadow-accent/20 hover:scale-105 transition-transform active:scale-95"
        >
          {t.done}
        </button>
      </div>
    </div>
  );
}

function ZigzagExercise({ onComplete, t, minimalist = false }: { onComplete: () => void; t: any; minimalist?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-3xl">
      <div className="relative w-full aspect-[2/1] bg-bg-mid/30 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 400" preserveAspectRatio="none">
          <path 
            d="M 0 200 L 100 100 L 200 300 L 300 100 L 400 300 L 500 100 L 600 300 L 700 100 L 800 200"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4"
            className="text-accent"
          />
        </svg>

        <motion.div 
          animate={isPlaying ? {
            x: [0, 100, 200, 300, 400, 500, 600, 700, 800],
            y: [200, 100, 300, 100, 300, 100, 300, 100, 200]
          } : {}}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "linear",
          }}
          className="w-6 h-6 bg-accent rounded-full shadow-lg shadow-accent/40 absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="flex flex-col items-center gap-6">
        <p className="text-text-mid text-sm">{t.ex07Steps[0]}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-bg-card border border-white/10 px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? t.pause : t.startFocus}
          </button>
          <button 
            onClick={onComplete}
            className="bg-accent text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-accent/20"
          >
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
}

function TipCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-bg-card border border-white/5 p-6 rounded-2xl space-y-3 hover:border-accent/20 transition-colors group">
      <div className="w-10 h-10 bg-bg-mid rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="font-bold text-sm">{title}</h4>
      <p className="text-xs text-text-lo leading-relaxed">{text}</p>
    </div>
  );
}

function BadgeItem({ type, t }: { type: '7-day' | '30-day' | '90-day'; t: any; key?: string }) {
  const config = {
    '7-day': {
      icon: <Star size={18} />,
      label: t.badge7,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20'
    },
    '30-day': {
      icon: <ShieldCheck size={18} />,
      label: t.badge30,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/20'
    },
    '90-day': {
      icon: <Award size={18} />,
      label: t.badge90,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/20'
    }
  };

  const item = config[type];

  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${item.bg} ${item.border} ${item.color}`}
    >
      {item.icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
    </motion.div>
  );
}

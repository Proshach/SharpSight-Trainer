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
  Globe
} from 'lucide-react';
import { useProgress } from './hooks/useProgress';
import { translations } from './i18n';

type TabType = '2020' | 'nearfar' | 'fig8';

export default function App() {
  const { progress, awardPoints, incrementShares, incrementInstalls, updateSoundSettings, setLanguage } = useProgress();
  const [activeTab, setActiveTab] = useState<TabType>('2020');
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

        {/* Tabs */}
        <nav className="bg-bg-card border border-white/5 p-1.5 rounded-2xl flex gap-1">
          <TabButton 
            active={activeTab === '2020'} 
            onClick={() => setActiveTab('2020')} 
            icon={<Timer size={18} />} 
            label={t.tab2020} 
          />
          <TabButton 
            active={activeTab === 'nearfar'} 
            onClick={() => setActiveTab('nearfar')} 
            icon={<Telescope size={18} />} 
            label={t.tabNearFar} 
          />
          <TabButton 
            active={activeTab === 'fig8'} 
            onClick={() => setActiveTab('fig8')} 
            icon={<InfinityIcon size={18} />} 
            label={t.tabFig8} 
          />
        </nav>

        {/* Exercise Panels */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === '2020' && (
              <ExercisePanel 
                key="2020"
                label={t.ex01Label}
                title={t.ex01Title}
                desc={t.ex01Desc}
                steps={t.ex01Steps}
              >
                <Timer2020 onComplete={() => {
                  awardPoints(10);
                  showNotif(t.notifComplete.replace('{pts}', '10'), <CheckCircle2 size={18} />);
                  playAlert();
                }} playAlert={playAlert} t={t} />
              </ExercisePanel>
            )}

            {activeTab === 'nearfar' && (
              <ExercisePanel 
                key="nearfar"
                label={t.ex02Label}
                title={t.ex02Title}
                desc={t.ex02Desc}
                steps={t.ex02Steps}
              >
                <NearFarExercise onComplete={() => {
                  awardPoints(15);
                  showNotif(t.notifNearFar, <CheckCircle2 size={18} />);
                  playAlert();
                }} t={t} />
              </ExercisePanel>
            )}

            {activeTab === 'fig8' && (
              <ExercisePanel 
                key="fig8"
                label={t.ex03Label}
                title={t.ex03Title}
                desc={t.ex03Desc}
                steps={t.ex03Steps}
              >
                <Figure8Exercise onComplete={() => {
                  awardPoints(20);
                  showNotif(t.notifFig8, <CheckCircle2 size={18} />);
                  playAlert();
                }} t={t} />
              </ExercisePanel>
            )}
          </AnimatePresence>
        </div>

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

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-gradient-to-br from-accent to-accent-2 text-white shadow-lg shadow-accent/20' 
          : 'text-text-lo hover:bg-bg-mid hover:text-text-hi'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

function ExercisePanel({ label, title, desc, steps, children }: { label: string; title: string; desc: string; steps: string[]; children: React.ReactNode; key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-bg-card border border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-xl"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-30" />
      <div className="space-y-6">
        <header>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">{label}</div>
          <h3 className="text-2xl font-extrabold tracking-tight mb-2">{title}</h3>
          <p className="text-text-mid text-sm leading-relaxed max-w-xl">{desc}</p>
        </header>

        <div className="bg-accent/5 border border-accent/10 rounded-2xl p-5 space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 text-xs md:text-sm text-text-mid leading-relaxed">
              <span className="w-5 h-5 min-w-[20px] bg-accent text-white rounded-full flex items-center justify-center text-[10px] font-bold font-mono mt-0.5">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>

        {children}
      </div>
    </motion.div>
  );
}

function Timer2020({ onComplete, playAlert, t }: { onComplete: () => void; playAlert: (f?: number, d?: number) => void; t: any }) {
  const [timeLeft, setTimeLeft] = useState(1200);
  const [isActive, setIsActive] = useState(false);
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
    </div>
  );
}

function NearFarExercise({ onComplete, t }: { onComplete: () => void; t: any }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<'near' | 'far'>('near');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          const currentPhase = Math.floor((60 - next) / 3) % 2 === 0 ? 'near' : 'far';
          setPhase(currentPhase);
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
  }, [isActive, timeLeft, onComplete]);

  const circ = 2 * Math.PI * 54;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-center gap-4 py-4">
        <motion.div 
          animate={{ scale: phase === 'near' ? 1.2 : 1, opacity: phase === 'near' ? 1 : 0.4 }}
          className={`w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center font-mono text-[10px] uppercase tracking-widest ${phase === 'near' ? 'bg-accent/20' : 'bg-transparent'}`}
        >
          {t.near || 'Near'}
        </motion.div>
        <div className="w-8 h-[1px] bg-white/10" />
        <motion.div 
          animate={{ scale: phase === 'far' ? 1.2 : 1, opacity: phase === 'far' ? 1 : 0.4 }}
          className={`w-24 h-24 rounded-full border-2 border-accent-2 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest ${phase === 'far' ? 'bg-accent-2/20' : 'bg-transparent'}`}
        >
          {t.far || 'Far'}
        </motion.div>
      </div>

      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 114 114">
          <circle className="fill-none stroke-bg-mid stroke-[6]" cx="57" cy="57" r="54" />
          <circle 
            className="fill-none stroke-accent-2 stroke-[6] ring-fill" 
            cx="57" cy="57" r="54" 
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - timeLeft / 60)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-mono font-bold">{timeLeft}</div>
          <div className="text-[10px] uppercase tracking-widest text-text-lo mt-1">{t.seconds}</div>
        </div>
      </div>

      <div className="flex gap-3">
        {!isActive ? (
          <button onClick={() => { setIsActive(true); setTimeLeft(60); }} className="bg-accent-2 text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-accent-2/20">
            <Play size={16} /> {t.startFocus}
          </button>
        ) : (
          <button onClick={() => setIsActive(false)} className="bg-bg-mid text-text-hi border border-white/5 px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
            <Square size={16} /> {t.stop}
          </button>
        )}
      </div>
    </div>
  );
}

function Figure8Exercise({ onComplete, t }: { onComplete: () => void; t: any }) {
  const [isPlaying, setIsPlaying] = useState(false);

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

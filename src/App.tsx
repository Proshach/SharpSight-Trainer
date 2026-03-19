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
  Info
} from 'lucide-react';
import { useProgress } from './hooks/useProgress';

type TabType = '2020' | 'nearfar' | 'fig8';

export default function App() {
  const { progress, awardPoints } = useProgress();
  const [activeTab, setActiveTab] = useState<TabType>('2020');
  const [isDark, setIsDark] = useState(true);
  const [notif, setNotif] = useState<{ msg: string; icon: React.ReactNode } | null>(null);

  const showNotif = (msg: string, icon: React.ReactNode) => {
    setNotif({ msg, icon });
    setTimeout(() => setNotif(null), 3000);
  };

  const playBeep = useCallback((freq = 520, dur = 0.18) => {
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
    if ('vibrate' in navigator) navigator.vibrate(150);
  }, []);

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
          <button 
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 bg-bg-card border border-white/5 rounded-xl flex items-center justify-center hover:bg-bg-mid transition-all active:scale-90"
          >
            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-accent" />}
          </button>
        </header>

        {/* Hero */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            Digital Eye Wellness
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">
            Train your eyes.<br/>
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">Reduce fatigue.</span>
          </h2>
          <p className="text-text-lo max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Science-backed exercises to relieve screen strain and strengthen your focus muscles.
          </p>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard value={progress.sessions} label="Sessions" icon={<Zap size={14} className="text-accent" />} />
          <StatCard value={`${progress.streak}🔥`} label="Streak" icon={<Flame size={14} className="text-orange-500" />} />
          <StatCard value={progress.points} label="Points" icon={<Trophy size={14} className="text-accent-3" />} />
        </div>

        {/* Tabs */}
        <nav className="bg-bg-card border border-white/5 p-1.5 rounded-2xl flex gap-1">
          <TabButton 
            active={activeTab === '2020'} 
            onClick={() => setActiveTab('2020')} 
            icon={<Timer size={18} />} 
            label="20-20-20" 
          />
          <TabButton 
            active={activeTab === 'nearfar'} 
            onClick={() => setActiveTab('nearfar')} 
            icon={<Telescope size={18} />} 
            label="Near-Far" 
          />
          <TabButton 
            active={activeTab === 'fig8'} 
            onClick={() => setActiveTab('fig8')} 
            icon={<InfinityIcon size={18} />} 
            label="Figure-8" 
          />
        </nav>

        {/* Exercise Panels */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === '2020' && (
              <ExercisePanel 
                key="2020"
                label="Exercise 01 · Timer"
                title="20 · 20 · 20 Rule"
                desc="For every 20 minutes of screen time, look at something 20 feet away for 20 seconds."
                steps={[
                  "Start the 20-minute work timer.",
                  "When it beeps, look out a window or across the room.",
                  "Hold for 20 seconds, then return to screen."
                ]}
              >
                <Timer2020 onComplete={() => {
                  awardPoints(10);
                  showNotif("Session complete! +10 pts", <CheckCircle2 size={18} />);
                  playBeep();
                }} playBeep={playBeep} />
              </ExercisePanel>
            )}

            {activeTab === 'nearfar' && (
              <ExercisePanel 
                key="nearfar"
                label="Exercise 02 · Focus"
                title="Near-Far Focus"
                desc="Alternate focus between something close and far away to improve flexibility."
                steps={[
                  "Hold a finger 10 cm from your nose.",
                  "Focus on your finger for 3 seconds.",
                  "Shift focus to a point across the room for 3 seconds."
                ]}
              >
                <NearFarExercise onComplete={() => {
                  awardPoints(15);
                  showNotif("Near-Far complete! +15 pts", <CheckCircle2 size={18} />);
                  playBeep();
                }} />
              </ExercisePanel>
            )}

            {activeTab === 'fig8' && (
              <ExercisePanel 
                key="fig8"
                label="Exercise 03 · Tracking"
                title="Figure-8 Tracking"
                desc="Follow the moving dot using only your eye muscles — keep your head still."
                steps={[
                  "Sit comfortably 50 cm from your screen.",
                  "Keep your head completely still.",
                  "Follow the dot with your eyes only."
                ]}
              >
                <Figure8Exercise onComplete={() => {
                  awardPoints(20);
                  showNotif("Figure-8 complete! +20 pts", <CheckCircle2 size={18} />);
                  playBeep();
                }} />
              </ExercisePanel>
            )}
          </AnimatePresence>
        </div>

        {/* Tips */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TipCard icon={<Lightbulb />} title="Blink More" text="Blink fully every 4-5 seconds to rewet your corneas." />
          <TipCard icon={<Thermometer />} title="Screen Distance" text="Keep screens at least arm's length (50-70 cm) away." />
          <TipCard icon={<MoonStar />} title="Night Mode" text="Use blue-light filters after sunset to protect melatonin." />
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

function Timer2020({ onComplete, playBeep }: { onComplete: () => void; playBeep: (f?: number, d?: number) => void }) {
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
        playBeep(660);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, isBreak, onComplete, playBeep]);

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
            {isBreak ? 'Break' : 'Focus'}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {!isActive ? (
          <button onClick={() => setIsActive(true)} className="bg-accent text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-accent/20">
            <Play size={16} /> Start Session
          </button>
        ) : (
          <button onClick={() => setIsActive(false)} className="bg-bg-mid text-text-hi border border-white/5 px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
            <Square size={16} /> Stop
          </button>
        )}
      </div>
    </div>
  );
}

function NearFarExercise({ onComplete }: { onComplete: () => void }) {
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
          Near
        </motion.div>
        <div className="w-8 h-[1px] bg-white/10" />
        <motion.div 
          animate={{ scale: phase === 'far' ? 1.2 : 1, opacity: phase === 'far' ? 1 : 0.4 }}
          className={`w-24 h-24 rounded-full border-2 border-accent-2 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest ${phase === 'far' ? 'bg-accent-2/20' : 'bg-transparent'}`}
        >
          Far
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
          <div className="text-[10px] uppercase tracking-widest text-text-lo mt-1">Seconds</div>
        </div>
      </div>

      <div className="flex gap-3">
        {!isActive ? (
          <button onClick={() => { setIsActive(true); setTimeLeft(60); }} className="bg-accent-2 text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-accent-2/20">
            <Play size={16} /> Start Focus
          </button>
        ) : (
          <button onClick={() => setIsActive(false)} className="bg-bg-mid text-text-hi border border-white/5 px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
            <Square size={16} /> Stop
          </button>
        )}
      </div>
    </div>
  );
}

function Figure8Exercise({ onComplete }: { onComplete: () => void }) {
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
            <Play size={16} /> Play Dot
          </button>
        ) : (
          <button onClick={() => setIsPlaying(false)} className="bg-bg-mid text-text-hi border border-white/5 px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
            <Pause size={16} /> Pause
          </button>
        )}
        <button onClick={onComplete} className="bg-accent-3/10 text-accent-3 border border-accent-3/20 px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
          <CheckCircle2 size={16} /> Done
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

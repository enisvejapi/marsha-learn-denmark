'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getProgress } from '@/lib/storage';
import { levels } from '@/data/levels';
import { UserProgress } from '@/types';

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const xp = progress?.totalXP ?? 0;
  const streak = progress?.streak ?? 0;
  const masteredCount = Object.values(progress?.words ?? {}).filter(w => w.mastered).length;

  return (
    <div className="min-h-screen bg-blush">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-danish-red via-danish-red-dark to-[#7A0020] text-white px-5 pt-12 pb-10">
        {/* Flag cross overlay */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute left-[37%] top-0 bottom-0 w-[11%] bg-white/10" />
          <div className="absolute top-[38%] left-0 right-0 h-[24%] bg-white/10" />
        </div>
        {/* Pink glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-hot-pink opacity-20 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🇩🇰</span>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-75">Marsha Learn Denmark</span>
          </div>
          <h1 className="text-4xl font-black leading-tight">
            Lær Dansk.<br />
            <span className="text-hot-pink drop-shadow-[0_0_16px_rgba(255,20,147,0.7)]">Learn Danish.</span>
          </h1>
          <p className="text-white/60 text-sm mt-2">From A to Å — alphabet to Viking archaeology.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 -mt-5 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Streak', value: streak > 0 ? `${streak}` : '0', icon: '🔥', sub: 'days' },
            { label: 'XP', value: xp, icon: '⭐', sub: 'points' },
            { label: 'Mastered', value: masteredCount, icon: '✅', sub: 'words' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-pink-100">
              <div className="text-xl">{s.icon}</div>
              <div className="text-xl font-black text-danish-red leading-tight">{s.value}</div>
              <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Level cards */}
      <div className="px-4 mt-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Levels</h2>
        <div className="flex flex-col gap-3">
          {levels.map((level, i) => {
            const unlocked = level.id === 'a1' || xp >= level.unlockXP;
            return (
              <motion.div key={level.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                {unlocked ? (
                  <Link href={`/learn/${level.id}`}>
                    <div className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-md active:scale-[0.98] transition-transform bg-gradient-to-r ${
                      level.id === 'a1' ? 'from-danish-red to-rose-600' :
                      level.id === 'a2' ? 'from-hot-pink to-pink-700' :
                      level.id === 'b1' ? 'from-rose-500 to-hot-pink-dark' :
                      'from-danish-red-dark to-hot-pink'
                    }`}>
                      <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{level.id.toUpperCase()}</div>
                          <div className="text-xl font-black">{level.label.split(' — ')[1]}</div>
                          <p className="text-xs opacity-70 mt-0.5 max-w-[190px] leading-snug">{level.description}</p>
                        </div>
                        <div className="text-5xl">{level.emoji}</div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 relative z-10 text-xs opacity-80">
                        <span>{level.categoryIds.length} topics</span>
                        <span className="ml-auto">Tap to study →</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="rounded-2xl p-4 bg-slate-100 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{level.id.toUpperCase()} — Locked</div>
                        <div className="text-xl font-black text-slate-400">{level.label.split(' — ')[1]}</div>
                        <p className="text-xs text-slate-400 mt-0.5 max-w-[190px]">{level.description}</p>
                      </div>
                      <div className="text-4xl opacity-30">🔒</div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-danish-red to-hot-pink rounded-full transition-all"
                          style={{ width: `${Math.min((xp / level.unlockXP) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{Math.max(level.unlockXP - xp, 0)} XP left</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick start buttons */}
      <div className="px-4 mt-6 pb-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Start</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/quiz" className="bg-gradient-to-br from-hot-pink to-hot-pink-dark text-white rounded-2xl p-4 text-center shadow-sm active:scale-95 transition-transform">
            <div className="text-3xl mb-1">🎯</div>
            <div className="font-bold text-sm">Quiz Mode</div>
            <div className="text-xs opacity-70">Test your knowledge</div>
          </Link>
          <Link href="/speak" className="bg-gradient-to-br from-danish-red to-danish-red-dark text-white rounded-2xl p-4 text-center shadow-sm active:scale-95 transition-transform">
            <div className="text-3xl mb-1">🎤</div>
            <div className="font-bold text-sm">Speak It</div>
            <div className="text-xs opacity-70">Practice pronunciation</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

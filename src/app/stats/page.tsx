'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProgress, resetProgress } from '@/lib/storage';
import { levels } from '@/data/levels';
import { allCategories, allWords } from '@/data/vocabulary';
import { UserProgress } from '@/types';

export default function StatsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => { setProgress(getProgress()); }, []);

  const xp = progress?.totalXP ?? 0;
  const streak = progress?.streak ?? 0;
  const words = progress?.words ?? {};
  const masteredWords = Object.values(words).filter(w => w.mastered);
  const totalStudied = Object.values(words).filter(w => w.correct + w.incorrect > 0).length;
  const accuracy = totalStudied > 0
    ? Math.round((Object.values(words).reduce((s, w) => s + w.correct, 0) /
        Object.values(words).reduce((s, w) => s + w.correct + w.incorrect, 0)) * 100)
    : 0;

  function handleReset() {
    resetProgress();
    setProgress(getProgress());
    setShowReset(false);
  }

  return (
    <div className="min-h-screen bg-blush">
      <div className="bg-gradient-to-r from-danish-red to-hot-pink text-white px-5 pt-12 pb-6">
        <h1 className="text-2xl font-black">📊 Your Stats</h1>
        <p className="text-white/70 text-sm mt-1">Marsha's Danish learning progress</p>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Top stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🔥', label: 'Day Streak', value: streak, color: 'text-orange-500' },
            { icon: '⭐', label: 'Total XP', value: xp, color: 'text-danish-red' },
            { icon: '✅', label: 'Words Mastered', value: masteredWords.length, color: 'text-emerald-600' },
            { icon: '🎯', label: 'Accuracy', value: `${accuracy}%`, color: 'text-hot-pink' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100"
            >
              <div className="text-3xl">{s.icon}</div>
              <div className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Words studied */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
          <h3 className="font-bold text-slate-700 mb-3">Words Studied</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-pink-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-danish-red to-hot-pink rounded-full"
                style={{ width: `${Math.min((totalStudied / allWords.length) * 100, 100)}%` }}
              />
            </div>
            <span className="text-sm text-slate-500 whitespace-nowrap">{totalStudied} / {allWords.length}</span>
          </div>
        </div>

        {/* Level progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
          <h3 className="font-bold text-slate-700 mb-3">Level Progress</h3>
          <div className="flex flex-col gap-3">
            {levels.map(level => {
              const unlocked = level.id === 'a1' || xp >= level.unlockXP;
              const pct = unlocked ? Math.min((xp / (levels.find(l => l.unlockXP > level.unlockXP)?.unlockXP ?? level.unlockXP + 350)) * 100, 100) : Math.min((xp / level.unlockXP) * 100, 100);
              return (
                <div key={level.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-semibold ${unlocked ? 'text-slate-700' : 'text-slate-400'}`}>
                      {level.emoji} {level.label}
                    </span>
                    <span className="text-slate-400 text-xs">{unlocked ? 'Unlocked ✓' : `${level.unlockXP} XP to unlock`}</span>
                  </div>
                  <div className="h-2 bg-pink-50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${unlocked ? 'bg-gradient-to-r from-danish-red to-hot-pink' : 'bg-slate-200'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
          <h3 className="font-bold text-slate-700 mb-3">Categories</h3>
          <div className="flex flex-col gap-2">
            {allCategories.map(cat => {
              const catWords = Object.values(words).filter(w => {
                const vocabWord = allWords.find(v => v.id === w.wordId);
                return vocabWord?.category === cat.id;
              });
              const studied = catWords.length;
              const mastered = catWords.filter(w => w.mastered).length;
              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-lg w-6">{cat.emoji}</span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-600">{cat.nameEN}</div>
                    <div className="h-1.5 bg-pink-50 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${cat.bg}`}
                        style={{ width: `${Math.min((studied / cat.wordCount) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{mastered}/{cat.wordCount}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div className="pb-4">
          {!showReset ? (
            <button onClick={() => setShowReset(true)} className="w-full py-3 rounded-2xl border border-red-200 text-red-400 text-sm font-semibold">
              Reset Progress
            </button>
          ) : (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-200 text-center">
              <p className="text-red-600 font-bold text-sm mb-3">Are you sure? All progress will be lost!</p>
              <div className="flex gap-3">
                <button onClick={() => setShowReset(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm">Cancel</button>
                <button onClick={handleReset} className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-bold">Reset</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

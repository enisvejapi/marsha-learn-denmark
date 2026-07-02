'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { levels } from '@/data/levels';
import { getProgress } from '@/lib/storage';

export default function LearnPage() {
  const [xp, setXp] = useState(0);
  useEffect(() => { setXp(getProgress().totalXP); }, []);

  return (
    <div className="min-h-screen bg-blush">
      <div className="bg-gradient-to-r from-danish-red to-hot-pink text-white px-5 pt-12 pb-6">
        <h1 className="text-2xl font-black">📖 Learn Danish</h1>
        <p className="text-white/70 text-sm mt-1">Choose your level to start studying</p>
      </div>
      <div className="px-4 py-5 flex flex-col gap-4">
        {levels.map((level, i) => {
          const unlocked = level.id === 'a1' || xp >= level.unlockXP;
          return (
            <motion.div key={level.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              {unlocked ? (
                <Link href={`/learn/${level.id}`}>
                  <div className={`rounded-2xl p-5 text-white shadow-md bg-gradient-to-r ${
                    level.id === 'a1' ? 'from-danish-red to-rose-600' :
                    level.id === 'a2' ? 'from-hot-pink to-pink-700' :
                    level.id === 'b1' ? 'from-rose-500 to-hot-pink-dark' :
                    'from-danish-red-dark to-hot-pink'
                  } active:scale-[0.98] transition-transform`}>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{level.emoji}</span>
                      <div className="flex-1">
                        <div className="font-black text-lg">{level.label}</div>
                        <div className="text-sm opacity-75">{level.description}</div>
                        <div className="text-xs opacity-60 mt-1">{level.categoryIds.length} categories</div>
                      </div>
                      <span className="text-2xl opacity-60">›</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-2xl p-5 bg-slate-100 border border-slate-200 opacity-60">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🔒</span>
                    <div className="flex-1">
                      <div className="font-black text-lg text-slate-400">{level.label}</div>
                      <div className="text-sm text-slate-400">{level.description}</div>
                      <div className="text-xs text-slate-400 mt-1">Unlock at {level.unlockXP} XP · You have {xp} XP</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

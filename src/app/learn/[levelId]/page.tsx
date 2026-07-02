'use client';
import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { levels } from '@/data/levels';
import { allCategories } from '@/data/vocabulary';
import { notFound } from 'next/navigation';

export default function LevelPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = use(params);
  const level = levels.find(l => l.id === levelId);
  if (!level) notFound();

  const categories = allCategories.filter(c => c.level === levelId);

  return (
    <div className="min-h-screen bg-blush">
      <div className={`bg-gradient-to-r ${
        levelId === 'a1' ? 'from-danish-red to-rose-600' :
        levelId === 'a2' ? 'from-hot-pink to-pink-700' :
        levelId === 'b1' ? 'from-rose-500 to-hot-pink-dark' :
        'from-danish-red-dark to-hot-pink'
      } text-white px-5 pt-12 pb-6`}>
        <Link href="/learn" className="text-white/70 text-sm mb-3 block">← Back</Link>
        <div className="flex items-center gap-3">
          <span className="text-5xl">{level.emoji}</span>
          <div>
            <div className="text-xs font-bold opacity-70 uppercase tracking-widest">{level.id.toUpperCase()}</div>
            <h1 className="text-2xl font-black">{level.label.split(' — ')[1]}</h1>
            <p className="text-white/70 text-xs mt-0.5">{level.description}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Choose a Category</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/learn/${levelId}/${cat.id}`}>
                <div className={`rounded-2xl p-4 bg-gradient-to-br ${cat.bg} text-white shadow-sm active:scale-95 transition-transform`}>
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <div className="font-black text-sm">{cat.nameEN}</div>
                  <div className="text-xs opacity-75">{cat.nameDA}</div>
                  <div className="text-xs opacity-60 mt-1">{cat.wordCount} words</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

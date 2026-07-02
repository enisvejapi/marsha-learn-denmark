'use client';
import { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getWordsByCategory, getCategoryById } from '@/data/vocabulary';
import { addXP, recordWord } from '@/lib/storage';
import { shuffle } from '@/lib/utils';
import { notFound } from 'next/navigation';
import FlashCard from '@/components/learn/FlashCard';
import { CategoryId } from '@/types';

export default function CategoryPage({ params }: { params: Promise<{ levelId: string; categoryId: string }> }) {
  const { levelId, categoryId } = use(params);
  const category = getCategoryById(categoryId as CategoryId);
  if (!category) notFound();

  const [words] = useState(() => shuffle(getWordsByCategory(categoryId as CategoryId)));
  const [index, setIndex] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [finished, setFinished] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  function handleKnow() {
    const w = words[index];
    recordWord(w.id, true);
    const gained = addXP(10);
    setXpGained(p => p + 10);
    setKnownCount(p => p + 1);
    next();
  }

  function handleAgain() {
    const w = words[index];
    recordWord(w.id, false);
    next();
  }

  function next() {
    if (index + 1 >= words.length) setFinished(true);
    else setIndex(i => i + 1);
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-blush flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-danish-red">Session Complete!</h2>
          <p className="text-slate-500 mt-2">You studied <strong>{words.length}</strong> words</p>
          <p className="text-hot-pink font-bold mt-1">+{xpGained} XP earned!</p>
          <div className="mt-4 bg-white rounded-2xl p-4 border border-pink-100 shadow-sm">
            <div className="text-2xl font-black text-slate-800">{knownCount} / {words.length}</div>
            <div className="text-slate-500 text-sm">words you knew</div>
          </div>
          <div className="flex gap-3 mt-6">
            <Link href={`/learn/${levelId}`} className="flex-1 py-3 px-4 rounded-2xl bg-white border border-pink-200 text-slate-700 font-bold text-sm text-center">
              ← Back
            </Link>
            <Link href="/quiz" className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-danish-red to-hot-pink text-white font-bold text-sm text-center">
              Take Quiz →
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${category.bg} text-white px-5 pt-10 pb-5`}>
        <Link href={`/learn/${levelId}`} className="text-white/70 text-sm mb-3 block">← {levelId.toUpperCase()}</Link>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{category.emoji}</span>
          <div>
            <h1 className="text-xl font-black">{category.nameEN}</h1>
            <p className="text-white/70 text-xs">{category.nameDA} · {words.length} cards</p>
          </div>
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={words[index]?.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <FlashCard
              word={words[index]}
              onKnow={handleKnow}
              onAgain={handleAgain}
              total={words.length}
              current={index + 1}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { VocabWord } from '@/types';
import { useAudio } from '@/hooks/useAudio';

interface Props {
  word: VocabWord;
  onKnow: () => void;
  onAgain: () => void;
  total: number;
  current: number;
}

export default function FlashCard({ word, onKnow, onAgain, total, current }: Props) {
  const [flipped, setFlipped] = useState(false);
  const { speak, speaking } = useAudio();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Auto-speak Danish on mount
  useEffect(() => {
    const t = setTimeout(() => speak(word.danish), 400);
    return () => clearTimeout(t);
  }, [word.danish]);

  function handleDragEnd(_: PointerEvent, info: PanInfo) {
    if (info.offset.x > 100) { onKnow(); setFlipped(false); }
    else if (info.offset.x < -100) { onAgain(); setFlipped(false); }
  }

  return (
    <div className="flex flex-col items-center px-4 w-full">
      {/* Progress */}
      <div className="w-full mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{current} / {total}</span>
          <span>{Math.round((current / total) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-danish-red to-hot-pink rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(current / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Card */}
      <motion.div
        className="w-full relative cursor-grab active:cursor-grabbing"
        style={{ height: 300, x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        onClick={() => { setFlipped(f => !f); if (!flipped) speak(word.danish); }}
      >
        {/* Front — Danish */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-danish-red to-hot-pink text-white flex flex-col items-center justify-center p-6 shadow-xl select-none"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            rotateY: flipped ? 180 : 0,
            zIndex: flipped ? 0 : 1,
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-5xl mb-3">{word.emoji ?? '🇩🇰'}</div>
          <div className="text-4xl font-black text-center leading-tight">{word.danish}</div>
          {word.phonetic && <div className="text-white/60 text-sm mt-2 italic">[{word.phonetic}]</div>}
          <div className="text-white/50 text-xs mt-6">Tap to reveal · Swipe to answer</div>
          <button
            onClick={e => { e.stopPropagation(); speak(word.danish); }}
            className={`mt-3 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl min-touch ${speaking ? 'animate-pulse' : ''}`}
          >
            🔊
          </button>
        </motion.div>

        {/* Back — English */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-white border-2 border-pink-100 flex flex-col items-center justify-center p-6 shadow-xl select-none overflow-y-auto"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            rotateY: flipped ? 0 : -180,
            zIndex: flipped ? 1 : 0,
          }}
          animate={{ rotateY: flipped ? 0 : -180 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-4xl mb-2">{word.emoji ?? '💬'}</div>
          <div className="text-2xl font-black text-slate-800 text-center">{word.english}</div>
          <div className="text-slate-500 text-xs text-center mt-3 italic max-w-[220px]">{word.exampleDA}</div>
          <div className="text-slate-400 text-xs text-center mt-1 max-w-[220px]">{word.exampleEN}</div>
          {word.cultural && (
            <div className="mt-3 bg-pink-50 rounded-xl px-3 py-2 text-xs text-hot-pink-dark text-center border border-pink-100 max-w-[240px]">
              💡 {word.cultural}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Drag hints */}
      <div className="flex justify-between w-full mt-4 px-2">
        <motion.div
          className="text-xs text-red-400 font-semibold flex items-center gap-1"
          style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
        >
          ← Again
        </motion.div>
        <motion.div
          className="text-xs text-emerald-500 font-semibold flex items-center gap-1"
          style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        >
          Know it →
        </motion.div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4 w-full">
        <button
          onClick={onAgain}
          className="flex-1 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-500 font-bold text-sm active:scale-95 transition-transform min-touch"
        >
          ✕ Again
        </button>
        <button
          onClick={onKnow}
          className="flex-1 py-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-sm active:scale-95 transition-transform min-touch"
        >
          ✓ Know it
        </button>
      </div>
    </div>
  );
}

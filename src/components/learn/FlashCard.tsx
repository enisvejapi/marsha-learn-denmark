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
        className="card-3d w-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate, opacity }}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
      >
        <div
          className={`card-inner w-full`}
          style={{ height: 320 }}
          onClick={() => { setFlipped(f => !f); if (!flipped) speak(word.danish); }}
        >
          {/* Front — Danish */}
          <div className={`card-face absolute inset-0 rounded-3xl bg-gradient-to-br from-danish-red to-hot-pink text-white flex flex-col items-center justify-center p-6 shadow-xl select-none ${flipped ? 'hidden' : ''}`}>
            <div className="text-5xl mb-3">{word.emoji ?? '🇩🇰'}</div>
            <div className="text-4xl font-black text-center leading-tight">{word.danish}</div>
            {word.phonetic && <div className="text-white/60 text-sm mt-2 italic">[{word.phonetic}]</div>}
            <div className="text-white/50 text-xs mt-6">Tap to reveal · Swipe to answer</div>
            <button
              onClick={e => { e.stopPropagation(); speak(word.danish); }}
              className={`mt-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl ${speaking ? 'animate-pulse' : ''}`}
            >
              🔊
            </button>
          </div>

          {/* Back — English */}
          <div className={`card-back absolute inset-0 rounded-3xl bg-white border-2 border-pink-100 flex flex-col items-center justify-center p-6 shadow-xl select-none ${flipped ? '' : 'hidden'}`}>
            <div className="text-4xl mb-2">{word.emoji ?? '💬'}</div>
            <div className="text-3xl font-black text-slate-800 text-center">{word.english}</div>
            <div className="text-slate-500 text-xs text-center mt-3 italic">"{word.exampleDA}"</div>
            <div className="text-slate-400 text-xs text-center mt-1">"{word.exampleEN}"</div>
            {word.cultural && (
              <div className="mt-3 bg-pink-50 rounded-xl px-3 py-2 text-xs text-hot-pink-dark text-center border border-pink-100">
                💡 {word.cultural}
              </div>
            )}
          </div>
        </div>
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
          className="flex-1 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-500 font-bold text-sm active:scale-95 transition-transform"
        >
          ✕ Again
        </button>
        <button
          onClick={onKnow}
          className="flex-1 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-sm active:scale-95 transition-transform"
        >
          ✓ Know it
        </button>
      </div>
    </div>
  );
}

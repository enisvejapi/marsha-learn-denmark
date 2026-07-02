'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWordsByLevel, shuffle } from '@/data/vocabulary';
import { addXP, recordWord, getProgress } from '@/lib/storage';
import { useAudio, useSpeechRecognition } from '@/hooks/useAudio';
import { isCloseEnough } from '@/lib/utils';
import { VocabWord, LevelId } from '@/types';

const LEVELS: { id: LevelId; label: string; xpReq: number }[] = [
  { id: 'a1', label: 'A1', xpReq: 0 },
  { id: 'a2', label: 'A2', xpReq: 150 },
  { id: 'b1', label: 'B1', xpReq: 400 },
  { id: 'b2', label: 'B2', xpReq: 750 },
];

export default function SpeakPage() {
  const [level, setLevel] = useState<LevelId>('a1');
  const [xp, setXp] = useState(0);
  const [words, setWords] = useState<VocabWord[]>([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [transcript, setTranscript] = useState('');
  const { speak } = useAudio();
  const recognition = useSpeechRecognition();

  useEffect(() => {
    setXp(getProgress().totalXP);
  }, []);

  useEffect(() => {
    setWords(shuffle(getWordsByLevel(level)));
    setIndex(0);
    setResult(null);
    setScore(0);
    setTranscript('');
  }, [level]);

  const word = words[index];

  function handleMic() {
    if (!word) return;
    recognition.start((spoken) => {
      const correct = isCloseEnough(spoken, word.danish);
      setTranscript(spoken);
      setResult(correct ? 'correct' : 'wrong');
      recordWord(word.id, correct);
      if (correct) { addXP(15); setScore(s => s + 1); }
    });
  }

  function next() {
    setResult(null);
    setTranscript('');
    recognition.reset();
    if (index + 1 < words.length) setIndex(i => i + 1);
    else { setWords(shuffle(getWordsByLevel(level))); setIndex(0); }
  }

  if (!word) return <div className="flex items-center justify-center h-screen text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-blush flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-danish-red to-hot-pink text-white px-5 pt-12 pb-6">
        <h1 className="text-2xl font-black">🎤 Speak It</h1>
        <p className="text-white/70 text-sm mt-1">See English → Say it in Danish</p>
        {/* Level selector */}
        <div className="flex gap-2 mt-4">
          {LEVELS.map(l => (
            <button
              key={l.id}
              disabled={xp < l.xpReq}
              onClick={() => setLevel(l.id)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === l.id ? 'bg-white text-danish-red' :
                xp >= l.xpReq ? 'bg-white/20 text-white' : 'bg-white/10 text-white/30'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Score */}
      <div className="px-5 pt-4 flex justify-between text-sm text-slate-500">
        <span>Card {index + 1} / {words.length}</span>
        <span>✅ {score} correct this session</span>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <motion.div
          key={word.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full bg-white rounded-3xl shadow-lg border border-pink-100 p-8 text-center"
        >
          <div className="text-5xl mb-3">{word.emoji ?? '🇩🇰'}</div>
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Say in Danish:</p>
          <div className="text-3xl font-black text-slate-800">{word.english}</div>
          <div className="text-xs text-slate-400 mt-2 italic">Hint: {word.exampleEN}</div>
        </motion.div>

        {/* Result feedback */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`w-full rounded-2xl p-4 text-center ${
                result === 'correct' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="text-2xl">{result === 'correct' ? '✅' : '❌'}</div>
              <div className={`font-bold mt-1 ${result === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}>
                {result === 'correct' ? '+15 XP! Great!' : 'Not quite!'}
              </div>
              {transcript && <div className="text-xs text-slate-500 mt-1">You said: "{transcript}"</div>}
              <div className="text-xs text-slate-600 mt-1">Answer: <strong>{word.danish}</strong></div>
              {word.phonetic && <div className="text-xs text-slate-400 italic">[{word.phonetic}]</div>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => speak(word.danish)}
            className="flex-1 py-3 rounded-2xl bg-white border border-pink-200 text-danish-red font-bold text-sm active:scale-95 transition-transform"
          >
            🔊 Hear it
          </button>
          {!result ? (
            <motion.button
              onClick={handleMic}
              animate={recognition.state === 'listening' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
              disabled={recognition.state === 'listening' || recognition.state === 'requesting'}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm text-white active:scale-95 transition-transform ${
                recognition.state === 'listening'
                  ? 'bg-hot-pink animate-pulse'
                  : 'bg-gradient-to-r from-danish-red to-hot-pink'
              }`}
            >
              {recognition.state === 'listening' ? '🎤 Listening…' : '🎤 Speak'}
            </motion.button>
          ) : (
            <button onClick={next}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-danish-red to-hot-pink text-white font-bold text-sm active:scale-95 transition-transform">
              Next →
            </button>
          )}
        </div>

        {recognition.state === 'denied' && (
          <p className="text-xs text-red-400 text-center">Microphone access denied. Please allow mic access and reload.</p>
        )}
        {recognition.state === 'error' && (
          <p className="text-xs text-red-400 text-center">Speech recognition not supported in this browser. Try Chrome.</p>
        )}
      </div>
    </div>
  );
}

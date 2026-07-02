'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { buildQuizOptions, shuffle, getWordsByLevel } from '@/data/vocabulary';
import { addXP, recordWord, getProgress } from '@/lib/storage';
import { useAudio } from '@/hooks/useAudio';
import { VocabWord, LevelId } from '@/types';

type QuizMode = 'menu' | 'listen' | 'match';

const LEVEL_OPTIONS: { id: LevelId; label: string }[] = [
  { id: 'a1', label: 'A1' },
  { id: 'a2', label: 'A2' },
  { id: 'b1', label: 'B1' },
  { id: 'b2', label: 'B2' },
];

const THRESHOLDS: Record<LevelId, number> = { a1: 0, a2: 150, b1: 400, b2: 750 };

// ── Main menu ────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const [mode, setMode] = useState<QuizMode>('menu');
  const [level, setLevel] = useState<LevelId>('a1');
  const [xp, setXp] = useState(0);

  useEffect(() => { setXp(getProgress().totalXP); }, []);

  const isUnlocked = (lvl: LevelId) => xp >= THRESHOLDS[lvl];

  if (mode === 'listen') return <ListenChooseQuiz level={level} onBack={() => setMode('menu')} />;
  if (mode === 'match') return <MatchPairsQuiz level={level} onBack={() => setMode('menu')} />;

  return (
    <div className="min-h-screen bg-blush">
      <div className="bg-gradient-to-r from-hot-pink to-danish-red text-white px-5 pt-12 pb-6">
        <h1 className="text-2xl font-black">🎯 Quiz Mode</h1>
        <p className="text-white/70 text-sm mt-1">Test your Danish knowledge</p>
      </div>

      <div className="px-4 py-5">
        <div className="mb-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Level</h3>
          <div className="flex gap-2">
            {LEVEL_OPTIONS.map(l => (
              <button
                key={l.id}
                disabled={!isUnlocked(l.id)}
                onClick={() => setLevel(l.id)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  level === l.id
                    ? 'bg-danish-red text-white shadow-md'
                    : isUnlocked(l.id)
                      ? 'bg-white text-slate-600 border border-slate-200'
                      : 'bg-slate-100 text-slate-300'
                }`}
              >
                {l.label}{!isUnlocked(l.id) ? ' 🔒' : ''}
              </button>
            ))}
          </div>
        </div>

        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quiz Type</h3>
        <div className="flex flex-col gap-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setMode('listen')}
            className="bg-gradient-to-r from-danish-red to-rose-600 text-white rounded-2xl p-5 text-left shadow-md"
          >
            <div className="text-3xl mb-2">👂</div>
            <div className="font-black text-lg">Listen &amp; Choose</div>
            <div className="text-white/70 text-sm">Hear Danish, pick the English meaning</div>
            <div className="mt-2 text-xs bg-white/20 rounded-lg px-2 py-1 inline-block">+10 XP per correct</div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setMode('match')}
            className="bg-gradient-to-r from-hot-pink to-hot-pink-dark text-white rounded-2xl p-5 text-left shadow-md"
          >
            <div className="text-3xl mb-2">🔗</div>
            <div className="font-black text-lg">Match Pairs</div>
            <div className="text-white/70 text-sm">Connect Danish words to their English meanings</div>
            <div className="mt-2 text-xs bg-white/20 rounded-lg px-2 py-1 inline-block">+15 XP per round</div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ── Listen & Choose ──────────────────────────────────────────────────────────

function ListenChooseQuiz({ level, onBack }: { level: LevelId; onBack: () => void }) {
  // Stable pool — only shuffle once when level changes
  const [pool] = useState<VocabWord[]>(() => shuffle(getWordsByLevel(level)));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { speak } = useAudio();

  const word = pool[index];
  // Stable options — only recalculate when the word changes
  const options = useMemo(() => word ? buildQuizOptions(word, pool) : [], [index]);

  useEffect(() => {
    if (word) speak(word.danish);
  }, [index]);

  if (!word || done) return <QuizDone score={score} total={pool.length} onBack={onBack} />;

  function choose(opt: string) {
    if (selected) return;
    setSelected(opt);
    const correct = opt === word.english;
    recordWord(word.id, correct);
    if (correct) { addXP(10); setScore(s => s + 1); }
    setTimeout(() => {
      if (index + 1 >= pool.length) setDone(true);
      else { setIndex(i => i + 1); setSelected(null); }
    }, 900);
  }

  return (
    <div className="min-h-screen bg-blush flex flex-col">
      <div className="bg-gradient-to-r from-danish-red to-rose-600 text-white px-5 pt-10 pb-5">
        <button onClick={onBack} className="text-white/70 text-sm mb-3 block">← Back</button>
        <div className="flex justify-between items-center">
          <h2 className="font-black text-xl">👂 Listen &amp; Choose</h2>
          <span className="text-white/70 text-sm">{index + 1}/{pool.length}</span>
        </div>
        <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / pool.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <button
          onClick={() => speak(word.danish)}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-danish-red to-hot-pink text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform"
        >
          <span className="text-4xl">🔊</span>
          <span className="text-xs mt-1 opacity-80">Tap to hear</span>
        </button>
        <p className="text-slate-500 text-sm">What does this word mean?</p>
        <div className="w-full grid grid-cols-2 gap-3">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => choose(opt)}
              className={`py-4 rounded-2xl text-sm font-bold transition-all min-touch ${
                selected
                  ? opt === word.english
                    ? 'bg-emerald-500 text-white'
                    : opt === selected
                      ? 'bg-red-400 text-white'
                      : 'bg-slate-100 text-slate-400'
                  : 'bg-white border border-pink-100 text-slate-700 active:scale-95'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Match Pairs ──────────────────────────────────────────────────────────────

const PAIRS = 4;

function MatchPairsQuiz({ level, onBack }: { level: LevelId; onBack: () => void }) {
  const allLevelWords = useMemo(() => shuffle(getWordsByLevel(level)), [level]);
  const maxRounds = Math.max(1, Math.floor(allLevelWords.length / PAIRS));

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [selectedDA, setSelectedDA] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);

  // Stable word set for this round — only changes when round changes
  const wordSet = useMemo(
    () => allLevelWords.slice(round * PAIRS, round * PAIRS + PAIRS),
    [round]
  );
  const danish = useMemo(() => shuffle(wordSet.map(w => w.danish)), [round]);
  const english = useMemo(() => shuffle(wordSet.map(w => w.english)), [round]);

  if (done) return <QuizDone score={score} total={maxRounds} onBack={onBack} />;

  function selectDA(word: string) {
    if (matched.includes(word)) return;
    setSelectedDA(word);
    setWrong([]);
  }

  function selectEN(eng: string) {
    if (!selectedDA || matched.includes(eng)) return;
    const matchWord = wordSet.find(w => w.danish === selectedDA);
    if (matchWord?.english === eng) {
      const newMatched = [...matched, selectedDA, eng];
      setMatched(newMatched);
      recordWord(matchWord.id, true);
      setSelectedDA(null);
      if (newMatched.length === wordSet.length * 2) {
        addXP(15);
        setScore(s => s + 1);
        setTimeout(() => {
          if (round + 1 >= maxRounds) {
            setDone(true);
          } else {
            setRound(r => r + 1);
            setMatched([]);
            setSelectedDA(null);
            setWrong([]);
          }
        }, 600);
      }
    } else {
      setWrong([selectedDA, eng]);
      setTimeout(() => { setWrong([]); setSelectedDA(null); }, 700);
    }
  }

  return (
    <div className="min-h-screen bg-blush flex flex-col">
      <div className="bg-gradient-to-r from-hot-pink to-hot-pink-dark text-white px-5 pt-10 pb-5">
        <button onClick={onBack} className="text-white/70 text-sm mb-3 block">← Back</button>
        <div className="flex justify-between items-center">
          <h2 className="font-black text-xl">🔗 Match Pairs</h2>
          <span className="text-white/70 text-sm">Round {round + 1}/{maxRounds}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 pt-6 gap-4">
        <p className="text-slate-500 text-sm text-center">Tap a Danish word, then its English match</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            {danish.map(d => {
              const isMatched = matched.includes(d);
              const isSelected = selectedDA === d;
              const isWrong = wrong.includes(d);
              return (
                <button
                  key={d}
                  onClick={() => selectDA(d)}
                  className={`py-4 px-2 rounded-2xl text-sm font-bold transition-all text-center leading-snug min-touch ${
                    isMatched ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                    isWrong ? 'bg-red-100 text-red-500 border border-red-200' :
                    isSelected ? 'bg-danish-red text-white shadow-md' :
                    'bg-white text-slate-700 border border-pink-100 active:scale-95'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-3">
            {english.map(e => {
              const isMatched = matched.includes(e);
              const isWrong = wrong.includes(e);
              return (
                <button
                  key={e}
                  onClick={() => selectEN(e)}
                  className={`py-4 px-2 rounded-2xl text-sm font-bold transition-all text-center leading-snug min-touch ${
                    isMatched ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                    isWrong ? 'bg-red-100 text-red-500 border border-red-200' :
                    'bg-white text-slate-700 border border-pink-100 active:scale-95'
                  }`}
                >
                  {e}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Quiz Done ────────────────────────────────────────────────────────────────

function QuizDone({ score, total, onBack }: { score: number; total: number; onBack: () => void }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div className="min-h-screen bg-blush flex flex-col items-center justify-center px-6 text-center">
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="text-7xl mb-4">{pct >= 70 ? '🏆' : '📚'}</div>
        <h2 className="text-3xl font-black text-danish-red">Quiz Done!</h2>
        <div className="mt-4 bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
          <div className="text-4xl font-black text-hot-pink">{pct}%</div>
          <div className="text-slate-500 text-sm mt-1">{score} / {total} correct</div>
        </div>
        <button
          onClick={onBack}
          className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-danish-red to-hot-pink text-white font-bold"
        >
          Back to Quiz Menu
        </button>
      </motion.div>
    </div>
  );
}

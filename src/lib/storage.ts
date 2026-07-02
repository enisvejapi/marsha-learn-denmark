import { UserProgress, LevelId, WordProgress } from '@/types';

const KEY = 'marsha_denmark_v1';

const defaultProgress = (): UserProgress => ({
  totalXP: 0,
  streak: 0,
  lastActiveDate: '',
  words: {},
  categories: {},
  levels: {
    a1: { unlocked: true },
    a2: { unlocked: false },
    b1: { unlocked: false },
    b2: { unlocked: false },
  },
  settings: {
    audioRate: 0.82,
    audioEnabled: true,
    ttsLang: 'da-DK',
  },
});

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as UserProgress;
    // ensure all levels exist
    const def = defaultProgress();
    parsed.levels = { ...def.levels, ...parsed.levels };
    return parsed;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function addXP(amount: number): UserProgress {
  const p = getProgress();
  p.totalXP += amount;
  // unlock levels by XP
  if (p.totalXP >= 150) p.levels.a2.unlocked = true;
  if (p.totalXP >= 400) p.levels.b1.unlocked = true;
  if (p.totalXP >= 750) p.levels.b2.unlocked = true;
  // streak
  const today = new Date().toISOString().slice(0, 10);
  if (p.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    p.streak = p.lastActiveDate === yesterday ? p.streak + 1 : 1;
    p.lastActiveDate = today;
  }
  saveProgress(p);
  return p;
}

export function recordWord(wordId: string, correct: boolean): UserProgress {
  const p = getProgress();
  const existing: WordProgress = p.words[wordId] ?? {
    wordId,
    correct: 0,
    incorrect: 0,
    lastSeen: 0,
    mastered: false,
  };
  if (correct) existing.correct += 1;
  else existing.incorrect += 1;
  existing.lastSeen = Date.now();
  existing.mastered = existing.correct >= 4;
  p.words[wordId] = existing;
  saveProgress(p);
  return p;
}

export function getCategoryProgress(categoryId: string): { studied: number; mastered: number } {
  const p = getProgress();
  return p.categories[categoryId] ?? { studied: 0, mastered: 0 };
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}

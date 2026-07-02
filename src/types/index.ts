export type LevelId = 'a1' | 'a2' | 'b1' | 'b2';

export type CategoryId =
  | 'alphabet' | 'numbers' | 'greetings' | 'colors' | 'days-months' | 'basic-phrases'
  | 'family' | 'food-drinks' | 'shopping' | 'copenhagen-basics' | 'travel-phrases'
  | 'music' | 'art' | 'cph-streets' | 'roskilde'
  | 'archaeology' | 'architecture' | 'mythology' | 'cph-landmarks';

export interface VocabWord {
  id: string;
  danish: string;
  english: string;
  level: LevelId;
  category: CategoryId;
  phonetic?: string;
  exampleDA: string;
  exampleEN: string;
  tags: string[];
  emoji?: string;
  cultural?: string;
}

export interface Category {
  id: CategoryId;
  level: LevelId;
  nameDA: string;
  nameEN: string;
  emoji: string;
  color: string;
  bg: string;
  wordCount: number;
}

export interface Level {
  id: LevelId;
  label: string;
  emoji: string;
  unlockXP: number;
  categoryIds: CategoryId[];
  description: string;
}

export interface WordProgress {
  wordId: string;
  correct: number;
  incorrect: number;
  lastSeen: number;
  mastered: boolean;
}

export interface UserProgress {
  totalXP: number;
  streak: number;
  lastActiveDate: string;
  words: Record<string, WordProgress>;
  categories: Record<string, { studied: number; mastered: number }>;
  levels: Record<LevelId, { unlocked: boolean; completedAt?: string }>;
  settings: {
    audioRate: number;
    audioEnabled: boolean;
    ttsLang: 'da-DK';
  };
}

export type QuizType = 'listen-choose' | 'speak-it' | 'match-pairs' | 'flashcard';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  word: VocabWord;
  options?: string[];
  correctAnswer: string;
  xp: number;
}

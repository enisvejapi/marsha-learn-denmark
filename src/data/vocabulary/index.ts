import { VocabWord, Category, LevelId, CategoryId } from '@/types';
import { alphabetWords } from './a1/alphabet';
import { numberWords } from './a1/numbers';
import { greetingWords } from './a1/greetings';
import { colorWords } from './a1/colors';
import { daysMonthsWords } from './a1/days-months';
import { basicPhraseWords } from './a1/basic-phrases';
import { familyWords } from './a2/family';
import { foodDrinkWords } from './a2/food-drinks';
import { shoppingWords } from './a2/shopping';
import { copenhagenBasicsWords } from './a2/copenhagen-basics';
import { travelPhraseWords } from './a2/travel-phrases';
import { musicWords } from './b1/music';
import { artWords } from './b1/art';
import { cphStreetsWords } from './b1/cph-streets';
import { roskildeWords } from './b1/roskilde';
import { archaeologyWords } from './b2/archaeology';
import { mythologyWords } from './b2/mythology';
import { architectureWords } from './b2/architecture';
import { cphLandmarksWords } from './b2/cph-landmarks';
import { shuffle } from '@/lib/utils';

export const allWords: VocabWord[] = [
  ...alphabetWords,
  ...numberWords,
  ...greetingWords,
  ...colorWords,
  ...daysMonthsWords,
  ...basicPhraseWords,
  ...familyWords,
  ...foodDrinkWords,
  ...shoppingWords,
  ...copenhagenBasicsWords,
  ...travelPhraseWords,
  ...musicWords,
  ...artWords,
  ...cphStreetsWords,
  ...roskildeWords,
  ...archaeologyWords,
  ...mythologyWords,
  ...architectureWords,
  ...cphLandmarksWords,
];

export const allCategories: Category[] = [
  { id: 'alphabet', level: 'a1', nameDA: 'Alfabetet', nameEN: 'Alphabet', emoji: '🔤', color: 'text-danish-red', bg: 'from-danish-red to-red-700', wordCount: alphabetWords.length },
  { id: 'numbers', level: 'a1', nameDA: 'Tal', nameEN: 'Numbers', emoji: '🔢', color: 'text-rose-600', bg: 'from-rose-500 to-rose-700', wordCount: numberWords.length },
  { id: 'greetings', level: 'a1', nameDA: 'Hilsener', nameEN: 'Greetings', emoji: '👋', color: 'text-hot-pink', bg: 'from-hot-pink to-pink-700', wordCount: greetingWords.length },
  { id: 'colors', level: 'a1', nameDA: 'Farver', nameEN: 'Colours', emoji: '🎨', color: 'text-pink-600', bg: 'from-pink-500 to-pink-700', wordCount: colorWords.length },
  { id: 'days-months', level: 'a1', nameDA: 'Dage & Måneder', nameEN: 'Days & Months', emoji: '📅', color: 'text-danish-red', bg: 'from-danish-red-dark to-red-800', wordCount: daysMonthsWords.length },
  { id: 'basic-phrases', level: 'a1', nameDA: 'Grundsætninger', nameEN: 'Basic Phrases', emoji: '💬', color: 'text-rose-500', bg: 'from-rose-600 to-danish-red', wordCount: basicPhraseWords.length },
  { id: 'family', level: 'a2', nameDA: 'Familie', nameEN: 'Family', emoji: '👨‍👩‍👧', color: 'text-hot-pink', bg: 'from-hot-pink to-hot-pink-dark', wordCount: familyWords.length },
  { id: 'food-drinks', level: 'a2', nameDA: 'Mad & Drikke', nameEN: 'Food & Drinks', emoji: '🍽️', color: 'text-pink-600', bg: 'from-pink-600 to-rose-700', wordCount: foodDrinkWords.length },
  { id: 'shopping', level: 'a2', nameDA: 'Shopping', nameEN: 'Shopping', emoji: '🛍️', color: 'text-danish-red', bg: 'from-danish-red to-hot-pink', wordCount: shoppingWords.length },
  { id: 'copenhagen-basics', level: 'a2', nameDA: 'København Basis', nameEN: 'Copenhagen Basics', emoji: '🏙️', color: 'text-rose-600', bg: 'from-rose-500 to-danish-red', wordCount: copenhagenBasicsWords.length },
  { id: 'travel-phrases', level: 'a2', nameDA: 'Rejsefraser', nameEN: 'Travel Phrases', emoji: '✈️', color: 'text-hot-pink', bg: 'from-hot-pink-dark to-pink-800', wordCount: travelPhraseWords.length },
  { id: 'music', level: 'b1', nameDA: 'Musik', nameEN: 'Music', emoji: '🎸', color: 'text-danish-red', bg: 'from-danish-red to-rose-600', wordCount: musicWords.length },
  { id: 'art', level: 'b1', nameDA: 'Kunst', nameEN: 'Art', emoji: '🖼️', color: 'text-hot-pink', bg: 'from-hot-pink to-danish-red', wordCount: artWords.length },
  { id: 'cph-streets', level: 'b1', nameDA: 'Københavns Gader', nameEN: 'CPH Streets', emoji: '🛣️', color: 'text-rose-600', bg: 'from-rose-600 to-hot-pink', wordCount: cphStreetsWords.length },
  { id: 'roskilde', level: 'b1', nameDA: 'Roskilde', nameEN: 'Roskilde', emoji: '⚓', color: 'text-danish-red', bg: 'from-danish-red-dark to-hot-pink', wordCount: roskildeWords.length },
  { id: 'archaeology', level: 'b2', nameDA: 'Arkæologi', nameEN: 'Archaeology', emoji: '⛏️', color: 'text-hot-pink', bg: 'from-hot-pink to-danish-red', wordCount: archaeologyWords.length },
  { id: 'mythology', level: 'b2', nameDA: 'Mytologi', nameEN: 'Mythology', emoji: '⚡', color: 'text-rose-500', bg: 'from-danish-red to-rose-800', wordCount: mythologyWords.length },
  { id: 'architecture', level: 'b2', nameDA: 'Arkitektur', nameEN: 'Architecture', emoji: '🏗️', color: 'text-danish-red', bg: 'from-rose-700 to-hot-pink', wordCount: architectureWords.length },
  { id: 'cph-landmarks', level: 'b2', nameDA: 'CPH Seværdigheder', nameEN: 'CPH Landmarks', emoji: '🏛️', color: 'text-hot-pink', bg: 'from-hot-pink-dark to-danish-red', wordCount: cphLandmarksWords.length },
];

export function getWordsByLevel(level: LevelId): VocabWord[] {
  return allWords.filter(w => w.level === level);
}

export function getWordsByCategory(categoryId: CategoryId): VocabWord[] {
  return allWords.filter(w => w.category === categoryId);
}

export function getCategoryById(id: CategoryId): Category | undefined {
  return allCategories.find(c => c.id === id);
}

export function getCategoriesByLevel(level: LevelId): Category[] {
  return allCategories.filter(c => c.level === level);
}

export function getRandomWords(level: LevelId, count: number): VocabWord[] {
  return shuffle(getWordsByLevel(level)).slice(0, count);
}

export function buildQuizOptions(correct: VocabWord, pool: VocabWord[]): string[] {
  const distractors = shuffle(pool.filter(w => w.id !== correct.id))
    .slice(0, 3)
    .map(w => w.english);
  return shuffle([correct.english, ...distractors]);
}

export { shuffle };

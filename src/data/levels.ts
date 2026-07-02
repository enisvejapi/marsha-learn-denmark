import { Level } from '@/types';

export const levels: Level[] = [
  {
    id: 'a1',
    label: 'A1 — Beginner',
    emoji: '🌱',
    unlockXP: 0,
    description: 'Start from zero — alphabet, numbers, greetings, colours & basic phrases',
    categoryIds: ['alphabet', 'numbers', 'greetings', 'colors', 'days-months', 'basic-phrases'],
  },
  {
    id: 'a2',
    label: 'A2 — Elementary',
    emoji: '🌿',
    unlockXP: 150,
    description: 'Family, food, shopping and navigating Copenhagen like a local',
    categoryIds: ['family', 'food-drinks', 'shopping', 'copenhagen-basics', 'travel-phrases'],
  },
  {
    id: 'b1',
    label: 'B1 — Intermediate',
    emoji: '🌳',
    unlockXP: 400,
    description: 'Music, art, Copenhagen districts, and the historic city of Roskilde',
    categoryIds: ['music', 'art', 'cph-streets', 'roskilde'],
  },
  {
    id: 'b2',
    label: 'B2 — Advanced',
    emoji: '🏆',
    unlockXP: 750,
    description: 'Archaeology, Norse mythology, architecture & Copenhagen landmarks',
    categoryIds: ['archaeology', 'mythology', 'architecture', 'cph-landmarks'],
  },
];

export function getLevelById(id: string): Level | undefined {
  return levels.find(l => l.id === id);
}

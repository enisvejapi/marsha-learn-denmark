'use client';
import { useState, useCallback } from 'react';
import { UserProgress } from '@/types';
import { getProgress, addXP as storageAddXP, recordWord as storageRecordWord } from '@/lib/storage';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => getProgress());

  const refresh = useCallback(() => {
    setProgress(getProgress());
  }, []);

  const addXP = useCallback((amount: number) => {
    const updated = storageAddXP(amount);
    setProgress(updated);
    return updated;
  }, []);

  const recordWord = useCallback((wordId: string, correct: boolean) => {
    const updated = storageRecordWord(wordId, correct);
    setProgress(updated);
    return updated;
  }, []);

  return { progress, addXP, recordWord, refresh };
}

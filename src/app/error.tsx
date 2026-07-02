'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Marsha Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-blush flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-black text-danish-red mb-2">Something went wrong</h2>
      <p className="text-slate-500 text-sm mb-6">Don&apos;t worry — your progress is saved!</p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="py-3 rounded-2xl bg-gradient-to-r from-danish-red to-hot-pink text-white font-bold"
        >
          Try again
        </button>
        <Link
          href="/"
          className="py-3 rounded-2xl bg-white border border-pink-200 text-slate-700 font-bold text-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

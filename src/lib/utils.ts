export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/^(en|et|den|det)\s+/i, '')
    .replace(/[^a-zæøå\s]/gi, '')
    .trim();
}

export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

export function isCloseEnough(spoken: string, target: string): boolean {
  const a = normalizeAnswer(spoken);
  const b = normalizeAnswer(target);
  if (a === b) return true;
  const maxDist = Math.floor(b.length * 0.3);
  return levenshtein(a, b) <= maxDist;
}

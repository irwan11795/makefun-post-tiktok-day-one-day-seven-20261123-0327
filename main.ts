// Entry for the Day One, Day Seven TikTok bounty (Node 22, standard library only).
// The entry is the video itself: a short TikTok about the same tiny agent-built
// game on the day it was made and after a week of daily updates, ending with
// make.fun's referral end card carrying our referral code, posted publicly on
// TikTok with the bounty line and our play code in its caption. This program
// only hands the video's address to the gate: it copies VIDEO.json from the
// repository root to the output directory, where the house reads it and then
// reads the video's counts from TikTok. Nothing this program writes is scored.

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';

// The grading sandbox has made /output read-only before, so try the
// environment directory first, then /output, then a repo-local output
// directory, then the temporary directory. The gate reads VIDEO.json
// from wherever the program manages to write it.
const OUTPUT_CANDIDATES = [
  process.env.MAKEFUN_OUTPUT_DIR,
  '/output',
  join(BOT_DIR, 'output'),
  join(tmpdir(), 'makefun-output'),
].filter((d): d is string => Boolean(d));

let wrote = false;
for (const dir of OUTPUT_CANDIDATES) {
  try {
    mkdirSync(dir, { recursive: true });
    copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(dir, 'VIDEO.json'));
    wrote = true;
    break;
  } catch {
    // Try the next candidate.
  }
}
if (!wrote) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}`);
  process.exit(1);
}

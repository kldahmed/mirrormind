import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ChallengeEntry } from "@/lib/challenge";

const DATA_DIR = path.join(process.cwd(), ".mirrormind");
const DATA_FILE = path.join(DATA_DIR, "challenge-leaderboard.json");

const ensureDir = async () => {
  await mkdir(DATA_DIR, { recursive: true });
};

export const readChallengeEntries = async (): Promise<ChallengeEntry[]> => {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as ChallengeEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const writeChallengeEntries = async (entries: ChallengeEntry[]) => {
  await ensureDir();
  await writeFile(DATA_FILE, JSON.stringify(entries.slice(0, 300), null, 2), "utf8");
};
import { NextResponse } from "next/server";
import type { ChallengeEntry } from "@/lib/challenge";
import { isValidPlayerName, sanitizeDisplayName } from "@/lib/challenge";
import { readChallengeEntries, writeChallengeEntries } from "@/lib/challengeServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get("gameId");
  const entries = await readChallengeEntries();

  const filtered = gameId ? entries.filter((entry) => entry.gameId === gameId) : entries;
  return NextResponse.json({ entries: filtered });
}

export async function POST(request: Request) {
  const body = (await request.json()) as ChallengeEntry;
  const playerName = sanitizeDisplayName(body?.playerName ?? "");

  if (!body?.id || !body?.gameId || typeof body.score !== "number" || !isValidPlayerName(playerName)) {
    return NextResponse.json({ error: "Invalid challenge entry" }, { status: 400 });
  }

  const entries = await readChallengeEntries();
  await writeChallengeEntries([{ ...body, playerName }, ...entries]);

  return NextResponse.json({ ok: true });
}
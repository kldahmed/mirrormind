import { NextResponse } from "next/server";
import { isValidPlayerName, sanitizeDisplayName, type LeaderboardScope } from "@/lib/challenge";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dayMs = 24 * 60 * 60 * 1000;

const getScopeStart = (scope: LeaderboardScope) => {
  if (scope === "all") return null;

  const now = new Date();
  const startOfTodayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const startMs = scope === "today" ? startOfTodayUtc : startOfTodayUtc - 6 * dayMs;
  return new Date(startMs).toISOString();
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scopeParam = searchParams.get("scope");
  const scope: LeaderboardScope =
    scopeParam === "today" || scopeParam === "week" || scopeParam === "all" ? scopeParam : "all";

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  let query = supabase
    .from("leaderboard")
    .select("id, player_name, score, time, game, created_at")
    .order("score", { ascending: false })
    .order("time", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })
    .limit(300);

  const start = getScopeStart(scope);
  if (start) {
    query = query.gte("created_at", start);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }

  return NextResponse.json({ entries: data ?? [] });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    player_name?: unknown;
    score?: unknown;
    time?: unknown;
    game?: unknown;
  };
  const playerName = sanitizeDisplayName(typeof body?.player_name === "string" ? body.player_name : "");
  const game = typeof body?.game === "string" ? body.game : "";
  const score = typeof body?.score === "number" ? body.score : NaN;
  const time = body?.time === null || typeof body?.time === "number" ? body.time : null;
  const validGame = game === "decision" || game === "memory" || game === "risk" || game === "intuition" || game === "focus";

  if (!validGame || !Number.isFinite(score) || !isValidPlayerName(playerName)) {
    return NextResponse.json({ error: "Invalid challenge entry" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const { error } = await supabase.from("leaderboard").insert({
    player_name: playerName,
    score,
    time,
    game,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to save challenge entry" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
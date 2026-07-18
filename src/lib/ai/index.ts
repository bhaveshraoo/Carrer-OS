import { claudeJson } from "@/lib/anthropic/client";
import { geminiJson } from "@/lib/ai/gemini";

export type AiProvider = "anthropic" | "gemini";

/**
 * Every AI feature in this app (resume extraction/scoring/rewrites, and later
 * company data + DSA generation) calls this instead of a provider SDK directly.
 *
 * Switch providers with one env var — no code changes anywhere else:
 *   AI_PROVIDER=gemini    -> free tier, good for Weeks 2-3 development/testing
 *   AI_PROVIDER=anthropic -> paid, higher-quality structured output, use for launch
 *
 * Why an abstraction instead of just swapping the import: you'll almost certainly
 * want to switch back to Claude before charging real users — see the note in
 * docs/30-day-build-guide.md and CLAUDE.md on why. This makes that a one-line change.
 */
export async function generateJson<T>(params: {
  system: string;
  prompt: string;
  maxTokens?: number;
}): Promise<T> {
  const provider = (process.env.AI_PROVIDER as AiProvider) || "gemini";

  if (provider === "gemini") {
    return geminiJson<T>(params);
  }
  return claudeJson<T>(params);
}

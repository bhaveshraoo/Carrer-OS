import Anthropic from "@anthropic-ai/sdk";

// Server-only — never import this from a "use client" component.
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = "claude-sonnet-5";

/**
 * Calls Claude with a prompt that must return JSON, parses the response, and
 * retries once with the parse error fed back in if the model returns malformed JSON.
 * Every AI feature in this app (extraction, scoring, rewrites) goes through this —
 * one place to tune retry/guardrail behavior instead of duplicating it per feature.
 */
export async function claudeJson<T>(params: {
  system: string;
  prompt: string;
  maxTokens?: number;
}): Promise<T> {
  const { system, prompt, maxTokens = 4096 } = params;

  async function attempt(extra?: string): Promise<T> {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: extra ? `${prompt}\n\n${extra}` : prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned) as T;
  }

  try {
    return await attempt();
  } catch (err) {
    // One retry, telling the model exactly what went wrong — cheaper and more
    // reliable than failing the whole request on a formatting slip.
    return attempt(
      `Your previous response could not be parsed as JSON (${(err as Error).message}). Return ONLY valid JSON, no markdown fences, no commentary.`
    );
  }
}

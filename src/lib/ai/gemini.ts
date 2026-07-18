import { GoogleGenAI } from "@google/genai";

// Server-only — never import this from a "use client" component.
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Free tier (as of mid-2026) covers Flash-Lite / Flash generations — Pro is paid-only.
// gemini-2.5-flash was pulled for NEW API keys ahead of its official Oct 2026
// deprecation date (confirmed on Google's own developer forum, and hit in this
// project directly) — Google is fast-tracking new signups onto the 3.x generation.
// Check aistudio.google.com yourself before assuming this string is still current;
// this has now changed twice during this project alone.
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

export async function geminiJson<T>(params: {
  system: string;
  prompt: string;
  maxTokens?: number;
}): Promise<T> {
  const { system, prompt, maxTokens = 4096 } = params;

  async function attempt(extra?: string): Promise<T> {
    const response = await genai.models.generateContent({
      model: GEMINI_MODEL,
      contents: extra ? `${prompt}\n\n${extra}` : prompt,
      config: {
        systemInstruction: system,
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json", // Gemini-native JSON mode — no fence-stripping needed
      },
    });

    const raw = response.text ?? "";
    return JSON.parse(raw.trim()) as T;
  }

  try {
    return await attempt();
  } catch (err) {
    return attempt(
      `Your previous response could not be parsed as JSON (${(err as Error).message}). Return ONLY valid JSON.`
    );
  }
}

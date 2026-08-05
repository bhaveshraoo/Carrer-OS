import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL } from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 45;

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { messages } = await request.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
  }

  // Fetch candidate's latest analyzed resume
  const { data: resumes } = await table(supabase, "resumes")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "analyzed");

  const latestResume = resumes?.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  if (!latestResume?.raw_text) {
    return NextResponse.json(
      { error: "No analyzed resume found. Please upload a resume first." },
      { status: 400 }
    );
  }

  const candidateText = latestResume.raw_text;

  // Format conversation history for Gemini
  const formattedPrompt = `
Candidate Resume Content:
"""
${candidateText}
"""

User Question:
"${messages[messages.length - 1].content}"
`;

  try {
    const response = await genai.models.generateContent({
      model: GEMINI_MODEL,
      contents: formattedPrompt,
      config: {
        systemInstruction:
          "You are the CareerOS Resume AI Strategist & ATS Coach. " +
          "Your SOLE task is to answer user questions ONLY related to their uploaded resume, project bullet points, ATS formatting, technical skills, and career improvements. " +
          "If the user asks anything unrelated to their resume, career, or job application (e.g. weather, recipes, sports), politely decline and remind them: " +
          "'I am your CareerOS Resume Strategist. I can only answer questions related to your resume, bullet points, skills, and ATS optimization.' " +
          "FORMATTING INSTRUCTIONS FOR HIGH READABILITY:\n" +
          "- Keep paragraphs short and scannable.\n" +
          "- Use `### Heading Title` for major sections.\n" +
          "- Use bold `**text**` for key takeaways, skills, and metric suggestions.\n" +
          "- Use clean bullet points `* Item` for lists.\n" +
          "- Never output raw LaTeX like `$\\rightarrow$`; use clean unicode arrows `→`.",
        maxOutputTokens: 2048,
      },
    });

    const reply = response.text || "I apologize, I could not generate a response. Please try rephrasing your resume question.";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Gemini Resume Chat Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process chat message." },
      { status: 500 }
    );
  }
}

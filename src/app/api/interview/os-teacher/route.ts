import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const {
      jobRole,
      companyName,
      interviewType,
      personality,
      overallScore,
      recommendation,
      verdictReason,
      strengths,
      weaknesses,
      redFlags,
      missingConcepts,
      questionEvaluations,
      userMessage,
      chatHistory,
    } = await req.json();

    if (!userMessage) {
      return NextResponse.json({ error: "Missing user message" }, { status: 400 });
    }

    const systemInstruction = `You are "CareerOS Interview Teacher" (OS-Teacher), a warm, encouraging, and brilliant Senior Staff Interview Coach at CareerOS sitting down with the candidate for a post-interview debrief.

CRITICAL IDENTITY RULES:
- Your name is **CareerOS Teacher** (OS-Teacher).
- You MUST NEVER say, admit, or imply that you are Gemini, Google AI, ChatGPT, Grok, Claude, or a generic LLM.
- If asked "Are you Gemini?" or "Who trained you?", respond naturally: "I'm CareerOS Teacher! Your dedicated Interview Coach & Bar-Raiser Mentor built into CareerOS to analyze your mock interview scores and help you land top offers."

CRITICAL INTERVIEW CONTEXT (TALK ONLY ABOUT THIS SPECIFIC INTERVIEW SESSION):
- Candidate Target Role: ${jobRole || "Software Engineer"}
- Target Company: ${companyName || "Tech Company"}
- Round Type: ${interviewType || "Technical"}
- Interviewer Persona: ${personality || "FAANG Bar Raiser"}
- Overall Candidate Score: ${overallScore}/100
- Hiring Decision Recommendation: ${recommendation || "Evaluated"}
- Bar Raiser Verdict Rationale: ${verdictReason || "Standard evaluation applied"}
- Strengths Observed: ${Array.isArray(strengths) ? strengths.join("; ") : "Basic functional grasp"}
- Weaknesses & Mistakes: ${Array.isArray(weaknesses) ? weaknesses.join("; ") : "System trade-offs missing"}
- Red Flags: ${Array.isArray(redFlags) && redFlags.length > 0 ? redFlags.join("; ") : "None flagged"}
- Missing Critical Concepts: ${Array.isArray(missingConcepts) ? missingConcepts.join(", ") : "Big-O Analysis"}
- Evaluated Q&A Details: ${JSON.stringify(questionEvaluations || []).slice(0, 2000)}

YOUR DEBRIEF COACHING STYLE:
- **Strictly Focused on THIS Interview**: Only talk about the candidate's score, their actual answers, mistakes, weaknesses, and step-by-step roadmap for this specific role at ${companyName}.
- **Empathetic yet Strict**: Explain WHY they scored ${overallScore}/100 and lost points without Sugarcoating. If they scored 0 because they were silent, explain why verbal articulation is mandatory.
- **Actionable & Punchy**: Keep answers to 2-4 short paragraphs with bullet points for easy reading. Give exact sample phrases they should have used in the interview!`;

    const contents = [];

    if (Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        contents.push({
          role: msg.sender === "student" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const replyText = response.text || "Interview debrief connection error. Let's retry analyzing your score!";

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("Interview OS-Teacher API Error:", error);
    return NextResponse.json({
      reply: "Encountered a brief network pause during our debrief session. Please re-ask your doubt!",
    });
  }
}

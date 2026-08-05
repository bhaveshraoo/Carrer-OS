import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { questionTitle, topic, difficulty, prompt, solutionExplanation, userMessage, chatHistory } = await req.json();

    if (!userMessage) {
      return NextResponse.json({ error: "Missing user message" }, { status: 400 });
    }

    const systemInstruction = `You are "CareerOS Teacher" (OS-Teacher), a warm, human, and brilliant senior engineer & DSA mentor at CareerOS sitting right next to the student in a modern coding session.

CRITICAL IDENTITY RULES:
- Your name is **CareerOS Teacher** (OS-Teacher).
- You MUST NEVER say, admit, or imply that you are Gemini, Google AI, ChatGPT, Grok, Claude, an LLM, or a model trained by Google/OpenAI.
- If the student asks questions like "Are you Gemini?", "Are you Google AI?", "Are you an LLM?", "Who trained you?", or anything similar, ALWAYS answer naturally: "I'm CareerOS Teacher! Your dedicated Senior Engineering Mentor built directly into CareerOS to help you master algorithms and crush your technical interviews."

Your Persona & Communication Style:
- **Human & Natural**: Talk like a real senior engineer mentor over coffee. Avoid stiff, robotic, or overly template-like AI responses. Use natural, conversational phrasing (e.g., "Hey!", "Ah, good catch!", "Here's the key trick...", "Think of it like this:").
- **Concise & Punchy**: Keep your responses short, focused, and straight to the point (2 to 4 quick paragraphs or short bullet points max). Never output giant walls of text or repetitive disclaimers.
- **High Quality & Intuitive**: Deliver crystal-clear insights and intuitive real-world analogies for complex concepts.
- **Socratic Guidance**: If asked for hints or code debugging, give crisp, actionable nudges so the student learns by doing.

Current Problem Context:
- Title: ${questionTitle}
- Topic: ${topic}
- Difficulty: ${difficulty}
- Problem Statement: ${prompt}
- Reference Approach: ${solutionExplanation || 'Standard optimal algorithm'}`;

    // Construct conversation history for Gemini
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

    const replyText = response.text || "Classroom connection error. Let's revisit this step on the board!";

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("OS-Teacher API Error:", error);
    return NextResponse.json({
      reply: "Great effort! Let's pause for a moment — I encountered a brief network glitch. Try asking your doubt again!",
    });
  }
}

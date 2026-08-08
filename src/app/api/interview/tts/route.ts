import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    // Call Google AI Studio Gemini 2.0 Flash Experimental API for Audio Generation
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an executive tech interviewer. Read the following question out loud in a warm, professional, human voice: "${text}"`,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Puck", // Puck, Aoede, Charon, Kore, Fenrir
              },
            },
          },
        },
      }),
    });

    const geminiData = await geminiRes.json();
    const candidatePart = geminiData.candidates?.[0]?.content?.parts?.[0];

    if (candidatePart && "inlineData" in candidatePart && candidatePart.inlineData?.data) {
      return NextResponse.json({
        success: true,
        audioBase64: candidatePart.inlineData.data,
        mimeType: candidatePart.inlineData.mimeType || "audio/pcm;rate=24000",
      });
    }

    return NextResponse.json(
      { error: geminiData.error?.message || "Failed to generate human audio from Gemini" },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("POST /api/interview/tts Error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate human audio" }, { status: 500 });
  }
}

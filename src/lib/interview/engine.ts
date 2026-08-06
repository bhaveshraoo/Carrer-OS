import { generateJson } from "@/lib/ai";
import type {
  InterviewSession,
  InterviewMemory,
  InterviewReport,
} from "./schema";

export interface BlueprintOutput {
  sections: Array<{ name: string; duration_minutes: number; goal: string }>;
  core_questions: string[];
}

export interface NextQuestionOutput {
  evaluation: {
    clarity_score: number;
    relevance_score: number;
    technical_depth_score: number;
    feedback: string;
    key_points_covered: string[];
    missing_aspects: string[];
  };
  memory_update: {
    strong_skills: string[];
    weak_skills: string[];
    communication_rating: string;
    confidence_score: number;
    topics_covered: string[];
    resume_references: string[];
  };
  interviewer_action: "followup" | "challenge" | "next_topic" | "next_section" | "end_interview";
  interviewer_response: string; // Speech text for current turn
  next_question_text: string;
  section: string;
  is_final_question: boolean;
}

export interface FinalReportOutput {
  overall_score: number;
  communication_score: number;
  technical_score: number;
  problem_solving_score: number;
  confidence_score: number;
  behavior_score: number;
  hiring_recommendation: "Strong Hire" | "Hire" | "Leaning Hire" | "No Hire";
  candidate_verdict_reason?: string;
  strengths: string[];
  weaknesses: string[];
  red_flags?: string[];
  missing_critical_concepts?: string[];
  interview_summary: string;
  question_evaluations?: Array<{
    question_number: number;
    question_text: string;
    answer_text: string;
    score: number;
    feedback: string;
    key_points_covered: string[];
    missing_aspects: string[];
  }>;
  learning_roadmap: Array<{
    step: number;
    topic: string;
    action: string;
    resources: string;
  }>;
}

/**
 * 1. Generate Interview Blueprint via Gemini 3.1 Flash Lite
 */
export async function generateInterviewBlueprint(params: {
  job_role: string;
  company_name: string;
  job_description: string;
  experience: string;
  tech_stack: string[];
  difficulty: string;
  interview_type: string;
  duration_minutes: number;
  personality: string;
  resume_text?: string;
}): Promise<BlueprintOutput> {
  const prompt = `You are a Senior Staff Interviewer at ${params.company_name} conducting a ${params.duration_minutes}-minute ${params.interview_type} interview for the role of ${params.job_role}.
Interviewer Personality Profile: ${params.personality}.
Difficulty Level: ${params.difficulty}.

Candidate Experience: ${params.experience}.
Required Tech Stack: ${params.tech_stack.join(", ")}.

Job Description Excerpt:
${params.job_description.slice(0, 1500)}

Candidate Resume Excerpt:
${(params.resume_text || "No resume text provided").slice(0, 1500)}

Return ONLY valid JSON matching this schema:
{
  "sections": [
    { "name": "Introduction & Warm-up", "duration_minutes": 3, "goal": "Verify identity and set expectations" },
    { "name": "Resume & Project Deep-Dive", "duration_minutes": 8, "goal": "Probe candidate's key project claims and system choices" },
    { "name": "Core Technical & Architecture Round", "duration_minutes": 12, "goal": "Test technical depth, algorithm speed, and trade-offs" },
    { "name": "Behavioral & Situation Scenarios", "duration_minutes": 5, "goal": "Assess conflict resolution and leadership principles" },
    { "name": "Closing & Candidate Questions", "duration_minutes": 2, "goal": "Wrap up naturally" }
  ],
  "core_questions": [
    "Array of 10 to 12 starting questions aligned with the candidate's resume and target role"
  ]
}`;

  try {
    const result = await generateJson<BlueprintOutput>({
      system: `You are an expert AI Technical Recruiter at ${params.company_name}. Output strictly valid JSON.`,
      prompt,
    });
    if (result && result.sections && result.core_questions) {
      return result;
    }
  } catch (err) {
    console.warn("Notice: Blueprint generation fallback used:", err);
  }

  // Fallback blueprint
  return {
    sections: [
      { name: "Introduction", duration_minutes: 3, goal: "Welcome candidate" },
      { name: "Resume Discussion", duration_minutes: 8, goal: "Review past experience" },
      { name: "Technical Round", duration_minutes: 12, goal: "Evaluate tech stack and problem solving" },
      { name: "Behavioral Round", duration_minutes: 5, goal: "Assess team communication" },
      { name: "Closing", duration_minutes: 2, goal: "Final wrap-up" },
    ],
    core_questions: [
      `Could you introduce yourself and highlight your most challenging engineering project?`,
      `In your resume, you mentioned working with ${params.tech_stack[0] || "modern tech stack"}. Can you walk me through your system architecture?`,
      `How do you approach latency bottlenecks and memory optimization under high traffic?`,
      `Tell me about a technical disagreement you had with a team member and how you resolved it.`,
      `Why are you interested in joining ${params.company_name} as a ${params.job_role}?`,
    ],
  };
}

/**
 * 2. Evaluate Answer & Get Next Question / Action
 */
export async function evaluateAnswerAndGetNextQuestion(params: {
  session: InterviewSession;
  current_question: string;
  current_section: string;
  question_number: number;
  transcript: string;
  duration_seconds: number;
  remaining_minutes: number;
  memory: InterviewMemory;
  conversation_history: Array<{ question: string; answer: string }>;
}): Promise<NextQuestionOutput> {
  const trimmedAnswer = (params.transcript || "").trim();
  const wordCount = trimmedAnswer ? trimmedAnswer.split(/\s+/).length : 0;

  // Strict local handling for empty, silent, or minimal answers
  if (wordCount < 3) {
    const isFinal = params.remaining_minutes <= 3 || params.question_number >= 8;
    return {
      evaluation: {
        clarity_score: 0,
        relevance_score: 0,
        technical_depth_score: 0,
        feedback: "Candidate remained silent or did not provide a verbal answer.",
        key_points_covered: [],
        missing_aspects: ["Verbal explanation", "Technical response", "Concept elaboration"],
      },
      memory_update: {
        strong_skills: params.memory.strong_skills,
        weak_skills: Array.from(new Set([...params.memory.weak_skills, "Verbal Communication", params.current_section])),
        communication_rating: "No Answer Provided",
        confidence_score: Math.max(0, params.memory.confidence_score - 25),
        topics_covered: Array.from(new Set([...params.memory.topics_covered, params.current_section])),
        resume_references: params.memory.resume_references,
      },
      interviewer_action: isFinal ? "end_interview" : "next_topic",
      interviewer_response: isFinal
        ? "I noticed you didn't provide an answer to this question. That concludes our discussion for today."
        : "I didn't catch an answer for that. Let's move on to the next question.",
      next_question_text: isFinal
        ? "Do you have any final questions before we conclude?"
        : `Let's discuss ${params.session.tech_stack[0] || "core architecture"}. Can you explain how you handle production error logging?`,
      section: params.current_section,
      is_final_question: isFinal,
    };
  }

  const prompt = `You are a real interviewer (${params.session.personality}) at ${params.session.company_name} conducting a ${params.session.interview_type} interview for ${params.session.job_role}.

STRICT EVALUATION RULES:
- Evaluate STRICTLY based on what the candidate actually said in the transcript.
- If the answer is vague, off-topic, or lacks technical depth, give low scores (0-40).
- Only award high scores (>75) if the candidate provided clear technical detail, exact concepts, or trade-off reasoning.

Current Section: ${params.current_section} (Question #${params.question_number})
Time Remaining: ${params.remaining_minutes} minutes.
Interviewer Personality Rules:
- Friendly Recruiter: Encouraging, supportive, probes culture fit.
- Professional HR: Structured, clear, evaluates STAR behavioral scenarios.
- Strict Engineering Manager: Direct, challenges hand-waving, demands exact system trade-offs.
- Startup Founder: High-speed, pragmatic, tests ownership and bias for action.
- Senior FAANG Engineer: Deep CS fundamentals, algorithmic rigor, trade-off analysis.

Question Asked:
"${params.current_question}"

Candidate Spoken Answer:
"${params.transcript}"

Current Interview Memory:
- Strong Skills: ${params.memory.strong_skills.join(", ") || "None yet"}
- Weak Skills: ${params.memory.weak_skills.join(", ") || "None yet"}
- Topics Covered: ${params.memory.topics_covered.join(", ") || "None yet"}

Respond ONLY with valid JSON matching this schema:
{
  "evaluation": {
    "clarity_score": 85,
    "relevance_score": 90,
    "technical_depth_score": 80,
    "feedback": "Short constructive evaluation of the answer",
    "key_points_covered": ["Array of correct concepts mentioned"],
    "missing_aspects": ["Array of missed concepts"]
  },
  "memory_update": {
    "strong_skills": ["Updated array of confirmed skills"],
    "weak_skills": ["Updated array of weak/struggling skills"],
    "communication_rating": "Clear / Concise / Needs Improvement",
    "confidence_score": 85,
    "topics_covered": ["Updated topics list"],
    "resume_references": ["Resume projects referenced"]
  },
  "interviewer_action": "followup" | "challenge" | "next_topic" | "next_section" | "end_interview",
  "interviewer_response": "Short 1-2 sentence transition statement spoken by the interviewer",
  "next_question_text": "The next question or follow-up question to ask the candidate",
  "section": "Name of section",
  "is_final_question": false
}`;

  try {
    const result = await generateJson<NextQuestionOutput>({
      system: `You are acting strictly as an interviewer (${params.session.personality}). Enforce strict grading based only on spoken answers. Return ONLY valid JSON.`,
      prompt,
    });
    if (result && result.next_question_text) {
      return result;
    }
  } catch (err) {
    console.warn("Notice: Next question evaluation fallback used:", err);
  }

  // Fallback next question with word count penalty check
  const isFinal = params.remaining_minutes <= 3 || params.question_number >= 8;
  const isLowQuality = wordCount < 15;
  return {
    evaluation: {
      clarity_score: isLowQuality ? 25 : 70,
      relevance_score: isLowQuality ? 20 : 75,
      technical_depth_score: isLowQuality ? 15 : 65,
      feedback: isLowQuality
        ? "Answer was very brief and lacked technical detail or explanation."
        : "Answer addressed the surface question but lacked deep architectural trade-offs.",
      key_points_covered: isLowQuality ? [] : ["Basic response"],
      missing_aspects: ["Big-O Complexity", "Edge-case handling", "Quantified results"],
    },
    memory_update: {
      strong_skills: params.memory.strong_skills,
      weak_skills: isLowQuality ? Array.from(new Set([...params.memory.weak_skills, "Detailed Elaboration"])) : params.memory.weak_skills,
      communication_rating: isLowQuality ? "Needs Improvement" : "Fair",
      confidence_score: isLowQuality ? 30 : 70,
      topics_covered: Array.from(new Set([...params.memory.topics_covered, params.current_section])),
      resume_references: params.memory.resume_references,
    },
    interviewer_action: isFinal ? "end_interview" : "next_topic",
    interviewer_response: isFinal
      ? "Thank you for participating today. That concludes our interview session."
      : "Understood. Let's move on to the next topic.",
    next_question_text: isFinal
      ? "Do you have any final questions for me?"
      : `How do you handle scaling and error handling when deploying ${params.session.tech_stack[0] || "services"} in production?`,
    section: params.current_section,
    is_final_question: isFinal,
  };
}

/**
 * 3. Generate Final Recruiter Evaluation Report
 */
export async function generateFinalInterviewReport(params: {
  session: InterviewSession;
  memory: InterviewMemory;
  full_transcript: Array<{ question: string; answer: string }>;
  analytics: {
    avg_speaking_speed_wpm: number;
    filler_words_total: number;
    long_pauses_count: number;
    face_visible_pct: number;
    low_noise_pct: number;
  };
}): Promise<FinalReportOutput> {
  // Compute total spoken words across the entire transcript
  const allSpokenText = params.full_transcript.map((t) => (t.answer || "").trim()).join(" ");
  const totalWordsSpoken = allSpokenText ? allSpokenText.split(/\s+/).filter(Boolean).length : 0;

  // STRICT ZERO RULE: If candidate said nothing or total words < 5 across the entire session
  if (totalWordsSpoken < 5) {
    return {
      overall_score: 0,
      communication_score: 0,
      technical_score: 0,
      problem_solving_score: 0,
      confidence_score: 0,
      behavior_score: 0,
      hiring_recommendation: "No Hire",
      candidate_verdict_reason: `REJECTED: The candidate remained silent and did not provide any verbal or written answers during the interview for ${params.session.job_role} at ${params.session.company_name}. Zero technical knowledge or communication capability was demonstrated.`,
      strengths: [
        "None — Candidate did not answer any interview questions",
      ],
      weaknesses: [
        "Zero verbal communication provided during the session",
        "Failed to answer all technical and behavioral questions asked",
        "Complete lack of engagement with the interviewer",
      ],
      red_flags: [
        "Candidate total silence / complete failure to participate in the interview",
      ],
      missing_critical_concepts: [
        "All required technical & domain concepts for the role",
      ],
      interview_summary: `The candidate initiated a ${params.session.duration_minutes}-minute ${params.session.interview_type} mock interview for the role of ${params.session.job_role} at ${params.session.company_name}.\n\nDuring the session, the candidate provided zero verbal responses across all questions asked (0 total words recorded).\n\nFinal Recommendation: NO HIRE. Score: 0/100. Candidate must re-interview and verbally articulate answers to receive a valid technical evaluation.`,
      question_evaluations: params.full_transcript.map((item, idx) => ({
        question_number: idx + 1,
        question_text: item.question,
        answer_text: item.answer || "[No verbal response recorded / Candidate was silent]",
        score: 0,
        feedback: "No answer provided by candidate.",
        key_points_covered: [],
        missing_aspects: ["Entire answer missing"],
      })),
      learning_roadmap: [
        {
          step: 1,
          topic: "Verbal Articulation & Interview Practice",
          action: "Practice speaking answers out loud in 60-90 second structured formats using the STAR framework.",
          resources: "CareerOS Voice Communication Fundamentals",
        },
        {
          step: 2,
          topic: "Core Technical Concepts",
          action: "Review baseline technical concepts for your target role so you can comfortably explain solutions during mock sessions.",
          resources: "CareerOS DSA & System Architecture Roadmaps",
        },
      ],
    };
  }

  const prompt = `You are a Strict Senior Engineering Bar Raiser & Executive Technical Recruiter evaluating a candidate for the role of ${params.session.job_role} at ${params.session.company_name}.

CRITICAL MANDATES FOR STRICT SCORING:
- You MUST evaluate strictly based ONLY on what the candidate actually said in the transcript below.
- Total Spoken Words in Session: ${totalWordsSpoken} words.
- If total spoken words is very low (< 30 words), overall_score MUST NOT exceed 25/100, and recommendation MUST be 'No Hire'.
- Do NOT hallucinate candidate strengths or give benefit of the doubt.
- Penalize vague hand-waving, incorrect Big-O claims, missing edge-case handling, or lack of quantitative metrics.

Interview Details:
- Target Role: ${params.session.job_role}
- Company: ${params.session.company_name}
- Round Type: ${params.session.interview_type}
- Difficulty Standard: ${params.session.difficulty}
- Interviewer Persona: ${params.session.personality}

Candidate Spoken Performance Metrics:
- Speaking Pace: ${params.analytics.avg_speaking_speed_wpm} WPM
- Filler Words Used: ${params.analytics.filler_words_total}
- Confirmed Skills Demonstrated: ${params.memory.strong_skills.join(", ") || "None confirmed"}
- Weak / Struggling Concepts: ${params.memory.weak_skills.join(", ") || "General Technical Depth"}
- Confidence Level: ${params.memory.confidence_score}%

Complete Interview Q&A Transcript:
${params.full_transcript.map((t, i) => `[Question ${i + 1}]: ${t.question}\n[Candidate Answer]: ${t.answer || "[No response]"}`).join("\n\n")}

Evaluate the candidate across every dimension and return ONLY valid JSON matching this schema:
{
  "overall_score": 78,
  "communication_score": 75,
  "technical_score": 80,
  "problem_solving_score": 76,
  "confidence_score": 78,
  "behavior_score": 80,
  "hiring_recommendation": "Strong Hire" | "Hire" | "Leaning Hire" | "No Hire",
  "candidate_verdict_reason": "Detailed 2-3 sentence justification explaining the exact bar-raiser decision.",
  "strengths": [
    "3 to 4 specific technical strengths demonstrated during the interview with evidence"
  ],
  "weaknesses": [
    "3 to 4 specific technical weaknesses or hand-waving instances observed"
  ],
  "red_flags": [
    "High-severity mistakes, incorrect complexity claims, or missing core principles"
  ],
  "missing_critical_concepts": [
    "Specific tech stack terms, design patterns, or algorithms the candidate failed to mention"
  ],
  "interview_summary": "Detailed 3-paragraph executive recruiter evaluation analyzing technical rigor, communication efficiency, and job readiness.",
  "question_evaluations": [
    {
      "question_number": 1,
      "question_text": "Full question text asked",
      "answer_text": "Candidate spoken response summary",
      "score": 75,
      "feedback": "Strict technical critique of this answer",
      "key_points_covered": ["Array of correct technical aspects"],
      "missing_aspects": ["Array of missed requirements, edge cases, or trade-offs"]
    }
  ],
  "learning_roadmap": [
    {
      "step": 1,
      "topic": "Topic Title",
      "action": "Actionable technical improvement task",
      "resources": "Specific documentation or practice guide"
    }
  ]
}`;

  try {
    const result = await generateJson<FinalReportOutput>({
      system: `You are an executive hiring bar raiser at ${params.session.company_name}. Enforce strict, evidence-based grading. Output strictly valid JSON.`,
      prompt,
    });
    if (result && typeof result.overall_score === "number") {
      return result;
    }
  } catch (err) {
    console.warn("Notice: Report generation fallback used:", err);
  }

  // Strict Fallback Report calibrated by actual word count
  const isMinimal = totalWordsSpoken < 40;
  const score = isMinimal ? 15 : 55;
  const rec: "No Hire" | "Leaning Hire" = isMinimal ? "No Hire" : "Leaning Hire";

  return {
    overall_score: score,
    communication_score: isMinimal ? 15 : 50,
    technical_score: isMinimal ? 10 : 55,
    problem_solving_score: isMinimal ? 10 : 50,
    confidence_score: isMinimal ? 20 : 55,
    behavior_score: isMinimal ? 20 : 60,
    hiring_recommendation: rec,
    candidate_verdict_reason: isMinimal
      ? `REJECTED: Candidate provided very minimal verbal input (${totalWordsSpoken} words total) during the interview, failing to demonstrate basic competency for ${params.session.job_role}.`
      : `The candidate provided partial answers for ${params.session.job_role}, but failed to elaborate on system trade-offs and complexity requirements expected by ${params.session.company_name}.`,
    strengths: isMinimal
      ? ["Attempted to initiate the session"]
      : [
          `Basic awareness of ${params.session.tech_stack[0] || "role requirements"}`,
          "Responded to introductory questions",
        ],
    weaknesses: [
      "Incomplete or overly brief answers without technical justification",
      "Did not state time or space complexity for algorithmic questions",
      "Lack of quantitative metrics and concrete project achievements",
    ],
    red_flags: [
      "Insufficient evidence of technical depth or coding capability",
    ],
    missing_critical_concepts: [
      "Big-O Time & Space Complexity",
      "System Architecture & Scaling Trade-offs",
      "STAR Behavioral Method Precision",
    ],
    interview_summary: `The candidate completed a ${params.session.duration_minutes}-minute ${params.session.interview_type} mock interview for ${params.session.job_role} at ${params.session.company_name}.\n\nTotal spoken words recorded: ${totalWordsSpoken} words. The responses lacked the depth, precision, and structural clarity expected for this role.\n\nRecommendation: ${rec}. Score: ${score}/100.`,
    question_evaluations: params.full_transcript.map((item, idx) => {
      const qWords = (item.answer || "").trim().split(/\s+/).filter(Boolean).length;
      return {
        question_number: idx + 1,
        question_text: item.question,
        answer_text: item.answer || "[No verbal response recorded]",
        score: qWords < 5 ? 0 : qWords < 15 ? 25 : 55,
        feedback: qWords < 5
          ? "No meaningful answer provided."
          : "Answer was overly brief and missed core engineering trade-offs.",
        key_points_covered: qWords >= 15 ? ["Basic attempt"] : [],
        missing_aspects: ["Architectural trade-offs", "Big-O complexity analysis"],
      };
    }),
    learning_roadmap: [
      {
        step: 1,
        topic: "Verbal Technical Elaboration",
        action: "Practice articulating system design choices out loud in 90-second detailed answers.",
        resources: "CareerOS Technical Communication Playbook",
      },
      {
        step: 2,
        topic: "Algorithmic & Complexity Analysis",
        action: "Always state Big-O time and space complexity before presenting code solutions.",
        resources: "CareerOS Algorithmic Rigor Guide",
      },
    ],
  };
}

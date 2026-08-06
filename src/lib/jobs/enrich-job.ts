import { generateJson } from "@/lib/ai";

export interface EnrichedJobData {
  summary: string;
  skills: string[];
  experience: string;
  education: string;
  employment_type: string;
  work_mode: string;
  seniority: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  tech_stack: string[];
  ai_category: string;
  interview_types: string[];
}

export async function enrichJobWithAi(rawJob: {
  title: string;
  company_name: string;
  description: string;
  category?: string;
  tags?: string[];
}): Promise<EnrichedJobData> {
  const cleanDescription = rawJob.description.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

  const prompt = `Analyze this real job posting from Remotive and return structured JSON.

Company: ${rawJob.company_name}
Title: ${rawJob.title}
Category: ${rawJob.category || "Software Development"}
Tags: ${rawJob.tags ? rawJob.tags.join(", ") : "None"}

Raw Description Excerpt:
${cleanDescription.slice(0, 3000)}

Return ONLY valid JSON matching this schema:
{
  "summary": "Concise 2-sentence summary of the role and key goals",
  "skills": ["4 to 6 core required skills e.g. Python, Docker, AWS"],
  "experience": "e.g. 0-2 Yrs / Freshers or 2-4 Yrs",
  "education": "e.g. Bachelor's in CS / Engineering preferred",
  "employment_type": "Full-Time",
  "work_mode": "Remote",
  "seniority": "Entry Level / Mid Level / Senior",
  "responsibilities": ["3 to 5 key responsibilities"],
  "requirements": ["3 to 5 requirements"],
  "benefits": ["2 to 4 benefits if available"],
  "tech_stack": ["Key technologies e.g. React, Node.js, PostgreSQL"],
  "ai_category": "Software Engineering",
  "interview_types": ["Online Assessment", "Technical Round 1", "Technical Round 2", "HR Round"]
}`;

  try {
    const result = await generateJson<EnrichedJobData>({
      system: "You are an expert AI Technical Recruiter and Job Parser. Return ONLY valid JSON.",
      prompt,
    });
    if (result && result.summary) {
      return result;
    }
  } catch (err) {
    console.warn(`Notice: AI enrichment fallback used for ${rawJob.title}:`, err);
  }

  // Fallback extraction
  const tags = rawJob.tags && rawJob.tags.length > 0 ? rawJob.tags : ["TypeScript", "React", "Node.js", "Python"];
  return {
    summary: `${rawJob.company_name} is actively seeking a ${rawJob.title} to work on scalable cloud services and modern software architectures.`,
    skills: tags.slice(0, 5),
    experience: "0-2 Yrs / Freshers",
    education: "Bachelor's degree in CS, IT, or equivalent experience",
    employment_type: "Full-Time",
    work_mode: "Remote",
    seniority: "Mid Level",
    responsibilities: [
      "Develop and maintain high-quality production code",
      "Collaborate with global distributed teams in an Agile environment",
      "Participate in design reviews, testing, and continuous integration",
    ],
    requirements: [
      "Strong problem-solving and software engineering skills",
      "Proficiency in modern tech stack and git version control",
    ],
    benefits: ["Flexible remote culture", "Competitive salary package", "Learning budget"],
    tech_stack: tags.slice(0, 5),
    ai_category: rawJob.category || "Software Engineering",
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "HR Round"],
  };
}

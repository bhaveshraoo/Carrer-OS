import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

// Polyfill WebSocket for Node.js environment so Supabase client initializes cleanly without Realtime errors
if (typeof globalThis.WebSocket === "undefined") {
  (globalThis as any).WebSocket = class DummyWebSocket {};
}

const sampleJobs = [
  {
    company_slug: "google",
    role: "Software Engineer (SDE-1) — Campus 2026",
    domain: "Software Engineering",
    location: "Bengaluru / Hyderabad (Hybrid)",
    ctc_range: "₹24L - ₹32L PA",
    tech_stack: ["C++", "Python", "Data Structures", "Algorithms", "System Design"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "System Design", "HR Round"],
    description: `Google India is hiring Software Development Engineers for our 2026 Grad cohort.

Responsibilities:
- Build large-scale distributed cloud systems serving millions of queries per second.
- Write clean, testable, high-performance code in C++, Java, or Python.
- Collaborate with global teams on Google Cloud, Search, and Android infrastructure.

Eligibility:
- B.Tech / M.Tech in CS, IT, ECE or related field graduating in 2026.
- Strong problem-solving foundation in Data Structures, Graphs, and Dynamic Programming.`,
    application_url: "https://careers.google.com/jobs/results/",
    days_to_expire: 25,
  },
  {
    company_slug: "microsoft",
    role: "Full Stack Engineer — Azure Cloud",
    domain: "Full Stack",
    location: "Hyderabad, Telangana",
    ctc_range: "₹22L - ₹28L PA",
    tech_stack: ["React", "Node.js", "TypeScript", "C#", "Azure", "PostgreSQL"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "Managerial Round"],
    description: `Microsoft India Developer Center (IDC) is seeking Full Stack Engineers for Azure portal services.

Key Requirements:
- Hands-on experience with modern React, TypeScript, and server-side Node.js / C#.
- Understanding of web fundamentals: REST APIs, microservices, and database performance.
- Familiarity with CI/CD deployment on Azure / Docker.`,
    application_url: "https://careers.microsoft.com/us/en",
    days_to_expire: 20,
  },
  {
    company_slug: "tcs",
    role: "Systems Engineer — Ninja & Digital Hiring",
    domain: "Software Engineering",
    location: "Pan India (Multiple Locations)",
    ctc_range: "₹7L - ₹11.5L PA",
    tech_stack: ["Java", "Python", "SQL", "HTML/CSS", "Git"],
    interview_types: ["Online Assessment", "Technical Round 1", "HR Round"],
    description: `Tata Consultancy Services (TCS) NQT 2026 Off-Campus Hiring Drive.

Pipeline Overview:
- Stage 1: TCS National Qualifier Test (NQT) covering Foundation & Advanced Aptitude + Coding.
- Stage 2: Technical Interview covering core OOP, SQL, DBMS, and basic coding puzzles.
- Stage 3: HR & Management Discussion.`,
    application_url: "https://www.tcs.com/careers",
    days_to_expire: 30,
  },
  {
    company_slug: "infosys",
    role: "Specialist Programmer (SP) & DSE",
    domain: "Software Engineering",
    location: "Bengaluru / Pune / Mysuru",
    ctc_range: "₹9.5L - ₹14L PA",
    tech_stack: ["Python", "Java", "DSA", "SQL", "Spring Boot"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "HR Round"],
    description: `Infosys HackWithInfy & InfyTQ Direct Engineering hiring.

Targeting high-performing coders for complex client projects in Cloud, AI, and Microservices architecture.`,
    application_url: "https://www.infosys.com/careers.html",
    days_to_expire: 18,
  },
  {
    company_slug: "amazon",
    role: "AI / ML Engineer — AWS Science",
    domain: "AI/ML",
    location: "Bengaluru, Karnataka",
    ctc_range: "₹26L - ₹36L PA",
    tech_stack: ["Python", "PyTorch", "Transformers", "LLMs", "RAG", "AWS SageMaker"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "System Design", "Managerial Round"],
    description: `Amazon Web Services (AWS) AI Science team is building next-generation Generative AI services.

Role Responsibilities:
- Fine-tune Large Language Models (LLMs) and Vision-Language models using PEFT/LoRA.
- Design real-time RAG (Retrieval-Augmented Generation) pipelines using pgvector / Pinecone.
- Optimize inference speed and deployment on AWS SageMaker.`,
    application_url: "https://www.amazon.jobs/en/",
    days_to_expire: 15,
  },
  {
    company_slug: "accenture",
    role: "Advanced Application Engineering Associate",
    domain: "Frontend",
    location: "Bengaluru / Gurugram / Chennai",
    ctc_range: "₹6.5L - ₹9.5L PA",
    tech_stack: ["JavaScript", "React", "HTML5", "CSS3", "Tailwind CSS"],
    interview_types: ["Online Assessment", "Technical Round 1", "HR Round"],
    description: `Accenture Innovation Hub hiring for Frontend Engineers.

Work with enterprise clients to build responsive, intuitive web portals using React, Next.js, and modern CSS frameworks.`,
    application_url: "https://www.accenture.com/in-en/careers",
    days_to_expire: 22,
  },
  {
    company_slug: "cognizant",
    role: "GenC Next — Software Engineer",
    domain: "Backend",
    location: "Chennai / Hyderabad / Pune",
    ctc_range: "₹6.75L - ₹10L PA",
    tech_stack: ["Java", "Spring Boot", "REST APIs", "MySQL", "Docker"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "HR Round"],
    description: `Cognizant GenC Next hiring for backend engineering roles.

Primary focus on microservices development, REST API design, database schema optimization, and unit testing.`,
    application_url: "https://www.cognizant.com/in/en/careers",
    days_to_expire: 14,
  },
  {
    company_slug: "wipro",
    role: "Project Engineer — Turbo Hiring",
    domain: "Software Engineering",
    location: "Bengaluru / Pune / Kochi",
    ctc_range: "₹6.5L - ₹8.5L PA",
    tech_stack: ["C++", "Java", "SQL", "Linux", "Git"],
    interview_types: ["Online Assessment", "Technical Round 1", "HR Round"],
    description: `Wipro Elite & Turbo hiring drive for 2026 Batch.

Looking for graduates with strong core computer science fundamentals, OS concepts, networking, and clean coding practices.`,
    application_url: "https://www.wipro.com/careers/",
    days_to_expire: 28,
  },
  {
    company_slug: "google",
    role: "Frontend Engineer — Google Search UI",
    domain: "Frontend",
    location: "Bengaluru, Karnataka",
    ctc_range: "₹22L - ₹30L PA",
    tech_stack: ["TypeScript", "React", "Web Vitals", "CSS Architecture", "GraphQL"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "System Design", "HR Round"],
    description: `Google Search UI engineering team is looking for passionate Frontend Engineers.

Focus on ultra-fast page speed, core web vitals optimization, accessible UI components, and rich web applications.`,
    application_url: "https://careers.google.com/",
    days_to_expire: 12,
  },
  {
    company_slug: "microsoft",
    role: "Data Engineer — Big Data & Analytics",
    domain: "Data Engineering",
    location: "Noida / Bengaluru",
    ctc_range: "₹20L - ₹26L PA",
    tech_stack: ["Python", "Spark", "SQL", "Azure Synapse", "Kafka", "Data Warehousing"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "System Design", "Managerial Round"],
    description: `Microsoft Data & Analytics division is hiring Data Engineers.

Design fault-tolerant batch and streaming data pipelines processing petabytes of enterprise analytics data.`,
    application_url: "https://careers.microsoft.com/",
    days_to_expire: 19,
  },
];

async function seedJobs() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  console.log("Fetching existing companies from Supabase...");
  const { data: companies, error: compErr } = await supabase.from("companies").select("id, slug, name");

  if (compErr || !companies) {
    console.error("Failed to fetch companies:", compErr);
    process.exit(1);
  }

  const slugToId = new Map(companies.map((c) => [c.slug, c.id]));
  console.log(`Found ${companies.length} companies in DB.`);

  let insertedCount = 0;

  for (const job of sampleJobs) {
    const companyId = slugToId.get(job.company_slug);

    if (!companyId) {
      console.warn(`Skipping job '${job.role}' because company '${job.company_slug}' was not found.`);
      continue;
    }

    const lastDate = new Date();
    lastDate.setDate(lastDate.getDate() + job.days_to_expire);

    const { error } = await supabase.from("jobs").upsert(
      {
        company_id: companyId,
        role: job.role,
        description: job.description,
        domain: job.domain,
        location: job.location,
        ctc_range: job.ctc_range,
        tech_stack: job.tech_stack,
        interview_types: job.interview_types,
        application_url: job.application_url,
        last_date: lastDate.toISOString(),
        status: "active",
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error(`Error inserting job '${job.role}':`, error);
    } else {
      insertedCount++;
    }
  }

  console.log(`Successfully seeded ${insertedCount} job postings!`);
}

seedJobs().catch((err) => {
  console.error("Unhandled error during job seeding:", err);
  process.exit(1);
});

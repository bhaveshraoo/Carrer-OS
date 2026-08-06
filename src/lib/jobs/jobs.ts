import { table } from "@/lib/supabase/typed-table";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface JobWithCompany {
  id: string;
  company_id: string;
  company_name: string;
  company_slug: string;
  company_logo_url: string | null;
  company_tier: string;
  role: string;
  description: string;
  domain: string;
  location: string;
  ctc_range: string;
  tech_stack: string[];
  interview_types: string[];
  application_url: string;
  last_date: string;
  status: "active" | "expired";
  created_at: string;
  is_wishlisted?: boolean;
  is_company_targeted?: boolean;
}

/**
 * Check if a job is still active (last_date is today or in the future)
 */
export function isJobActive(lastDateStr: string): boolean {
  if (!lastDateStr) return true;
  const lastTime = new Date(lastDateStr).getTime();
  return lastTime >= Date.now();
}

export const FALLBACK_JOBS: JobWithCompany[] = [
  {
    id: "job-fallback-1",
    company_id: "comp-tcs",
    company_name: "TCS",
    company_slug: "tcs",
    company_logo_url: null,
    company_tier: "IT Services",
    role: "Systems Engineer — Ninja & Digital Hiring 2026",
    description: `📌 JOB OVERVIEW
Tata Consultancy Services (TCS) is inviting applications for the TCS National Qualifier Test (NQT) 2026 batch. This hiring drive aims to select premier engineering talent for TCS Ninja and TCS Digital roles across India.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Eligible Batches: 2025 & 2026 Passouts (B.E. / B.Tech / M.E. / M.Tech / MCA / M.Sc).
• Minimum Marks: 60% or 6.0 CGPA throughout 10th, 12th, Diploma, Undergraduation, and Postgraduation.
• Academic Backlogs: Maximum 1 active backlog permitted at the time of appearing for the assessment.

🚀 KEY RESPONSIBILITIES
• Design, develop, test, and deploy scalable enterprise software solutions using Java, C++, Python, or C#.
• Collaborate with cross-functional global teams on Cloud migration, Microservices, and Database Optimization.
• Write clean, maintainable, production-ready code complying with TCS global quality standards.
• Participate in Agile/Scrum ceremonies, code reviews, and DevOps automation workflows.

💡 TECHNICAL SKILLS REQUIRED
• Must-Have: Core Java / Python, SQL, DBMS fundamentals, OOP concepts, Data Structures & Algorithms.
• Good-to-Have: Linux commands, REST APIs, Git, Docker basics.

🏆 SELECTION & INTERVIEW PROCESS
1. Stage 1: TCS NQT Online Assessment (Foundation + Advanced Cognitive & Coding Sections).
2. Stage 2: Technical Interview (DSA, OOPs, SQL Queries & Project Deep-Dive).
3. Stage 3: HR & Management Discussion (Culture fit, Location preferences, Communication).

🎁 PERKS & BENEFITS
• Flexible Location Choices across Pan-India TCS Delivery Centers.
• Annual Learning & Certification Incentives (AWS, Azure, GCP, Java).
• Comprehensive Health & Life Insurance for Employee & Dependents.`,
    domain: "Software Engineering",
    location: "Pan India (Multiple Locations)",
    ctc_range: "₹7L - ₹11.5L PA",
    tech_stack: ["Java", "Python", "SQL", "HTML/CSS", "Git"],
    interview_types: ["Online Assessment", "Technical Round 1", "HR Round"],
    application_url: "https://www.tcs.com/careers",
    last_date: new Date(Date.now() + 25 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "job-fallback-2",
    company_id: "comp-infosys",
    company_name: "Infosys",
    company_slug: "infosys",
    company_logo_url: null,
    company_tier: "IT Services",
    role: "Specialist Programmer (SP) & DSE",
    description: `📌 JOB OVERVIEW
Infosys is recruiting high-caliber coders for Specialist Programmer (SP) and Digital Systems Engineer (DSE) tracks through HackWithInfy & InfyTQ direct entry pipelines.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Eligible Batches: 2025 & 2026 Graduates (B.E. / B.Tech / M.Tech / MCA in CS, IT, ECE, EEE).
• Academic Criteria: Minimum 65% aggregate in 10th, 12th, and B.Tech degree with no active backlogs.

🚀 KEY RESPONSIBILITIES
• Architect and execute complex cloud-native microservices using Spring Boot, Python, and React.
• Solve algorithmic optimization challenges and handle high-throughput database transactions.
• Build automated CI/CD deployment pipelines on Azure & AWS cloud infrastructure.
• Work directly with global Fortune 500 enterprise client accounts.

💡 TECHNICAL SKILLS REQUIRED
• Must-Have: Advanced Data Structures & Algorithms, Dynamic Programming, System Design basics, SQL.
• Good-to-Have: Spring Boot, Node.js, Docker, Kubernetes, PostgreSQL.

🏆 SELECTION & INTERVIEW PROCESS
1. Stage 1: HackWithInfy / InfyTQ Online Coding Assessment (3 Algorithmic Problems).
2. Stage 2: Technical Interview 1 (In-depth DSA live coding + CS Fundamentals).
3. Stage 3: Technical Interview 2 (System Architecture & Project Code Walkthrough).
4. Stage 4: HR & Behavioral Round.

🎁 PERKS & BENEFITS
• Fast-Track Promotion Track for Specialist Programmers.
• Mysuru Global Education Center Training Allowance & Certification Sponsorship.
• Health Insurance cover of ₹5,00,000 PA per family.`,
    domain: "Software Engineering",
    location: "Bengaluru / Mysuru / Pune",
    ctc_range: "₹9.5L - ₹14L PA",
    tech_stack: ["Python", "Java", "DSA", "SQL", "Spring Boot"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "HR Round"],
    application_url: "https://www.infosys.com/careers.html",
    last_date: new Date(Date.now() + 20 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    company_id: "comp-google",
    id: "job-fallback-3",
    company_name: "Google",
    company_slug: "google",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Software Engineer (SDE-1) — Campus 2026",
    description: `📌 JOB OVERVIEW
Google India is seeking world-class Software Development Engineers for our 2026 University Graduate cohort. You will tackle some of computer science's toughest problems in distributed systems, search indexing, machine learning, and mobile infrastructure.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Degree: Bachelor’s, Master’s, or PhD in Computer Science or related technical field (Class of 2025/2026).
• Work Authorization: Authorized to work in India.

🚀 KEY RESPONSIBILITIES
• Design, write, and maintain clean, testable, high-performance C++, Java, or Python code serving millions of requests per second.
• Optimize low-latency distributed storage systems, query parsers, and machine learning pipelines.
• Conduct technical code reviews and write comprehensive unit/integration test suites.
• Drive reliability, system monitoring, and zero-downtime service deployments across Google Cloud.

💡 TECHNICAL SKILLS REQUIRED
• Must-Have: Deep expertise in Data Structures, Algorithms, Graph Theory, DP, OS, Networks, DBMS.
• Good-to-Have: Distributed Systems knowledge, Multi-threading, C++20 / Python 3.11 / Go.

🏆 SELECTION & INTERVIEW PROCESS
1. Stage 1: Google Online Challenge (2 Complex Algorithmic Questions on HackerEarth/Google Code).
2. Stage 2: Technical Interview 1 (DSA Live Coding & Edge-Case Optimization).
3. Stage 3: Technical Interview 2 (Advanced Algorithms & Data Structure Design).
4. Stage 4: Googleyness & Leadership Interview (Behavioral & Cultural Alignment).

🎁 PERKS & BENEFITS
• Base Salary + Sign-on Bonus + Annual Google Stock Units (GSUs).
• On-site Gourmet Cafes, Micro-kitchens, Wellness Centers & Gym Memberships.
• Flexible Hybrid Work Model (3 days in office, 2 days remote).`,
    domain: "Software Engineering",
    location: "Bengaluru / Hyderabad (Hybrid)",
    ctc_range: "₹24L - ₹32L PA",
    tech_stack: ["C++", "Python", "Data Structures", "Algorithms", "System Design"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "System Design", "HR Round"],
    application_url: "https://careers.google.com/jobs/results/",
    last_date: new Date(Date.now() + 18 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    company_id: "comp-amazon",
    id: "job-fallback-4",
    company_name: "Amazon",
    company_slug: "amazon",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "AI / ML Engineer — AWS Science",
    description: `📌 JOB OVERVIEW
The Amazon Web Services (AWS) AI Science team is building next-generation Generative AI models, agentic workflows, and retrieval systems powering AWS Bedrock & SageMaker.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Degree: B.Tech / M.Tech / MS in CS, Artificial Intelligence, Data Science, or Mathematics.
• Experience: 0-2 Years / 2025 & 2026 Batch Graduates with strong AI project portfolios.

🚀 KEY RESPONSIBILITIES
• Fine-tune Large Language Models (LLMs) and Vision-Language models using PEFT, LoRA, and QLoRA techniques.
• Build real-time RAG (Retrieval-Augmented Generation) pipelines using vector databases (pgvector / OpenSearch).
• Benchmark model latency, token throughput, and quantization speed on AWS SageMaker GPU clusters.
• Productionize LLM agent frameworks using Python, PyTorch, and LangChain / LlamaIndex.

💡 TECHNICAL SKILLS REQUIRED
• Must-Have: Python, PyTorch / TensorFlow, Transformers, HuggingFace, RAG, Vector Search, Math/Linear Algebra.
• Good-to-Have: CUDA programming, Triton, DeepSpeed, AWS SageMaker, Docker.

🏆 SELECTION & INTERVIEW PROCESS
1. Stage 1: AWS Online Assessment (Debugging + Coding + Work Style Survey).
2. Stage 2: Technical Interview 1 (ML System Design & RAG Architecture).
3. Stage 3: Technical Interview 2 (PyTorch Live Coding & Model Optimization).
4. Stage 4: Amazon Bar Raiser & Leadership Principles Round.

🎁 PERKS & BENEFITS
• Competitive Base Salary + Amazon Restricted Stock Units (RSUs).
• $3,000 Annual AWS Cloud Credits for personal research & experimentation.
• Comprehensive Medical, Dental, and Vision Insurance.`,
    domain: "AI/ML",
    location: "Bengaluru, Karnataka",
    ctc_range: "₹26L - ₹36L PA",
    tech_stack: ["Python", "PyTorch", "Transformers", "LLMs", "RAG", "AWS SageMaker"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "System Design", "Managerial Round"],
    application_url: "https://www.amazon.jobs/en/",
    last_date: new Date(Date.now() + 15 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    company_id: "comp-microsoft",
    id: "job-fallback-5",
    company_name: "Microsoft",
    company_slug: "microsoft",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Full Stack Engineer — Azure Cloud",
    description: `📌 JOB OVERVIEW
Microsoft India Developer Center (IDC) is seeking Full Stack Engineers to design and scale the next generation of Azure Cloud management web portals and developer tooling.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Qualification: B.E. / B.Tech / M.Tech / Dual Degree in CS/IT (Class of 2025/2026).
• Work Mode: Hybrid (2-3 days office in Hyderabad / Bengaluru).

🚀 KEY RESPONSIBILITIES
• Build intuitive, responsive micro-frontend interfaces using React, TypeScript, and Microsoft Fluent UI.
• Architect low-latency REST APIs and GraphQL microservices using C# / .NET Core & Node.js.
• Optimize SQL & NoSQL queries on Azure Cosmos DB & PostgreSQL for high concurrency.
• Implement automated end-to-end telemetry, logging, and security compliance.

💡 TECHNICAL SKILLS REQUIRED
• Must-Have: TypeScript / JavaScript, React, Node.js or C#/.NET, Web Fundamentals, REST APIs, SQL.
• Good-to-Have: Azure Functions, GraphQL, Docker, Web Performance Optimization.

🏆 SELECTION & INTERVIEW PROCESS
1. Stage 1: Microsoft Codility Online Assessment (3 Coding Questions).
2. Stage 2: Technical Interview 1 (Frontend Architecture & React Live Coding).
3. Stage 3: Technical Interview 2 (Backend API Design & Database Schema).
4. Stage 4: AA (As-Appropriate) Executive Managerial Round.

🎁 PERKS & BENEFITS
• Attractive Base Salary + Annual Performance Bonus + Stock Awards.
• Free Campus Shuttle Service, Subsidized Gourmet Meals, and On-site Clinics.
• $2,500 Annual Tuition & Upskilling Allowance.`,
    domain: "Full Stack",
    location: "Hyderabad, Telangana",
    ctc_range: "₹22L - ₹28L PA",
    tech_stack: ["React", "Node.js", "TypeScript", "C#", "Azure", "PostgreSQL"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "Managerial Round"],
    application_url: "https://careers.microsoft.com/us/en",
    last_date: new Date(Date.now() + 22 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    company_id: "comp-accenture",
    id: "job-fallback-6",
    company_name: "Accenture",
    company_slug: "accenture",
    company_logo_url: null,
    company_tier: "IT Services",
    role: "Advanced Application Engineering Associate",
    description: `📌 JOB OVERVIEW
Accenture Innovation Hub India is recruiting Advanced Application Engineering Associates for enterprise modern web application delivery across global client portfolios.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Eligible Batches: 2025 & 2026 Graduates in all engineering streams (B.E./B.Tech/M.Tech/MCA).
• Aggregate Score: Minimum 60% throughout 10th, 12th, and Graduation.

🚀 KEY RESPONSIBILITIES
• Develop modern UI components using React, Next.js, HTML5, CSS3, and Tailwind CSS.
• Integrate frontend views with RESTful backend endpoints and state management libraries.
• Perform cross-browser compatibility testing, accessibility audits (ARIA), and performance tuning.
• Work in sprint-based Agile teams with continuous integration pipelines.

💡 TECHNICAL SKILLS REQUIRED
• Must-Have: JavaScript (ES6+), React.js, HTML5, CSS3, Tailwind CSS, REST APIs, Git.
• Good-to-Have: Next.js, Redux Toolkit, TypeScript, Jest testing.

🏆 SELECTION & INTERVIEW PROCESS
1. Stage 1: Accenture Cognitive & Technical Assessment.
2. Stage 2: Coding Assessment (2 Practical Problems).
3. Stage 3: Communication Assessment (Automated Voice & Grammar Test).
4. Stage 4: Virtual Technical & HR Interview.

🎁 PERKS & BENEFITS
• Location Flexibility across Bengaluru, Gurugram, Pune, Hyderabad, Chennai.
• Comprehensive Employee Medical & Wellness Support.
• Industry-recognized Technical Certifications via Accenture Academy.`,
    domain: "Frontend",
    location: "Bengaluru / Gurugram / Chennai",
    ctc_range: "₹6.5L - ₹9.5L PA",
    tech_stack: ["JavaScript", "React", "HTML5", "CSS3", "Tailwind CSS"],
    interview_types: ["Online Assessment", "Technical Round 1", "HR Round"],
    application_url: "https://www.accenture.com/in-en/careers",
    last_date: new Date(Date.now() + 28 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
];

/**
  * Auto-transition jobs past last_date to 'expired'
  */
export async function autoExpireJobs(supabase: SupabaseClient) {
  const nowStr = new Date().toISOString();
  try {
    const { data: expiredJobs } = await table(supabase, "jobs")
      .select("id")
      .eq("status", "active");

    if (expiredJobs && expiredJobs.length > 0) {
      await (supabase as any)
        .from("jobs")
        .update({ status: "expired" })
        .eq("status", "active")
        .lt("last_date", nowStr);
    }
  } catch (err) {
    // Ignore if table doesn't exist on remote schema yet
  }
}

/**
  * Fetch active jobs joined with company data
  */
export async function fetchActiveJobsWithDetails(
  supabase: SupabaseClient,
  userId?: string
): Promise<JobWithCompany[]> {
  // Run auto-expire in background without blocking GET response
  autoExpireJobs(supabase).catch(() => {});

  let wishlistedJobIds = new Set<string>();
  let targetedCompanyIds = new Set<string>();

  if (userId) {
    try {
      const [wishlistsRes, targetsRes] = await Promise.all([
        table(supabase, "job_wishlists").select("job_id").eq("user_id", userId),
        table(supabase, "user_company_targets").select("company_id").eq("user_id", userId),
      ]);

      if (wishlistsRes.data) {
        wishlistedJobIds = new Set(wishlistsRes.data.map((w: any) => w.job_id));
      }
      if (targetsRes.data) {
        targetedCompanyIds = new Set(targetsRes.data.map((t: any) => t.company_id));
      }
    } catch {
      // Ignore DB errors
    }
  }

  // If DB yields jobs, return them directly
  try {
    const { data: rawJobs, error } = await (supabase as any)
      .from("jobs")
      .select(`
        *,
        company:companies(id, name, slug, logo_url, metadata)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && rawJobs && rawJobs.length > 0) {
      return rawJobs
        .map((j: any) => {
          const company = j.company || {};
          const metadata = company.metadata || {};
          const tier = metadata.tier || metadata.industry || "Product";

          return {
            id: j.id,
            company_id: j.company_id,
            company_name: company.name || "Unknown Company",
            company_slug: company.slug || "unknown",
            company_logo_url: company.logo_url || null,
            company_tier: tier,
            role: j.role,
            description: j.description,
            domain: j.domain,
            location: j.location,
            ctc_range: j.ctc_range,
            tech_stack: j.tech_stack || [],
            interview_types: j.interview_types || [],
            application_url: j.application_url,
            last_date: j.last_date,
            status: j.status,
            created_at: j.created_at,
            is_wishlisted: wishlistedJobIds.has(j.id),
            is_company_targeted: targetedCompanyIds.has(j.company_id),
          };
        })
        .filter((j: any) => isJobActive(j.last_date));
    }
  } catch (err) {
    console.warn("Notice checking Supabase jobs table:", err);
  }

  // Fetch 100% real aggregated tech jobs from Lever, Greenhouse & Remotive APIs
  try {
    const { getReal30IndianJobs } = await import("./real-jobs-aggregator");
    const realJobs = await getReal30IndianJobs();
    if (realJobs && realJobs.length > 0) {
      return realJobs
        .map((j) => ({
          ...j,
          is_wishlisted: wishlistedJobIds.has(j.id),
          is_company_targeted: targetedCompanyIds.has(j.company_id),
        }))
        .filter((j) => isJobActive(j.last_date));
    }
  } catch (err) {
    console.error("Error loading real aggregated API jobs:", err);
  }

  return [];
}



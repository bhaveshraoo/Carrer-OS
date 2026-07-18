import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Bare `import "dotenv/config"` only loads `.env` by default — this project (like
// every Next.js app) keeps secrets in `.env.local`, so the path must be explicit.
config({ path: ".env.local" });

/**
 * Seeds companies + company_intel + company_dsa_topics.
 *
 * Run with: npm run seed
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (bypasses RLS — this is
 * intentionally admin-only data, not something a user client should write).
 *
 * Data quality is NOT uniform across companies — see `verified` in each entry:
 *   verified: true  → researched against current (2026) public sources, cited in source_urls
 *   verified: false → accurate general pattern for Indian IT-services hiring, but
 *                      company-specific specifics (exact test names, current cutoffs)
 *                      have not been individually confirmed. Treat as a starting
 *                      point, not gospel — verify before a user relies on it for
 *                      real prep. Upgrade to `true` once actually researched.
 */

interface CompanySeed {
  name: string;
  slug: string;
  career_page_url: string;
  tier: string;
  verified: boolean;
  overview: string;
  hiring_process: { stage: string; description: string }[];
  required_skills: string[];
  prep_roadmap: string;
  source_urls: string[];
  dsa_topics?: { topic: string; emphasis: number }[]; // 1-5, only set for verified companies
}

const companies: CompanySeed[] = [
  // ───────────────────────── Verified (5) ─────────────────────────
  {
    name: "TCS",
    slug: "tcs",
    career_page_url: "https://www.tcs.com/careers",
    tier: "IT Services",
    verified: true,
    overview:
      "India's largest IT services company (Tata Group), with 600,000+ employees across 50+ countries. " +
      "Hires freshers primarily through the TCS National Qualifier Test (NQT), run on the TCS iON platform, " +
      "which feeds both TCS's own All India hiring drive and 60+ partner companies.",
    hiring_process: [
      {
        stage: "TCS NQT (Round 1)",
        description:
          "A 190-minute integrated online test in two sections: Foundation (75 min — Verbal, Numerical, " +
          "Reasoning Ability) and Advanced (115 min — Advanced Quant, Reasoning, and 2-3 coding problems). " +
          "Your Advanced section performance determines which track (Ninja / Digital / Prime) you qualify for.",
      },
      {
        stage: "Technical Interview",
        description:
          "Covers core CS fundamentals (DSA, DBMS, OOPs), your final-year project in depth, and often " +
          "includes writing code live. Recent cycles sometimes combine this with the Managerial round.",
      },
      {
        stage: "Managerial & HR Interview",
        description:
          "Communication, leadership potential, role fit, and willingness to relocate. Generally considered " +
          "the least difficult stage if you've made it this far.",
      },
    ],
    required_skills: [
      "Programming fundamentals (any language)",
      "Quantitative & logical aptitude",
      "Verbal/English communication",
      "Basic DSA",
      "Willingness to relocate",
    ],
    prep_roadmap:
      "The Foundation section has independent sectional cutoffs — you must clear every section individually, " +
      "so don't over-invest in one area at the expense of others. The Advanced section's coding component is " +
      "what separates Ninja (₹3.36 LPA) from Digital and Prime (up to ₹19 LPA) — if you're aiming higher than " +
      "Ninja, prioritize coding practice over pure aptitude drilling. For the interview stage, be ready to " +
      "explain your final-year project in real depth; it comes up in nearly every technical round.",
    source_urls: [
      "https://www.tcs.com/careers/india/tcs-all-india-nqt-hiring",
      "https://unstop.com/blog/tcs-nqt-hiring-process",
    ],
    dsa_topics: [
      { topic: "arrays", emphasis: 3 },
      { topic: "strings", emphasis: 3 },
      { topic: "basic-programming", emphasis: 3 },
      { topic: "oop-concepts", emphasis: 2 },
    ],
  },
  {
    name: "Infosys",
    slug: "infosys",
    career_page_url: "https://www.infosys.com/careers.html",
    tier: "IT Services",
    verified: true,
    overview:
      "Bangalore-headquartered global IT services and consulting leader, hiring 50,000+ freshers annually " +
      "through three parallel tracks: the standard Infosys Recruitment Test (IRT), the free InfyTQ certification " +
      "pathway, and the HackWithInfy national coding competition for top performers.",
    hiring_process: [
      {
        stage: "Infosys Recruitment Test (IRT)",
        description:
          "Roughly 65-70 objective questions across multiple sections (quant, verbal, reasoning, pseudocode/coding), " +
          "around 180 minutes, no negative marking — but each section has its own independent cutoff.",
      },
      {
        stage: "Technical Interview",
        description: "DSA, DBMS, OS fundamentals, and your projects — Java is the most commonly asked language.",
      },
      {
        stage: "HR Interview",
        description: "Motivation, relocation, and culture fit.",
      },
      {
        stage: "Alternative: InfyTQ / HackWithInfy",
        description:
          "InfyTQ (free platform, infytq.infosys.com) has Foundation and Master certification levels — Master " +
          "unlocks direct interviews for the higher-paying Specialist Programmer (SP) track. HackWithInfy is an " +
          "annual national coding contest; top performers get fast-tracked SP offers, skipping much of the standard funnel.",
      },
    ],
    required_skills: [
      "Java, Python, or C",
      "Data Structures & Algorithms (especially DP for SP/HackWithInfy track)",
      "Aptitude & reasoning",
      "SQL basics",
    ],
    prep_roadmap:
      "Decide early which track you're realistically aiming for — the standard IRT route (Systems Engineer, " +
      "~₹4-4.5 LPA) needs solid aptitude and basic coding, while the SP track via InfyTQ Master or HackWithInfy " +
      "(₹8-12 LPA) demands genuine competitive-programming-level DSA, with a notably heavy emphasis on dynamic " +
      "programming and number theory/math compared to peers like TCS or Wipro. If you're not aiming for SP, " +
      "don't over-invest in Hard-difficulty DP — the IRT route rewards broad aptitude more than deep DSA.",
    source_urls: [
      "https://www.infosys.com/careers/hackwithinfy.html",
      "https://www.testsolve.ai/companies/infosys/",
    ],
    dsa_topics: [
      { topic: "dp", emphasis: 5 },
      { topic: "arrays", emphasis: 4 },
      { topic: "math-number-theory", emphasis: 4 },
      { topic: "strings", emphasis: 3 },
      { topic: "graphs", emphasis: 3 },
    ],
  },
  {
    name: "Wipro",
    slug: "wipro",
    career_page_url: "https://careers.wipro.com/",
    tier: "IT Services",
    verified: true,
    overview:
      "Bengaluru-based IT services and consulting company with 250,000+ employees globally, hiring freshers " +
      "through the Wipro Elite National Talent Hunt (NLTH/NTH) — an individual, off-campus-style online drive.",
    hiring_process: [
      {
        stage: "Elite NLTH Online Assessment (~128 min)",
        description:
          "Three parts: an Aptitude Test (Logical, Quantitative, Verbal), a Written Communication Test (a " +
          "20-minute essay — this trips up a surprising number of otherwise-strong candidates), and a coding " +
          "section (2 problems, choice of Java/C/C++/Python).",
      },
      {
        stage: "Technical Interview (45-60 min)",
        description: "DSA basics, DBMS, OS, and depth in whichever language you chose for the coding section.",
      },
      {
        stage: "HR Interview (20-30 min)",
        description: "Standard fit/communication/relocation discussion.",
      },
    ],
    required_skills: [
      "Aptitude (logical, quantitative, verbal)",
      "Written communication / essay writing",
      "Basic coding in one language",
      "Core CS fundamentals",
    ],
    prep_roadmap:
      "The written essay section is the most commonly underprepared part of this process — it's not just a " +
      "coding test. Practice writing a structured 200-300 word essay in 20 minutes on a general topic; treat it " +
      "as seriously as the coding section. Sectional cutoffs apply, commonly cited around 70% per section, so " +
      "balanced prep matters more than being excellent in only one area.",
    source_urls: ["https://careers.wipro.com/", "https://papersadda.com/article/how-to-prepare-wipro-elite-2026/"],
    dsa_topics: [
      { topic: "arrays", emphasis: 3 },
      { topic: "strings", emphasis: 3 },
      { topic: "basic-programming", emphasis: 3 },
    ],
  },
  {
    name: "Accenture",
    slug: "accenture",
    career_page_url: "https://www.accenture.com/in-en/careers",
    tier: "IT Services & Consulting",
    verified: true,
    overview:
      "Global professional services and consulting company, and one of the largest private employers in India " +
      "(5.5 lakh+ employees). Hires freshers via campus drives and off-campus channels, often sourced through AMCAT.",
    hiring_process: [
      {
        stage: "Cognitive & Technical Assessment",
        description:
          "Verbal, Reasoning, and Numerical ability, MS Office familiarity, Pseudocode, a Coding section, and a " +
          "Communication Assessment. Recent cycles have moved the cognitive section toward a gamified/game-based format.",
      },
      {
        stage: "Technical Interview",
        description: "Coding, problem-solving, and CS fundamentals discussion.",
      },
      {
        stage: "HR Interview",
        description: "Consulting-oriented — communication and client-readiness are weighted more heavily here than at pure IT-services peers.",
      },
    ],
    required_skills: [
      "Communication (weighted heavily — this is a consulting firm, not just IT services)",
      "Pseudocode / basic coding",
      "Aptitude",
      "MS Office",
    ],
    prep_roadmap:
      "No negative marking, so attempt every question. Because Accenture is consulting-first, the communication " +
      "assessment and HR round carry more weight relatively than at TCS or Wipro — don't treat them as an " +
      "afterthought after clearing the technical bar. All engineering branches are eligible at the standard " +
      "ASE level with no coding-heavy bar; the higher-paying Specialist track expects real technical depth.",
    source_urls: [
      "https://beincareer.com/accenture-fresher-hiring-2026/",
      "https://www.placementpreparation.io/accenture/recruitment-process/",
    ],
    dsa_topics: [
      { topic: "pseudocode", emphasis: 4 },
      { topic: "arrays", emphasis: 2 },
      { topic: "strings", emphasis: 2 },
    ],
  },
  {
    name: "Cognizant",
    slug: "cognizant",
    career_page_url: "https://careers.cognizant.com/global/en",
    tier: "IT Services",
    verified: true,
    overview:
      "US-headquartered (New Jersey) technology and consulting company with major India delivery centers, " +
      "targeting roughly 24,000-25,000 freshers for the 2026 batch through its GenC family of hiring tracks. " +
      "Notably states an explicit no-service-bond policy, unlike TCS or Infosys.",
    hiring_process: [
      {
        stage: "Communication Assessment",
        description: "AI-graded evaluation of English fluency, grammar, pronunciation, and a listening/audio section.",
      },
      {
        stage: "Aptitude / Gamified Round",
        description: "Logical reasoning and problem-solving, run in a gamified format.",
      },
      {
        stage: "Technical Assessment (AMCAT / HackerRank)",
        description:
          "Difficulty scales by track — GenC Next (the top track) includes 2 coding problems, 2 SQL questions, " +
          "10 technical MCQs, and a web development task.",
      },
      {
        stage: "Technical + HR Interview",
        description: "Combined final round covering both technical depth and fit.",
      },
    ],
    required_skills: [
      "English communication",
      "SQL",
      "Coding (track-dependent)",
      "Web development basics (for GenC Next)",
      "AI-tooling familiarity (increasingly valued per Cognizant's stated 2026 AI-delivery focus)",
    ],
    prep_roadmap:
      "Pick your track deliberately before registering — GenC (minimal programming expected), GenC Elevate " +
      "(foundational programming), GenC Pro (specific tech: PEGA/Salesforce/SAP/ServiceNow), or GenC Next " +
      "(full assessment, most competitive, ₹6.75 LPA+, up to ₹12 LPA for top performers). Most candidates " +
      "under-prepare because they treat all four tracks as the same process — they aren't. If targeting GenC " +
      "Next, SQL and basic web development are as important as DSA here, which is unusual among IT-services peers.",
    source_urls: [
      "https://faceprepcampus.com/blog/cognizant-genc-2026-hiring-process/",
      "https://lastroundai.com/interview-questions/cognizant",
    ],
    dsa_topics: [
      { topic: "sql", emphasis: 4 },
      { topic: "arrays", emphasis: 3 },
      { topic: "web-development", emphasis: 3 },
      { topic: "strings", emphasis: 2 },
    ],
  },

  // ───────────────────── General pattern, unverified (10) ─────────────────────
  {
    name: "HCLTech",
    slug: "hcltech",
    career_page_url: "https://www.hcltech.com/careers",
    tier: "IT Services",
    verified: false,
    overview:
      "Noida-headquartered IT services company, one of India's largest tech employers. Hires graduates through " +
      "campus/off-campus drives, and separately runs HCL TechBee, a distinct entry program for 12th-pass students.",
    hiring_process: [
      { stage: "Online Assessment", description: "General pattern: aptitude and basic technical/coding assessment. Exact current test name and format not yet individually verified — confirm on HCLTech's careers page before relying on this." },
      { stage: "Technical Interview", description: "Core CS fundamentals and project discussion, following the standard IT-services pattern." },
      { stage: "HR Interview", description: "Fit and communication." },
    ],
    required_skills: ["Programming fundamentals", "Aptitude", "Communication"],
    prep_roadmap:
      "General IT-services prep applies here (aptitude + basic coding + core CS fundamentals). This profile " +
      "hasn't been individually researched yet — treat it as a starting point and verify specifics on HCLTech's " +
      "official careers page before your actual drive.",
    source_urls: [],
  },
  {
    name: "Tech Mahindra",
    slug: "tech-mahindra",
    career_page_url: "https://careers.techmahindra.com/",
    tier: "IT Services & Telecom",
    verified: false,
    overview:
      "Pune-headquartered IT services company with a strong telecom-sector client base, part of the Mahindra Group.",
    hiring_process: [
      { stage: "Online Assessment", description: "General pattern: aptitude and coding assessment. Not yet individually verified." },
      { stage: "Technical Interview", description: "Core CS fundamentals, standard IT-services pattern." },
      { stage: "HR Interview", description: "Fit and communication." },
    ],
    required_skills: ["Programming fundamentals", "Aptitude", "Communication"],
    prep_roadmap:
      "General IT-services prep applies. Not yet individually researched — verify specifics on Tech Mahindra's " +
      "official careers page before relying on this for real prep.",
    source_urls: [],
  },
  {
    name: "Capgemini",
    slug: "capgemini",
    career_page_url: "https://www.capgemini.com/in-en/careers/",
    tier: "IT Services & Consulting",
    verified: false,
    overview:
      "French-origin, India-heavy IT services and consulting company. Historically known for a pseudocode-heavy " +
      "technical assessment round, distinct from pure coding tests.",
    hiring_process: [
      { stage: "Aptitude + Pseudocode Test", description: "General pattern: known for testing pseudocode/logic-writing specifically, not just raw coding. Exact current format not yet individually verified." },
      { stage: "Technical Interview", description: "Standard IT-services pattern." },
      { stage: "HR Interview", description: "Fit and communication." },
    ],
    required_skills: ["Pseudocode / logical writing", "Aptitude", "Programming fundamentals"],
    prep_roadmap:
      "If the pseudocode-focused reputation still holds, practicing writing clear step-by-step logic (not just " +
      "working code) is worth extra attention here versus other IT-services companies. Not yet individually " +
      "verified for the current cycle — confirm on Capgemini's careers page.",
    source_urls: [],
  },
  {
    name: "LTIMindtree",
    slug: "ltimindtree",
    career_page_url: "https://www.ltimindtree.com/careers/",
    tier: "IT Services",
    verified: false,
    overview:
      "Formed from the 2022 merger of L&T Infotech and Mindtree, now one of India's larger IT services firms.",
    hiring_process: [
      { stage: "Online Assessment", description: "General pattern: aptitude and coding assessment. Not yet individually verified." },
      { stage: "Technical Interview", description: "Standard IT-services pattern." },
      { stage: "HR Interview", description: "Fit and communication." },
    ],
    required_skills: ["Programming fundamentals", "Aptitude", "Communication"],
    prep_roadmap:
      "General IT-services prep applies. Not yet individually researched — verify specifics on LTIMindtree's " +
      "official careers page.",
    source_urls: [],
  },
  {
    name: "IBM India",
    slug: "ibm-india",
    career_page_url: "https://www.ibm.com/careers/",
    tier: "IT Services & Product",
    verified: false,
    overview:
      "IBM's India operations hire freshers into roles like Application Developer and Associate System Engineer, " +
      "generally through IBM's own assessment platform rather than the shared AMCAT-style tests common elsewhere.",
    hiring_process: [
      { stage: "Online Assessment", description: "General pattern: aptitude and technical assessment on IBM's own platform. Not yet individually verified." },
      { stage: "Technical Interview", description: "CS fundamentals and behavioral elements combined, per general reports." },
      { stage: "HR Interview", description: "Fit and communication." },
    ],
    required_skills: ["Programming fundamentals", "Aptitude", "Communication"],
    prep_roadmap:
      "General IT-services/product-hybrid prep applies. Not yet individually researched — verify specifics on " +
      "IBM's official careers page before your drive.",
    source_urls: [],
  },
  {
    name: "Genpact",
    slug: "genpact",
    career_page_url: "https://www.genpact.com/careers",
    tier: "BPM & Analytics",
    verified: false,
    overview:
      "Business process management and analytics-focused company, hiring freshers into both technical and " +
      "process/domain-analyst roles — a different profile than pure software-services companies.",
    hiring_process: [
      { stage: "Aptitude + Domain Assessment", description: "General pattern: aptitude plus role-specific (technical or process/analytics) assessment. Not yet individually verified." },
      { stage: "Technical/Domain Interview", description: "Depends on role track — technical for engineering roles, domain knowledge for analyst roles." },
      { stage: "HR Interview", description: "Fit and communication." },
    ],
    required_skills: ["Aptitude", "Domain/analytics fundamentals (for analyst roles)", "Programming fundamentals (for technical roles)"],
    prep_roadmap:
      "Clarify which track (technical vs. analyst) you're applying for early, since prep differs significantly. " +
      "Not yet individually researched — verify specifics on Genpact's official careers page.",
    source_urls: [],
  },
  {
    name: "Persistent Systems",
    slug: "persistent-systems",
    career_page_url: "https://www.persistent.com/careers/",
    tier: "Product Engineering Services",
    verified: false,
    overview:
      "Pune-headquartered product engineering services company — generally considered more technically deep " +
      "than pure BPO-style IT services, closer to a product-company hiring bar in some roles.",
    hiring_process: [
      { stage: "Online Assessment", description: "General pattern: aptitude and coding, likely with more DSA depth than pure-play IT services given the product-engineering focus. Not yet individually verified." },
      { stage: "Technical Interview", description: "Standard pattern, likely deeper technical bar than typical IT services." },
      { stage: "HR Interview", description: "Fit and communication." },
    ],
    required_skills: ["Programming fundamentals", "DSA", "Aptitude"],
    prep_roadmap:
      "Given Persistent's product-engineering positioning, err toward preparing DSA more seriously than you " +
      "would for a pure IT-services company. Not yet individually verified — confirm on Persistent's careers page.",
    source_urls: [],
  },
  {
    name: "Hexaware Technologies",
    slug: "hexaware",
    career_page_url: "https://hexaware.com/careers/",
    tier: "IT Services",
    verified: false,
    overview: "Mumbai-headquartered mid-sized IT services company, active in campus hiring across India.",
    hiring_process: [
      { stage: "Online Assessment", description: "General pattern: aptitude and coding assessment. Not yet individually verified." },
      { stage: "Technical Interview", description: "Standard IT-services pattern." },
      { stage: "HR Interview", description: "Fit and communication." },
    ],
    required_skills: ["Programming fundamentals", "Aptitude", "Communication"],
    prep_roadmap:
      "General IT-services prep applies. Not yet individually researched — verify specifics on Hexaware's " +
      "official careers page.",
    source_urls: [],
  },
  {
    name: "Zensar Technologies",
    slug: "zensar",
    career_page_url: "https://www.zensar.com/careers",
    tier: "IT Services",
    verified: false,
    overview: "Pune-headquartered mid-sized IT services and digital solutions company.",
    hiring_process: [
      { stage: "Online Assessment", description: "General pattern: aptitude and coding assessment. Not yet individually verified." },
      { stage: "Technical Interview", description: "Standard IT-services pattern." },
      { stage: "HR Interview", description: "Fit and communication." },
    ],
    required_skills: ["Programming fundamentals", "Aptitude", "Communication"],
    prep_roadmap:
      "General IT-services prep applies. Not yet individually researched — verify specifics on Zensar's " +
      "official careers page.",
    source_urls: [],
  },
  {
    name: "Coforge",
    slug: "coforge",
    career_page_url: "https://www.coforge.com/careers",
    tier: "IT Services",
    verified: false,
    overview: "Noida-headquartered IT services company, active in campus and off-campus fresher hiring.",
    hiring_process: [
      { stage: "Online Assessment", description: "General pattern: aptitude and coding assessment. Not yet individually verified." },
      { stage: "Technical Interview", description: "Standard IT-services pattern." },
      { stage: "HR Interview", description: "Fit and communication." },
    ],
    required_skills: ["Programming fundamentals", "Aptitude", "Communication"],
    prep_roadmap:
      "General IT-services prep applies. Not yet individually researched — verify specifics on Coforge's " +
      "official careers page.",
    source_urls: [],
  },
  {
    name: "Deloitte",
    slug: "deloitte",
    career_page_url: "https://www2.deloitte.com/in/en/careers.html",
    tier: "Consulting",
    verified: false,
    overview:
      "Global professional services and consulting firm (\"Big 4\"). Hires freshers for both technology/analyst " +
      "and consulting-track roles — the two have meaningfully different prep needs.",
    hiring_process: [
      { stage: "Aptitude/Case Test", description: "General pattern: quantitative and logical reasoning for tech roles; case-style questions more common for consulting-track roles. Not yet individually verified." },
      { stage: "Technical/Case Interview", description: "CS fundamentals for tech roles; business case discussion for consulting roles." },
      { stage: "HR/Partner Interview", description: "Communication, motivation, and cultural fit." },
    ],
    required_skills: ["Core CS fundamentals (tech track)", "Case/business reasoning (consulting track)", "Communication"],
    prep_roadmap:
      "Figure out which track (technology vs. consulting) you're actually being considered for early — the " +
      "prep is quite different. Not yet individually researched — verify specifics on Deloitte's official careers page.",
    source_urls: [],
  },
  {
    name: "Mphasis",
    slug: "mphasis",
    career_page_url: "https://careers.mphasis.com",
    tier: "IT Services",
    verified: false,
    overview: "IT services and BPO company focused on applied technology and business process services.",
    hiring_process: [
      { stage: "Aptitude Test", description: "General pattern: quantitative, verbal, logical reasoning. Not yet individually verified." },
      { stage: "Technical Interview", description: "Core CS fundamentals and project discussion." },
      { stage: "HR Interview", description: "Communication and culture-fit assessment." },
    ],
    required_skills: ["Core CS fundamentals", "Aptitude & reasoning", "Communication"],
    prep_roadmap:
      "General IT-services prep applies. Not yet individually researched — verify specifics on Mphasis's " +
      "official careers page.",
    source_urls: [],
  },
  {
    name: "Virtusa",
    slug: "virtusa",
    career_page_url: "https://www.virtusa.com/careers",
    tier: "IT Services",
    verified: false,
    overview: "US-headquartered IT services company with a large India delivery workforce.",
    hiring_process: [
      { stage: "Aptitude + Coding Test", description: "General pattern: quantitative, verbal, logical reasoning, plus basic coding. Not yet individually verified." },
      { stage: "Technical Interview", description: "Core CS fundamentals and project discussion." },
      { stage: "HR Interview", description: "Communication and role-fit assessment." },
    ],
    required_skills: ["Core CS fundamentals", "Basic coding", "Aptitude & reasoning"],
    prep_roadmap:
      "General IT-services prep applies. Not yet individually researched — verify specifics on Virtusa's " +
      "official careers page.",
    source_urls: [],
  },
  {
    name: "Cyient",
    slug: "cyient",
    career_page_url: "https://www.cyient.com/careers",
    tier: "Engineering / IT Services",
    verified: false,
    overview:
      "Engineering and IT services company focused on engineering R&D, aerospace, and industrial clients — " +
      "hiring skews toward core engineering branches more than pure CS.",
    hiring_process: [
      { stage: "Aptitude Test", description: "General pattern: quantitative, verbal, logical reasoning, sometimes with domain-specific technical MCQs. Not yet individually verified." },
      { stage: "Technical Interview", description: "Core engineering/CS fundamentals and project discussion." },
      { stage: "HR Interview", description: "Communication and role-fit assessment." },
    ],
    required_skills: ["Core engineering fundamentals", "Aptitude & reasoning", "Domain-specific technical knowledge"],
    prep_roadmap:
      "Relevant primarily for core-engineering-branch candidates (Mechanical, Electrical, Aerospace) as well " +
      "as CS. Not yet individually researched — verify specifics on Cyient's official careers page.",
    source_urls: [],
  },
  {
    name: "L&T Technology Services",
    slug: "ltts",
    career_page_url: "https://www.ltts.com/careers",
    tier: "Engineering R&D Services",
    verified: false,
    overview:
      "Engineering R&D services arm of Larsen & Toubro, hiring heavily from core engineering branches " +
      "(Mechanical, Electrical, Electronics) alongside CS.",
    hiring_process: [
      { stage: "Aptitude Test", description: "General pattern: quantitative, verbal, logical reasoning, often with domain-specific technical sections. Not yet individually verified." },
      { stage: "Technical Interview", description: "Core engineering fundamentals and project discussion." },
      { stage: "HR Interview", description: "Communication and role-fit assessment." },
    ],
    required_skills: ["Core engineering fundamentals", "Domain-specific technical knowledge", "Aptitude & reasoning"],
    prep_roadmap:
      "Particularly relevant for core-engineering-branch candidates, not just CS. Not yet individually " +
      "researched — verify specifics on L&T Technology Services' official careers page.",
    source_urls: [],
  },
];

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);

  for (const c of companies) {
    console.log(`Seeding ${c.name}...`);

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .upsert(
        {
          name: c.name,
          slug: c.slug,
          career_page_url: c.career_page_url,
          metadata: { tier: c.tier, verified: c.verified },
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (companyError || !company) {
      console.error(`  Failed to upsert company: ${companyError?.message}`);
      continue;
    }

    const { error: intelError } = await supabase.from("company_intel").upsert(
      {
        company_id: company.id,
        overview: c.overview,
        hiring_process: c.hiring_process,
        required_skills: c.required_skills,
        prep_roadmap: c.prep_roadmap,
        source_urls: c.source_urls,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "company_id" }
    );

    if (intelError) {
      console.error(`  Failed to upsert company_intel: ${intelError.message}`);
    }

    if (c.dsa_topics?.length) {
      await supabase.from("company_dsa_topics").delete().eq("company_id", company.id);
      const { error: topicsError } = await supabase
        .from("company_dsa_topics")
        .insert(c.dsa_topics.map((t) => ({ company_id: company.id, topic: t.topic, emphasis: t.emphasis })));
      if (topicsError) {
        console.error(`  Failed to insert dsa_topics: ${topicsError.message}`);
      }
    }
  }

  console.log(`\nDone. Seeded ${companies.length} companies (5 verified, 15 general-pattern).`);
}

seed();

export interface SeedCompany {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  career_page_url: string | null;
  hiring_rounds_count: number;
  required_skills: string[];
  top_topics: string[];
  metadata: {
    tier: string;
    type: string;
    city: string;
    ctc_range: string;
    rating: string;
    wlb: string;
    work_policy: string;
    verified: boolean;
    pros: string[];
    cons: string[];
    suggested_projects: string[];
    interview_guidance: string;
  };
  overview: string;
  hiring_process: Array<{ stage: string; description: string }>;
}

export const SEED_COMPANIES: SeedCompany[] = [
  {
    id: "comp_google",
    name: "Google",
    slug: "google",
    logo_url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    career_page_url: "https://careers.google.com",
    hiring_rounds_count: 5,
    required_skills: ["C++", "Python", "Go", "Distributed Systems", "Algorithms", "System Design"],
    top_topics: ["dp", "graphs", "trees", "strings", "system-design"],
    metadata: {
      tier: "Tier 1 Global Tech Product",
      type: "Product & AI Cloud Tech Giant",
      city: "Bengaluru / Hyderabad",
      ctc_range: "₹35 LPA - ₹65 LPA",
      rating: "4.6 / 5.0",
      wlb: "4.5 / 5.0",
      work_policy: "Hybrid (3 days in office)",
      verified: true,
      pros: [
        "Unmatched engineering scale and global product impact",
        "Top-tier compensation and equity grants",
        "World-class peer engineering culture and research labs",
      ],
      cons: [
        "High internal bureaucracy and slow promotion velocity",
        "Competitive internal performance calibration rounds",
      ],
      suggested_projects: [
        "Distributed Key-Value Store with Raft Consensus Engine in Go",
        "High-Throughput Vector Search Engine for RAG Embeddings",
      ],
      interview_guidance: "DO articulate time & space complexity trade-offs upfront. DON'T jump straight into code without writing pseudocode.",
    },
    overview: `TYPE: Global Product Engineering Giant
LOCATION: Bengaluru & Hyderabad R&D Campuses
ROLE: Software Development Engineer (SDE 1 & SDE 2)
SKILLS: Distributed Systems, Dynamic Programming, Graphs, System Architecture
TRACK: Core Software Infrastructure & Cloud AI`,
    hiring_process: [
      { stage: "Round 1: Online Technical Screening", description: "2 Complex DSA / Algorithmic questions on HackerRank or Google Internal Platform (45 mins)." },
      { stage: "Round 2: Data Structures & Algorithmic Design 1", description: "Deep dive into Graph algorithms, Dynamic Programming, and Tree Traversals with live code execution." },
      { stage: "Round 3: Data Structures & Algorithmic Design 2", description: "Advanced sliding window, string processing, and memory-constrained data structure design." },
      { stage: "Round 4: High-Level & Low-Level System Design", description: "Designing distributed pub-sub systems, distributed caches, and rate limiters at 1M QPS." },
      { stage: "Round 5: Googleliness & Leadership Behavior", description: "Behavioral assessment on cross-functional collaboration, ownership, and handling technical ambiguity." },
    ],
  },
  {
    id: "comp_microsoft",
    name: "Microsoft",
    slug: "microsoft",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
    career_page_url: "https://careers.microsoft.com",
    hiring_rounds_count: 4,
    required_skills: ["C#", "C++", "TypeScript", "Azure Cloud", "Data Structures", "OOPs"],
    top_topics: ["trees", "graphs", "dp", "linked-lists", "system-design"],
    metadata: {
      tier: "Tier 1 Global Product",
      type: "Cloud, AI & OS Platform Giant",
      city: "Hyderabad / Bengaluru / Noida",
      ctc_range: "₹28 LPA - ₹52 LPA",
      rating: "4.5 / 5.0",
      wlb: "4.4 / 5.0",
      work_policy: "Hybrid (Flexible)",
      verified: true,
      pros: [
        "Exceptional work-life balance and employee wellness",
        "Generous stock grants (MSFT RSUs) and benefits",
        "Massive investment in Copilot & Generative AI infrastructure",
      ],
      cons: [
        "Legacy codebase maintenance in mature product orgs",
      ],
      suggested_projects: [
        "Cloud-Native Distributed Task Scheduler with Dead Letter Queues",
        "Real-Time Collaborative Document Editor using Operational Transformation",
      ],
      interview_guidance: "DO write clean object-oriented code with proper exception handling. DON'T ignore boundary conditions.",
    },
    overview: `TYPE: Enterprise Cloud & AI Giant
LOCATION: Hyderabad IDC Campus & Bengaluru Tech Parks
ROLE: Software Engineer (Level 59 - 62)
SKILLS: C++, C#, Azure Cloud, Data Structures, OOPs Architecture
TRACK: Cloud Platforms & AI Infrastructure`,
    hiring_process: [
      { stage: "Round 1: Codility Online Assessment", description: "3 Algorithmic problems testing Array manipulation, Strings, and Greedy algorithms (90 mins)." },
      { stage: "Round 2: Technical Interview 1 (DSA)", description: "Live coding on Trees, Binary Search, and Recursion with clean modular OOP design." },
      { stage: "Round 3: Technical Interview 2 (Data Structures & LLD)", description: "Low level object-oriented design of a parking lot, elevator system, or LRU cache." },
      { stage: "Round 4: AA (As-If-Architect / Bar Raiser)", description: "System architecture, behavioral culture fit, and passion for product engineering." },
    ],
  },
  {
    id: "comp_meesho",
    name: "Meesho",
    slug: "meesho",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo.png",
    career_page_url: "https://meesho.io/careers",
    hiring_rounds_count: 4,
    required_skills: ["Java", "Spring Boot", "React", "PostgreSQL", "Kafka", "Redis"],
    top_topics: ["system-design", "sql", "arrays", "stacks-queues"],
    metadata: {
      tier: "Unicorn E-Commerce Product",
      type: "Hyper-Growth E-Commerce & Tech Platform",
      city: "Bengaluru (Hybrid)",
      ctc_range: "₹24 LPA - ₹45 LPA",
      rating: "4.2 / 5.0",
      wlb: "3.8 / 5.0",
      work_policy: "Boundaryless / Hybrid",
      verified: true,
      pros: [
        "Rapid career growth and high ownership of core services",
        "High-scale traffic architecture (handling 10M+ daily orders)",
      ],
      cons: [
        "Fast-paced environment during seasonal sale mega-events",
      ],
      suggested_projects: [
        "High-Concurrency Flash Sale Inventory Engine with Redis Locks",
        "Event-Driven Logistics Tracking Service using Apache Kafka",
      ],
      interview_guidance: "DO focus on real-world system scalability and DB indexing. DON'T give pure theoretical answers without trade-off numbers.",
    },
    overview: `TYPE: Hyper-Growth E-Commerce Platform
LOCATION: Bengaluru HQ
ROLE: SDE 1 / SDE 2
SKILLS: Java, Spring Boot, Microservices, Kafka, Redis, Distributed Systems
TRACK: High-Scale E-Commerce Systems`,
    hiring_process: [
      { stage: "Round 1: Problem Solving Assessment", description: "DSA questions focusing on Arrays, Strings, HashMaps, and Sorting (60 mins)." },
      { stage: "Round 2: Machine Coding Round", description: "Live 90-minute coding round to build a complete working microservice (e.g. Order Cart / Pricing Calculator)." },
      { stage: "Round 3: System Design & Architecture", description: "High-level design of notification engines, search indexing, or inventory locks." },
      { stage: "Round 4: Cultural Values & Hiring Manager", description: "Ownership, speed of execution, and problem-solving mindset alignment." },
    ],
  },
  {
    id: "comp_stripe",
    name: "Stripe",
    slug: "stripe",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png",
    career_page_url: "https://stripe.com/jobs",
    hiring_rounds_count: 5,
    required_skills: ["Ruby", "Go", "Java", "API Design", "Distributed Payments", "PostgreSQL"],
    top_topics: ["web-development", "system-design", "sql", "stacks-queues"],
    metadata: {
      tier: "Tier 1 Global Fintech Infra",
      type: "Global Payments Infrastructure Pioneer",
      city: "Bengaluru R&D / Remote",
      ctc_range: "₹40 LPA - ₹75 LPA",
      rating: "4.7 / 5.0",
      wlb: "4.2 / 5.0",
      work_policy: "Remote / Hybrid",
      verified: true,
      pros: [
        "Industry-leading engineering standards and API design excellence",
        "Extremely lucrative compensation package",
      ],
      cons: [
        "Rigorous interview process with high candidate elimination bar",
      ],
      suggested_projects: [
        "Idempotent Payment Gateway Wrapper with Automatic Retry & Webhooks",
        "Financial Ledger Engine with Immutable Double-Entry Accounting",
      ],
      interview_guidance: "DO write clean production code with comprehensive unit tests. DON'T write unhandled API edge cases.",
    },
    overview: `TYPE: Global Fintech Infrastructure Leader
LOCATION: Bengaluru & Global Remote
ROLE: Software Engineer (Backend / Systems)
SKILLS: API Design, Idempotency, Distributed Databases, Go, Java
TRACK: Financial Infrastructure & Payments`,
    hiring_process: [
      { stage: "Round 1: Practical Coding Assessment", description: "Real-world API integration and data transformation task (60 mins)." },
      { stage: "Round 2: Bug Hunting & Code Debugging", description: "Locating and fixing concurrency bugs in a complex existing codebase." },
      { stage: "Round 3: System Design & Data Modeling", description: "Designing an idempotent ledger or global rate-limiting API." },
      { stage: "Round 4: Technical Integration & Integration Testing", description: "Building a production-ready HTTP integration with test suites." },
      { stage: "Round 5: Culture & Values", description: "Verifying alignment with Stripe's operating principles and user-first focus." },
    ],
  },
  {
    id: "comp_phonepe",
    name: "PhonePe",
    slug: "phonepe",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png",
    career_page_url: "https://phonepe.com/careers",
    hiring_rounds_count: 4,
    required_skills: ["Java", "Kotlin", "Spring Boot", "MySQL", "HBase", "System Design"],
    top_topics: ["system-design", "sql", "arrays", "dp"],
    metadata: {
      tier: "Unicorn Fintech Tech",
      type: "UPI & Digital Payments Giant",
      city: "Bengaluru / Pune",
      ctc_range: "₹26 LPA - ₹48 LPA",
      rating: "4.3 / 5.0",
      wlb: "4.0 / 5.0",
      work_policy: "On-site / Hybrid",
      verified: true,
      pros: [
        "Handles India's largest UPI transaction volumes (7B+ monthly transactions)",
        "Deep technical learning in fault-tolerant transaction processing",
      ],
      cons: [
        "High pressure during festive peak traffic sales",
      ],
      suggested_projects: [
        "High-Throughput UPI Settlement Processor with Distributed Locks",
        "Real-Time Fraud Detection Engine using Stream Processing",
      ],
      interview_guidance: "DO explain low-latency DB transaction isolation levels. DON'T ignore ACID properties.",
    },
    overview: `TYPE: Digital Payments & UPI Infra Giant
LOCATION: Bengaluru Tech Hub
ROLE: Software Engineer
SKILLS: Java, Microservices, Low-Latency Architecture, Distributed Systems
TRACK: Fintech & Mobile Backend Systems`,
    hiring_process: [
      { stage: "Round 1: Problem Solving Screening", description: "2 High-difficulty DSA questions on Arrays, HashMaps, and Dynamic Programming." },
      { stage: "Round 2: Machine Coding Round", description: "90-minute live coding challenge: Build an in-memory payment wallet system with OOP design." },
      { stage: "Round 3: System Design & Scalability", description: "Design a fault-tolerant UPI payment gateway handling 10,000 transactions per second." },
      { stage: "Round 4: HM & Engineering Leadership", description: "Project deep-dive, past achievements, and engineering mindset evaluation." },
    ],
  },
];

export function getSeedCompanyBySlug(slug: string): SeedCompany | undefined {
  return SEED_COMPANIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

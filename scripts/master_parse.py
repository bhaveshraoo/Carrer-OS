"""
FINAL master parser - uses correct block boundaries based on actual file format.
Each company spans: 🏢 ... Company Name: ... (sections 1-6) ... Source URLs
"""

import os
import re
import json
import docx
import pypdf
import urllib.parse

def read_file(path):
    if path.endswith('.docx'):
        doc = docx.Document(path)
        return '\n'.join([p.text for p in doc.paragraphs if p.text])
    elif path.endswith('.pdf'):
        reader = pypdf.PdfReader(path)
        pages = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                pages.append(t)
        return '\n'.join(pages)
    return ""

def clean_slug(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text or "company-profile"

def extract_pros_cons(text, field):
    """Extract pros or cons - handle full paragraph format."""
    m = re.search(rf'{field}:\s*([^\n]+)', text)
    if not m:
        return []
    raw = m.group(1).strip()
    # Split on semicolons before capitals
    parts = re.split(r';\s*(?=[A-Z])', raw)
    result = [p.strip().rstrip(';').strip() for p in parts if p.strip() and len(p.strip()) > 15]
    if not result and len(raw) > 15:
        result = [raw[:250]]
    return result[:4]

files_city_map = [
    ('jaipur company.docx', 'Jaipur'),
    ('pune companies.docx', 'Pune'),
    ('delhi ncr , hydrabad, chennai.docx', 'Delhi-NCR / Hyderabad / Chennai'),
    ('company details.docx', 'Bengaluru / National'),
    ('Document.pdf', 'Bengaluru'),
]

company_dir = '/Users/bhaveshrao/carrer-os -og/careeros/company'
all_parsed = []
seen_names = set()

for fname, city in files_city_map:
    fpath = os.path.join(company_dir, fname)
    if not os.path.exists(fpath):
        print(f"MISSING: {fpath}", flush=True)
        continue
    txt = read_file(fpath)

    # Split on 🏢 markers (each company starts with a 🏢 line)
    # The split keeps everything from 🏢 onwards
    raw_blocks = re.split(r'(?=🏢)', txt)

    for block in raw_blocks:
        if len(block.strip()) < 80:
            continue
        if 'Company Name:' not in block:
            continue

        # ── NAME ──
        name_m = re.search(r'Company Name:\s*(.+)', block)
        if not name_m:
            continue
        name = name_m.group(1).strip()
        name = re.sub(r'\s*—.*', '', name).strip()
        name = re.sub(r'\s*\(.*?\)\s*$', '', name).strip()
        name = re.sub(r'^\d+\.\s*', '', name).strip()
        if not name or len(name) < 2:
            continue

        clean_n = name.lower().strip()
        if clean_n in seen_names:
            continue
        seen_names.add(clean_n)

        # ── SLUG ──
        slug_m = re.search(r'Company Slug:\s*(\S+)', block)
        fallback_slug = clean_slug(slug_m.group(1).strip()) if slug_m else clean_slug(name)

        # ── TIER ──
        tier_m = re.search(r'Company Tier:\s*(?:☑\s*)?([^\n]+)', block)
        tier = tier_m.group(1).strip() if tier_m else ""

        # ── CTC from tier description ──
        # Format: "Trainee / Associate Developer CTC ~₹3.5 – 6.0 LPA"
        ctc_m = re.search(r'(?:Trainee|Associate|Fresher)[^₹\n]*(?:CTC|Package)[^₹\n]*~?\s*(₹[\d.,\s–\-]+\s*LPA)', tier)
        if not ctc_m:
            ctc_m = re.search(r'(₹[\d.,\s–\-]+\s*LPA)', tier)
        ctc_range = ctc_m.group(1).strip() if ctc_m else ""

        # Also check dedicated CTC line
        if not ctc_range:
            ctc_line_m = re.search(r'(?:Fresher|Package|CTC|Salary)[^:\n]*:\s*(₹[\d.,\s–\-]+\s*LPA)', block)
            ctc_range = ctc_line_m.group(1).strip() if ctc_line_m else ""

        # ── TYPE ──
        type_m = re.search(r'Company Type:\s*(?:☑\s*)?([^\n]+)', block)
        type_str = type_m.group(1).strip() if type_m else ""

        # ── SCOPE ──
        scope_m = re.search(r'Scope:\s*(?:☑\s*)?([^\n]+)', block)
        scope = scope_m.group(1).strip()[:200] if scope_m else ""

        # ── RATING ──
        rating_m = re.search(r'Overall Company Rating:\s*([^\n]+)', block)
        if rating_m:
            raw_r = rating_m.group(1).strip()
            score_m = re.search(r'\(([0-9., /–-]+)\)', raw_r)
            rating = score_m.group(1).strip() if score_m else raw_r[:60]
        else:
            rating = ""

        # ── PROS & CONS ──
        pros = extract_pros_cons(block, 'Pros')
        cons = extract_pros_cons(block, 'Cons')

        # ── WLB ──
        wlb_m = re.search(r'Work.Life Balance(?:\s*Rating)?:\s*([^\n]+)', block)
        wlb = wlb_m.group(1).strip()[:80] if wlb_m else ""

        # ── WORK POLICY ──
        policy_m = re.search(r'Work Policy:\s*(?:☑\s*)?([^\n]+)', block)
        work_policy = policy_m.group(1).strip()[:100] if policy_m else ""

        # ── CAREER TRAJECTORY ──
        traj_m = re.search(r'Career (?:Growth )?Trajectory:\s*([^\n]+)', block)
        career_trajectory = traj_m.group(1).strip()[:200] if traj_m else ""

        # ── ANNUAL INCREMENT ──
        incr_m = re.search(r'Annual (?:Appraisal|Increment)[^:]*:\s*([^\n]+)', block)
        annual_increment = incr_m.group(1).strip()[:100] if incr_m else ""

        # ── RESUME BRANDING ──
        brand_m = re.search(r'Resume Branding[^:]*:\s*(?:☑\s*)?([^\n]+)', block)
        resume_branding = brand_m.group(1).strip()[:150] if brand_m else ""

        # ── CAREER URL ──
        career_url_m = re.search(r'Official Careers Page URL:\s*(https?://[^\s\n]+)', block)
        if career_url_m:
            career_url = career_url_m.group(1).strip()
        else:
            career_url = f"https://www.google.com/search?q={urllib.parse.quote(name + ' careers india')}"

        # ── SUGGESTED PROJECTS ──
        proj_m = re.search(r'Suggested Project[^\n]*:\s*\n([\s\S]*?)(?=Best-Fit|Overall Company Rating|\n\d+\. [A-Z]|\n2\.)', block)
        suggested_projects = []
        if proj_m:
            for line in proj_m.group(1).strip().split('\n'):
                line = line.strip()
                if len(line) > 30:
                    suggested_projects.append(line[:300])
        suggested_projects = suggested_projects[:4]

        # ── SALARY TIERS ──
        # Pattern: "Track-wise Salary Tiers and Levels:\n  Tier 1 / SDE 1 (~0–1 YOE): ₹X.X – Y.Y LPA"
        sal_section_m = re.search(
            r'(?:Track.wise Salary|Salary Tiers|Level.wise Compensation)[^\n]*:\s*\n([\s\S]*?)(?=Annual|Mid.Level|4\. WORK|5\. FUTURE|\n\d+\. [A-Z]|$)',
            block
        )
        salary_tiers = []
        if sal_section_m:
            for line in sal_section_m.group(1).strip().split('\n'):
                line = line.strip()
                if line and ('LPA' in line or '₹' in line):
                    salary_tiers.append(line[:150])
        salary_tiers = salary_tiers[:6]

        # Fallback: extract all CTC mentions from tier line
        if not salary_tiers and tier:
            # "Trainee / Associate Developer CTC ~₹3.5 – 6.0 LPA, Software / Full-Stack Engineer ~₹6.5 – 14.0 LPA"
            tier_ctcs = re.findall(
                r'((?:Trainee|Junior|Senior|Lead|Associate|Software)[^₹,\n]*?)(₹[\d.,\s–\-]+\s*LPA)',
                tier
            )
            for role, ctc in tier_ctcs[:4]:
                entry = f"{role.strip()}: {ctc.strip()}"
                salary_tiers.append(entry[:150])

        # ── INTERVIEW ROUNDS ──
        # Format A: "Round 1 (Title — Duration):" OR "Round 1 (Title):"
        stages = []
        round_blocks_a = list(re.finditer(
            r'Round\s+(\d+)\s*\(([^)]+)\)[:\s]*\n?([\s\S]*?)(?=Round\s+\d+\s*\(|\n🔹|\nPriority DSA|\n3\.\s+SALARY|\n\d+\.\s+[A-Z]HIRING|$)',
            block
        ))
        if round_blocks_a:
            for m in round_blocks_a:
                r_num = m.group(1)
                r_title = m.group(2).strip()
                r_body = ' '.join(m.group(3).strip().split())
                if len(r_body) > 20:
                    stages.append({
                        "stage": f"Round {r_num}: {r_title}",
                        "description": r_body[:800]
                    })

        # Format B: "Stage N — Title:\n..." or "🔹 Stage N: Title"
        if not stages:
            stage_blocks = list(re.finditer(
                r'(?:🔹\s*)?(?:Stage|Phase)\s+(\d+)[:\s—–-]+([^\n]*)\n([\s\S]*?)(?=(?:Stage|Phase)\s+\d+|Round\s+\d+|\n\d+\.\s+[A-Z]|$)',
                block
            ))
            for m in stage_blocks:
                s_num = m.group(1)
                s_title = m.group(2).strip()
                s_body = ' '.join(m.group(3).strip().split())
                if len(s_body) > 20:
                    stages.append({
                        "stage": f"Stage {s_num}: {s_title}",
                        "description": s_body[:800]
                    })

        stages = stages[:6]

        # ── PREP ROADMAP ──
        sec6_m = re.search(
            r'6\.\s*INSIDER PREPARATION ROADMAP[^\n]*\n([\s\S]*?)(?=🌐|Important Reference|7\.\s+|$)',
            block
        )
        if sec6_m:
            prep_roadmap = sec6_m.group(1).strip()
        else:
            sprint_m = re.search(
                r'(?:Custom \d+-Day Sprint|Preparation Roadmap|Interview Sprint)[^\n]*\n([\s\S]*?)(?=Interview Do|🌐|$)',
                block
            )
            prep_roadmap = sprint_m.group(1).strip() if sprint_m else ""

        # ── INTERVIEW GUIDANCE ──
        dos_m = re.search(r"Interview Do's[^\n]*:\s*\n([\s\S]*?)(?=🌐|Reference|Source URL|$)", block)
        interview_guidance = dos_m.group(1).strip()[:1500] if dos_m else ""

        # ── DSA TOPICS ──
        dsa_topics = []
        # Pattern: "Topic Name: X / 10" or "Topic — X/10"
        for m in re.finditer(r'([A-Za-z][^\n:—–]{3,60})(?::|—|–)\s*(\d+)\s*/\s*10', block):
            t_name = m.group(1).strip().lower()
            score = int(m.group(2))
            if score < 5:
                continue
            if re.search(r'array|sliding window|two.pointer|sub.?array', t_name): k = "arrays"
            elif re.search(r'string|substr|pattern.match', t_name): k = "strings"
            elif re.search(r'dynamic.program|dp\b', t_name): k = "dp"
            elif re.search(r'tree|binary.search.tree|bst|heap|trie', t_name): k = "trees"
            elif re.search(r'graph|bfs|dfs|shortest.path|topolog', t_name): k = "graphs"
            elif re.search(r'linked.list', t_name): k = "linked-lists"
            elif re.search(r'stack|queue|deque|monot', t_name): k = "stacks-queues"
            elif re.search(r'greedy|interval|schedul', t_name): k = "greedy"
            elif re.search(r'\bsql\b|dbms|database.query', t_name): k = "sql"
            elif re.search(r'oop|object.orient|solid.principle|class', t_name): k = "oop-concepts"
            elif re.search(r'api|rest|full.stack|react|spring|node\.js|web.dev', t_name): k = "web-development"
            elif re.search(r'system.design|low.level|high.level.design', t_name): k = "system-design"
            elif re.search(r'recursi|backtrack', t_name): k = "recursion"
            else:
                continue
            dsa_topics.append({"topic": k, "emphasis": score})

        # Deduplicate
        dsa_dedup = {}
        for t in dsa_topics:
            if t["topic"] not in dsa_dedup or t["emphasis"] > dsa_dedup[t["topic"]]:
                dsa_dedup[t["topic"]] = t["emphasis"]
        dsa_topics = [{"topic": k, "emphasis": v} for k, v in dsa_dedup.items()]

        # Keyword fallback
        if not dsa_topics:
            kw = block.lower()
            if 'arrays' in kw or 'array' in kw: dsa_topics.append({"topic": "arrays", "emphasis": 8})
            if 'dynamic programming' in kw or ' dp ' in kw: dsa_topics.append({"topic": "dp", "emphasis": 9})
            if ' sql ' in kw or 'dbms' in kw: dsa_topics.append({"topic": "sql", "emphasis": 7})
            if 'oop' in kw or 'object-oriented' in kw: dsa_topics.append({"topic": "oop-concepts", "emphasis": 7})
            if 'system design' in kw: dsa_topics.append({"topic": "system-design", "emphasis": 8})

        # ── REQUIRED SKILLS ──
        skills_m = re.search(r'Most (?:Matching|Demanded) Skill[^:]*:\s*([^\n]+)', block)
        if skills_m:
            required_skills = [s.strip() for s in re.split(r'[,|•]', skills_m.group(1)) if s.strip() and len(s.strip()) > 1][:15]
        else:
            required_skills = ["Data Structures & Algorithms", "Core CS Fundamentals", "Problem Solving"]

        # ── CATEGORY ──
        combined = (type_str + " " + tier).lower()
        category = "Product & Big Tech"
        if re.search(r'service|consult|bpo|outsourc|it services', combined): category = "IT Services"
        elif re.search(r'unicorn|startup|high.growth|series [bcde]', combined): category = "Indian Unicorns"
        elif re.search(r'semiconductor|hardware|chip|embedded|vlsi', combined): category = "Hardware & Chips"
        elif re.search(r'fintech|payment|insurtech|neobank', combined): category = "Fintech"
        elif re.search(r'tier 1a|faang|big tech|maang|faang.equivalent', combined): category = "Big Tech / MAANG"

        # ── SOURCE URLS ──
        urls = re.findall(r'https?://[^\s\n\)\]>]+', block)
        source_urls = list(dict.fromkeys([u for u in urls if 'google.com/search' not in u]))[:4]
        if not source_urls:
            source_urls = [career_url]

        all_parsed.append({
            "name": name[:120],
            "fallback_slug": fallback_slug[:100],
            "career_page_url": career_url[:500],
            "metadata": {
                "tier": tier[:200] or "Tech Company",
                "type": type_str[:150] or "Product & Tech",
                "scope": scope,
                "verified": True,
                "category": category,
                "city": city,
                "ctc_range": ctc_range[:100],
                "rating": rating[:80],
                "wlb": wlb,
                "work_policy": work_policy,
                "pros": pros,
                "cons": cons,
                "suggested_projects": suggested_projects,
                "salary_tiers": salary_tiers,
                "interview_guidance": interview_guidance,
                "annual_increment": annual_increment,
                "resume_branding": resume_branding,
                "career_trajectory": career_trajectory,
            },
            "overview": block[:5000],
            "hiring_process": stages,
            "required_skills": required_skills,
            "dsa_topics": dsa_topics,
            "prep_roadmap": prep_roadmap[:5000],
            "source_urls": source_urls,
        })

print(json.dumps(all_parsed))

import os
import re
import json
import docx
import pypdf
import urllib.request
import urllib.parse
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env.local')

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase environment variables missing!")
    exit(1)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def make_request(url_path, method="GET", payload=None):
    full_url = f"{SUPABASE_URL}/rest/v1/{url_path}"
    data = json.dumps(payload).encode("utf-8") if payload else None
    req = urllib.request.Request(full_url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return json.loads(res_body) if res_body else {}
    except Exception as e:
        print(f"Request error on {url_path}: {e}")
        return None

def read_file_content(filepath):
    if filepath.endswith('.docx'):
        doc = docx.Document(filepath)
        return '\n'.join([p.text for p in doc.paragraphs if p.text])
    elif filepath.endswith('.pdf'):
        reader = pypdf.PdfReader(filepath)
        return '\n'.join([page.extract_text() for page in reader.pages])
    return ""

def clean_slug(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text or "company-profile"

def parse_company_block(block, default_city):
    # Extract Company Name
    name_m = re.search(r'Company Name:\s*([^\n]+)', block)
    if not name_m:
        name_m = re.search(r'🏢\s*(?:Company\s*\d*:?)?\s*([^\n—–]+)', block)
    if not name_m:
        return None

    name = name_m.group(1).strip()
    name = re.sub(r'\s*—.*', '', name).strip()
    name = re.sub(r'\s*\(.*?\)', '', name).strip()
    if not name or len(name) < 2:
        return None

    slug_m = re.search(r'Company Slug:\s*([^\n]+)', block)
    slug = clean_slug(slug_m.group(1).strip()) if slug_m else clean_slug(name)

    tier_m = re.search(r'Company Tier:\s*([^\n]+)', block)
    tier = tier_m.group(1).strip() if tier_m else "Tech Company"

    type_m = re.search(r'Company Type:\s*([^\n]+)', block)
    type_str = type_m.group(1).strip() if type_m else "Product & Tech"

    ctc_m = re.search(r'(?:CTC|Package|Salary)[^\n]*:\s*([^\n]+)', block)
    ctc_range = ctc_m.group(1).strip() if ctc_m else ""

    wlb_m = re.search(r'Work-Life Balance[^\n]*:\s*([^\n]+)', block)
    wlb = wlb_m.group(1).strip() if wlb_m else ""

    wpolicy_m = re.search(r'Work Policy:\s*([^\n]+)', block)
    wpolicy = wpolicy_m.group(1).strip() if wpolicy_m else ""

    networth_m = re.search(r'(?:Net Worth|Valuation|Market Cap)[^\n]*:\s*([^\n]+)', block)
    networth = networth_m.group(1).strip() if networth_m else ""

    career_m = re.search(r'(?:Official Careers Page URL|Careers Page):\s*(https?://[^\s\n]+)', block)
    career_url = career_m.group(1).strip() if career_m else f"https://www.google.com/search?q={urllib.parse.quote(name + ' careers')}"

    # Extract Overview
    overview_m = re.search(r'1\.\s*BASIC INFORMATION & METADATA[\s\S]*?(?:2\.\s*HIRING PROCESS|Hiring Process)', block)
    overview = overview_m.group(0).strip() if overview_m else block[:600]

    # Extract Hiring Stages
    stages = []
    round_matches = re.findall(r'(?:Round|Stage)\s*(\d+|\w+)[^\n]*:\s*([^\n]+(?:\n(?!\•|\d+\.|Round|Stage|Company)[^\n]+)*)', block)
    for r_idx, (r_num, r_desc) in enumerate(round_matches):
        stages.append({
            "stage": f"Round {r_num}",
            "description": r_desc.strip()[:300]
        })
    if not stages:
        stages = [
          { "stage": "Round 1: Online Assessment", "description": "Aptitude, Core CS Fundamentals & Coding Evaluation." },
          { "stage": "Round 2: Technical Interview", "description": "Data Structures & Algorithms, Projects & System Architecture." },
          { "stage": "Round 3: HR / Cultural Fit", "description": "Behavioral questions, career alignment & relocation discussion." }
        ]

    # Extract Skills
    skills = []
    skills_m = re.search(r'(?:Core Required Tech Stack & Skills|Required Skills):\s*([^\n]+)', block)
    if skills_m:
        skills = [s.strip() for s in re.split(r'[,|•]', skills_m.group(1)) if s.strip()]
    if not skills:
        skills = ["Data Structures & Algorithms", "Core CS Fundamentals", "Problem Solving", "System Architecture"]

    # Extract DSA Topics
    dsa_topics = []
    if re.search(r'Arrays', block, re.I): dsa_topics.append({"topic": "arrays", "emphasis": 8})
    if re.search(r'Strings', block, re.I): dsa_topics.append({"topic": "strings", "emphasis": 7})
    if re.search(r'Dynamic Programming|DP', block, re.I): dsa_topics.append({"topic": "dp", "emphasis": 9})
    if re.search(r'Trees|Graphs', block, re.I): dsa_topics.append({"topic": "trees", "emphasis": 8})
    if re.search(r'SQL|DBMS', block, re.I): dsa_topics.append({"topic": "sql", "emphasis": 7})
    if re.search(r'OOP', block, re.I): dsa_topics.append({"topic": "oop-concepts", "emphasis": 8})

    category = "Product & Big Tech"
    if "services" in type_str.lower() or "consulting" in type_str.lower():
        category = "IT Services"
    elif "unicorn" in type_str.lower() or "startup" in type_str.lower():
        category = "Indian Unicorns"
    elif "semiconductor" in type_str.lower() or "hardware" in type_str.lower():
        category = "Hardware & Chips"

    return {
        "name": name,
        "slug": slug,
        "career_page_url": career_url,
        "metadata": {
            "tier": tier,
            "type": type_str,
            "verified": True,
            "category": category,
            "city": default_city,
            "ctc_range": ctc_range,
            "wlb": wlb,
            "work_policy": wpolicy,
            "networth": networth
        },
        "overview": overview[:1200],
        "hiring_process": stages[:6],
        "required_skills": skills[:8],
        "dsa_topics": dsa_topics,
        "prep_roadmap": f"Prioritize high-weight DSA topics ({', '.join([t['topic'] for t in dsa_topics[:3]])}) and review core CS fundamentals for {name}.",
        "source_urls": [career_url]
    }

def main():
    company_dir = '/Users/bhaveshrao/carrer-os -og/careeros/company'
    files_city_map = {
        'jaipur company.docx': 'Jaipur',
        'pune companies.docx': 'Pune',
        'delhi ncr , hydrabad, chennai.docx': 'Delhi-NCR / Hyderabad / Chennai',
        'company details.docx': 'Bengaluru / National',
        'Document.pdf': 'Bengaluru'
    }

    all_parsed = []
    seen_slugs = set()

    for fname, city in files_city_map.items():
        fpath = os.path.join(company_dir, fname)
        if not os.path.exists(fpath):
            continue
        print(f"Reading {fname} ({city})...", flush=True)
        txt = read_file_content(fpath)
        blocks = re.split(r'(?=\n🏢|\nCompany Name:|\n1\.\s*🏢|\n[0-9]+\.\s*🏢)', txt)
        for block in blocks:
            if len(block.strip()) < 50:
                continue
            parsed = parse_company_block(block, city)
            if parsed and parsed["slug"] not in seen_slugs:
                seen_slugs.add(parsed["slug"])
                all_parsed.append(parsed)

    print(f"Total Unique Companies Parsed: {len(all_parsed)}", flush=True)

    # Ingest into Supabase
    success_count = 0
    for comp in all_parsed:
        comp_payload = {
            "name": comp["name"],
            "slug": comp["slug"],
            "career_page_url": comp["career_page_url"],
            "metadata": comp["metadata"]
        }
        # Upsert Company
        make_request("companies?on_conflict=slug", method="POST", payload=comp_payload)
        
        # Query created/existing company to get ID
        quoted_slug = urllib.parse.quote(comp['slug'])
        comp_db = make_request(f"companies?slug=eq.{quoted_slug}&select=id", method="GET")
        if comp_db and len(comp_db) > 0:
            c_id = comp_db[0]["id"]

            # Upsert Company Intel
            intel_payload = {
                "company_id": c_id,
                "overview": comp["overview"],
                "hiring_process": comp["hiring_process"],
                "required_skills": comp["required_skills"],
                "prep_roadmap": comp["prep_roadmap"],
                "source_urls": comp["source_urls"]
            }
            make_request("company_intel?on_conflict=company_id", method="POST", payload=intel_payload)

            # Upsert DSA Topics
            for top in comp["dsa_topics"]:
                top_payload = {
                    "company_id": c_id,
                    "topic": top["topic"],
                    "emphasis": top["emphasis"]
                }
                make_request("company_dsa_topics?on_conflict=company_id,topic", method="POST", payload=top_payload)

            success_count += 1
            if success_count % 10 == 0 or success_count == len(all_parsed):
                print(f"Successfully ingested {success_count}/{len(all_parsed)} companies...", flush=True)

    print(f"🎉 INGESTION COMPLETE! {success_count} companies fully seeded into Supabase.", flush=True)

if __name__ == "__main__":
    main()

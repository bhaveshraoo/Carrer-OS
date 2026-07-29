const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase env vars missing!');
  process.exit(1);
}

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
};

async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const options = {
    method,
    headers,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // Return error object if failed
    return { error: true, status: res.status, data };
  }
  return data;
}

async function run() {
  const { execSync } = require('child_process');
  
  const pyScript = `
import os, docx, pypdf, re, json, urllib.parse

def read_file(path):
    if path.endswith('.docx'):
        doc = docx.Document(path)
        return '\\n'.join([p.text for p in doc.paragraphs if p.text])
    else:
        reader = pypdf.PdfReader(path)
        return '\\n'.join([page.extract_text() for page in reader.pages])

def clean_slug(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\\s-]', '', text)
    text = re.sub(r'[\\s-]+', '-', text).strip('-')
    return text or "company-profile"

files_city_map = {
    'jaipur company.docx': 'Jaipur',
    'pune companies.docx': 'Pune',
    'delhi ncr , hydrabad, chennai.docx': 'Delhi-NCR / Hyderabad / Chennai',
    'company details.docx': 'Bengaluru / National',
    'Document.pdf': 'Bengaluru'
}

company_dir = '/Users/bhaveshrao/carrer-os -og/careeros/company'
all_parsed = []
seen_names = set()

for fname, city in files_city_map.items():
    fpath = os.path.join(company_dir, fname)
    if not os.path.exists(fpath):
        continue
    txt = read_file(fpath)
    blocks = re.split(r'(?=\\n🏢|\\nCompany Name:|\\n1\\.\\s*🏢|\\n[0-9]+\\.\\s*🏢)', txt)
    for block in blocks:
        if len(block.strip()) < 50:
            continue
        name_m = re.search(r'Company Name:\\s*([^\\n]+)', block)
        if not name_m:
            name_m = re.search(r'🏢\\s*(?:Company\\s*\\d*:?)?\\s*([^\\n—–]+)', block)
        if not name_m:
            continue

        name = name_m.group(1).strip()
        name = re.sub(r'\\s*—.*', '', name).strip()
        name = re.sub(r'\\s*\\(.*?\\)', '', name).strip()
        if not name or len(name) < 2:
            continue

        clean_n = name.lower()
        if clean_n in seen_names:
            continue
        seen_names.add(clean_n)

        slug_m = re.search(r'Company Slug:\\s*([^\\n]+)', block)
        slug = clean_slug(slug_m.group(1).strip()) if slug_m else clean_slug(name)

        tier_m = re.search(r'Company Tier:\\s*([^\\n]+)', block)
        tier = tier_m.group(1).strip() if tier_m else "Tech Company"

        type_m = re.search(r'Company Type:\\s*([^\\n]+)', block)
        type_str = type_m.group(1).strip() if type_m else "Product & Tech"

        ctc_m = re.search(r'(?:CTC|Package|Salary)[^\\n]*:\\s*([^\\n]+)', block)
        ctc_range = ctc_m.group(1).strip() if ctc_m else ""

        career_m = re.search(r'(?:Official Careers Page URL|Careers Page):\\s*(https?://[^\\s\\n]+)', block)
        career_url = career_m.group(1).strip() if career_m else f"https://www.google.com/search?q={urllib.parse.quote(name + ' careers')}"

        overview_m = re.search(r'1\\.\\s*BASIC INFORMATION & METADATA[\\s\\S]*?(?:2\\.\\s*HIRING PROCESS|Hiring Process)', block)
        overview = overview_m.group(0).strip() if overview_m else block[:600]

        stages = []
        round_matches = re.findall(r'(?:Round|Stage)\\s*(\\d+|\\w+)[^\\n]*:\\s*([^\\n]+(?:\\n(?!\\•|\\d+\\.|Round|Stage|Company)[^\\n]+)*)', block)
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

        skills = []
        skills_m = re.search(r'(?:Core Required Tech Stack & Skills|Required Skills):\\s*([^\\n]+)', block)
        if skills_m:
            skills = [s.strip() for s in re.split(r'[,|•]', skills_m.group(1)) if s.strip()]
        if not skills:
            skills = ["Data Structures & Algorithms", "Core CS Fundamentals", "Problem Solving", "System Architecture"]

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

        all_parsed.append({
            "name": name[:100],
            "slug": slug[:100],
            "career_page_url": career_url[:500],
            "metadata": {
                "tier": tier[:100],
                "type": type_str[:100],
                "verified": True,
                "category": category,
                "city": city,
                "ctc_range": ctc_range[:100]
            },
            "overview": overview[:1200],
            "hiring_process": stages[:6],
            "required_skills": skills[:8],
            "dsa_topics": dsa_topics,
            "prep_roadmap": f"Prioritize high-weight DSA topics ({', '.join([t['topic'] for t in dsa_topics[:3]])}) and review core CS fundamentals for {name}.",
            "source_urls": [career_url[:500]]
        })

print(json.dumps(all_parsed))
`;

  console.log('Extracting parsed company data from Python...');
  const jsonStr = execSync('/Library/Frameworks/Python.framework/Versions/3.14/bin/python3 -c "' + pyScript.replace(/"/g, '\\"') + '"', { maxBuffer: 50 * 1024 * 1024 }).toString();
  const companies = JSON.parse(jsonStr);
  console.log(`Parsed ${companies.length} unique companies from user research files!`);

  let count = 0;
  for (const comp of companies) {
    // 1. Check if company exists by slug or name
    let cId = null;
    const existingSlug = await apiRequest(`companies?slug=eq.${encodeURIComponent(comp.slug)}&select=id`);
    if (existingSlug && Array.isArray(existingSlug) && existingSlug.length > 0) {
      cId = existingSlug[0].id;
    } else {
      const existingName = await apiRequest(`companies?name=eq.${encodeURIComponent(comp.name)}&select=id`);
      if (existingName && Array.isArray(existingName) && existingName.length > 0) {
        cId = existingName[0].id;
      }
    }

    if (cId) {
      // Update existing
      await apiRequest(`companies?id=eq.${cId}`, 'PATCH', {
        career_page_url: comp.career_page_url,
        metadata: comp.metadata
      });
    } else {
      // Insert new
      const inserted = await apiRequest('companies', 'POST', [{
        name: comp.name,
        slug: comp.slug,
        career_page_url: comp.career_page_url,
        metadata: comp.metadata
      }]);
      if (inserted && Array.isArray(inserted) && inserted.length > 0) {
        cId = inserted[0].id;
      }
    }

    if (cId) {
      // Upsert Intel
      const existingIntel = await apiRequest(`company_intel?company_id=eq.${cId}&select=id`);
      if (existingIntel && Array.isArray(existingIntel) && existingIntel.length > 0) {
        await apiRequest(`company_intel?company_id=eq.${cId}`, 'PATCH', {
          overview: comp.overview,
          hiring_process: comp.hiring_process,
          required_skills: comp.required_skills,
          prep_roadmap: comp.prep_roadmap,
          source_urls: comp.source_urls
        });
      } else {
        await apiRequest('company_intel', 'POST', [{
          company_id: cId,
          overview: comp.overview,
          hiring_process: comp.hiring_process,
          required_skills: comp.required_skills,
          prep_roadmap: comp.prep_roadmap,
          source_urls: comp.source_urls
        }]);
      }

      // Upsert DSA Topics
      for (const t of comp.dsa_topics) {
        const existingTopic = await apiRequest(`company_dsa_topics?company_id=eq.${cId}&topic=eq.${encodeURIComponent(t.topic)}&select=company_id`);
        if (!existingTopic || !Array.isArray(existingTopic) || existingTopic.length === 0) {
          await apiRequest('company_dsa_topics', 'POST', [{
            company_id: cId,
            topic: t.topic,
            emphasis: t.emphasis
          }]);
        }
      }

      count++;
      if (count % 20 === 0 || count === companies.length) {
        console.log(`Successfully processed & updated ${count}/${companies.length} companies in Supabase...`);
      }
    }
  }

  console.log(`🎉 SUCCESS! Processed & seeded ${count} total companies from user research into Supabase.`);
}

run().catch(console.error);

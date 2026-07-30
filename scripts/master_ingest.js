/**
 * MASTER INGESTION SCRIPT
 * - Matches existing Supabase rows by NAME (case-insensitive, not slug)
 * - Patches metadata + career_page_url on companies table
 * - Patches/inserts company_intel row with full overview, rounds, roadmap
 * - Deletes then re-inserts DSA topics correctly per company ID
 */

const { execSync } = require('child_process');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase env vars!');
  process.exit(1);
}

const BASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function req(endpoint, method = 'GET', body = null) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const opts = { method, headers: BASE_HEADERS };
  if (body) opts.body = JSON.stringify(body);
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, opts);
      const data = await res.json().catch(() => null);
      if (res.ok) return data;
      if (res.status === 409) return null; // conflict, skip
      if (attempt < 4) await sleep(500 * attempt);
    } catch {
      if (attempt < 4) await sleep(500 * attempt);
    }
  }
  return null;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  // 1. Load ALL existing companies into a name->id map
  console.log('Loading existing companies from Supabase...');
  const existing = await req('companies?select=id,name,slug&order=name.asc');
  if (!existing) { console.error('Failed to load companies!'); process.exit(1); }

  // Build lookup: lowercase name -> {id, slug}
  const nameMap = {};
  existing.forEach(c => {
    nameMap[c.name.toLowerCase().trim()] = { id: c.id, slug: c.slug };
  });
  console.log(`Loaded ${existing.length} existing companies.`);

  // 2. Parse research files
  console.log('Parsing research files with Python...');
  const jsonStr = execSync(
    '/Library/Frameworks/Python.framework/Versions/3.14/bin/python3 scripts/master_parse.py',
    { maxBuffer: 80 * 1024 * 1024 }
  ).toString().trim();
  const parsed = JSON.parse(jsonStr);
  console.log(`Parsed ${parsed.length} companies from research files.`);

  let updated = 0, inserted = 0, skipped = 0;

  for (const comp of parsed) {
    const nameKey = comp.name.toLowerCase().trim();
    let existingRow = nameMap[nameKey];

    // Level 2: strip parentheticals from research name
    if (!existingRow) {
      const simpleName = comp.name.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
      existingRow = nameMap[simpleName];
    }

    // Level 3: research name starts with a DB name (e.g. "Infosys Limited" → "Infosys")
    if (!existingRow) {
      for (const [dbName, row] of Object.entries(nameMap)) {
        if (nameKey.startsWith(dbName) && dbName.length >= 4) {
          existingRow = row;
          break;
        }
      }
    }

    // Level 4: DB name starts with research name (e.g. "Applied Materials" matches "Applied Materials India")
    if (!existingRow) {
      for (const [dbName, row] of Object.entries(nameMap)) {
        if (dbName.startsWith(nameKey) && nameKey.length >= 4) {
          existingRow = row;
          break;
        }
      }
    }

    // Level 5: first two significant words match (handles "Accenture Solutions" → "Accenture")
    if (!existingRow) {
      const researchWords = nameKey.split(/\s+/).filter(w => w.length > 3).slice(0, 2);
      if (researchWords.length >= 1) {
        const firstWord = researchWords[0];
        const matches = Object.entries(nameMap).filter(([dbName]) =>
          dbName.split(/\s+/)[0] === firstWord
        );
        if (matches.length === 1) {
          existingRow = matches[0][1];
        }
      }
    }

    let cId;

    if (existingRow) {
      // PATCH existing company - keep its original slug
      cId = existingRow.id;
      await req(`companies?id=eq.${cId}`, 'PATCH', {
        career_page_url: comp.career_page_url,
        metadata: comp.metadata,
      });
      updated++;
    } else {
      // INSERT new company
      const inserted_rows = await req('companies', 'POST', [{
        name: comp.name,
        slug: comp.fallback_slug,
        career_page_url: comp.career_page_url,
        metadata: comp.metadata,
      }]);
      if (inserted_rows && inserted_rows.length > 0) {
        cId = inserted_rows[0].id;
        nameMap[nameKey] = { id: cId, slug: comp.fallback_slug };
        inserted++;
      }
    }

    if (!cId) { skipped++; continue; }

    // PATCH or INSERT company_intel
    const intelRows = await req(`company_intel?company_id=eq.${cId}&select=id`);
    const intelPayload = {
      company_id: cId,
      overview: comp.overview,
      hiring_process: comp.hiring_process,
      required_skills: comp.required_skills,
      prep_roadmap: comp.prep_roadmap,
      source_urls: comp.source_urls,
    };

    if (intelRows && intelRows.length > 0) {
      await req(`company_intel?company_id=eq.${cId}`, 'PATCH', intelPayload);
    } else {
      await req('company_intel', 'POST', [intelPayload]);
    }

    // DSA topics - delete all for this company_id then re-insert
    await req(`company_dsa_topics?company_id=eq.${cId}`, 'DELETE');
    for (const t of comp.dsa_topics) {
      await req('company_dsa_topics', 'POST', [{
        company_id: cId,
        topic: t.topic,
        emphasis: t.emphasis,
      }]);
    }

    const total = updated + inserted;
    if (total % 30 === 0 || total === parsed.length) {
      console.log(`Progress: ${total}/${parsed.length} (updated=${updated}, inserted=${inserted}, skipped=${skipped})`);
    }
  }

  console.log(`\n✅ MASTER INGESTION COMPLETE!`);
  console.log(`   Updated:  ${updated} existing companies`);
  console.log(`   Inserted: ${inserted} new companies`);
  console.log(`   Skipped:  ${skipped} (no ID found)`);
}

run().catch(e => { console.error(e); process.exit(1); });

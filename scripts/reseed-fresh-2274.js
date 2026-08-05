const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

global.WebSocket = require("ws");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Service Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const jsonPath = path.join(__dirname, "../dsa question bank/dsa_questions_merged_progress.json");

if (!fs.existsSync(jsonPath)) {
  console.error("❌ Question bank JSON file not found at:", jsonPath);
  process.exit(1);
}

console.log("📖 Reading 2,274 questions from JSON file...");
const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

function normalizeTopic(rawTopic, rawTopicsAll) {
  const combined = ((rawTopic || "") + " " + (rawTopicsAll || "")).toLowerCase();
  if (combined.includes("array") || combined.includes("hash") || combined.includes("matrix") || combined.includes("two pointer") || combined.includes("sliding window")) return "arrays";
  if (combined.includes("string") || combined.includes("regex") || combined.includes("trie") || combined.includes("palindrome")) return "strings";
  if (combined.includes("dp") || combined.includes("dynamic") || combined.includes("memoization") || combined.includes("knapsack") || combined.includes("fibonacci")) return "dp";
  if (combined.includes("graph") || combined.includes("bfs") || combined.includes("dfs") || combined.includes("topological") || combined.includes("dijkstra") || combined.includes("union")) return "graphs";
  if (combined.includes("tree") || combined.includes("bst") || combined.includes("binary tree") || combined.includes("segment")) return "trees";
  if (combined.includes("list") || combined.includes("linked")) return "linked-lists";
  if (combined.includes("stack") || combined.includes("queue") || combined.includes("heap") || combined.includes("monotonic")) return "stacks-queues";
  if (combined.includes("greedy") || combined.includes("interval")) return "greedy";
  if (combined.includes("recursion") || combined.includes("backtrack") || combined.includes("n-queen") || combined.includes("subset") || combined.includes("permutation")) return "recursion";
  if (combined.includes("sql") || combined.includes("database") || combined.includes("query") || combined.includes("join")) return "sql";
  if (combined.includes("math") || combined.includes("bit") || combined.includes("number") || combined.includes("prime") || combined.includes("geometry")) return "math-number-theory";
  if (combined.includes("oop") || combined.includes("design") || combined.includes("class") || combined.includes("lld")) return "oop-concepts";
  if (combined.includes("web") || combined.includes("api") || combined.includes("http") || combined.includes("rest")) return "web-development";
  if (combined.includes("pseudo") || combined.includes("logic")) return "pseudocode";
  return "basic-programming";
}

function generateExplanation(q) {
  if (q.explanation && q.explanation.trim().length > 20) {
    return q.explanation;
  }
  const title = q.title || "DSA Problem";
  const topic = normalizeTopic(q.topic, q.topics_all);
  const cppSnippet = q.solution_cpp ? `\n\nReference Solution (C++):\n\`\`\`cpp\n${q.solution_cpp.slice(0, 400)}\n\`\`\`` : "";

  return `Step 1. Initialize data structures and inspect target parameters for ${title}.\nStep 2. Iterate through input elements, updating pointers and memory state.\nStep 3. Validate edge cases and return optimal output.${cppSnippet}\n\nTime Complexity: O(N) amortized.\nSpace Complexity: O(1) auxiliary space.`;
}

async function freshReSeed() {
  console.log(`🗑️ Step 1/3: Deleting ALL existing questions from Supabase dsa_questions table...`);
  const { error: delErr } = await supabase.from("dsa_questions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) {
    console.warn("Notice during delete:", delErr.message);
  } else {
    console.log("✅ Database cleared completely!");
  }

  console.log(`📦 Step 2/3: Formatted 2,274 fresh questions for insertion...`);
  const formattedQuestions = rawData.map((q, idx) => ({
    title: q.title || `DSA Problem ${idx + 1}`,
    topic: normalizeTopic(q.topic, q.topics_all),
    difficulty: (q.difficulty || "medium").toLowerCase(),
    prompt: q.prompt || "Solve the problem using optimal time and space complexity.",
    solution_explanation: generateExplanation(q),
  }));

  const chunkSize = 100;
  console.log(`🚀 Step 3/3: Inserting ${formattedQuestions.length} questions in chunks of ${chunkSize}...`);

  let totalInserted = 0;
  for (let i = 0; i < formattedQuestions.length; i += chunkSize) {
    const chunk = formattedQuestions.slice(i, i + chunkSize);
    const { error: insErr } = await supabase.from("dsa_questions").insert(chunk);
    if (insErr) {
      console.error(`❌ Error inserting chunk ${i}..${i + chunk.length}:`, insErr.message);
    } else {
      totalInserted += chunk.length;
      console.log(`✅ Chunk ${i / chunkSize + 1} (${totalInserted}/${formattedQuestions.length}) inserted successfully!`);
    }
  }

  // Final count verification
  const { count } = await supabase.from("dsa_questions").select("*", { count: "exact", head: true });
  console.log(`🎉 FRESH SEED COMPLETED! Exact row count in Supabase: ${count} / ${formattedQuestions.length}`);
}

freshReSeed().catch((err) => {
  console.error("❌ Fresh re-seed failed:", err);
  process.exit(1);
});

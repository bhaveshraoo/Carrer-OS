import fs from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), ".gemini", "roadmaps_store.json");

interface LocalStore {
  roadmaps: any[];
  tasks: any[];
  streaks: Record<string, any>;
  certificates: any[];
}

function ensureStoreExists(): LocalStore {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(STORE_PATH)) {
    const initial: LocalStore = { roadmaps: [], tasks: [], streaks: {}, certificates: [] };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }

  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    const initial: LocalStore = { roadmaps: [], tasks: [], streaks: {}, certificates: [] };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
}

export function saveLocalStore(store: LocalStore) {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export function getLocalRoadmaps(userId: string) {
  const store = ensureStoreExists();
  return store.roadmaps.filter((r) => r.user_id === userId);
}

export function getLocalRoadmap(roadmapId: string) {
  const store = ensureStoreExists();
  return store.roadmaps.find((r) => r.id === roadmapId) || null;
}

export function saveLocalRoadmap(roadmap: any, tasks: any[]) {
  const store = ensureStoreExists();
  // Remove existing if any
  store.roadmaps = store.roadmaps.filter((r) => r.id !== roadmap.id);
  store.tasks = store.tasks.filter((t) => t.roadmap_id !== roadmap.id);

  store.roadmaps.unshift(roadmap);
  store.tasks.push(...tasks);
  saveLocalStore(store);
}

export function updateLocalRoadmap(roadmapId: string, updates: any) {
  const store = ensureStoreExists();
  store.roadmaps = store.roadmaps.map((r) => (r.id === roadmapId ? { ...r, ...updates } : r));
  saveLocalStore(store);
}

export function deleteLocalRoadmap(roadmapId: string) {
  const store = ensureStoreExists();
  store.roadmaps = store.roadmaps.filter((r) => r.id !== roadmapId);
  store.tasks = store.tasks.filter((t) => t.roadmap_id !== roadmapId);
  store.certificates = store.certificates.filter((c) => c.roadmap_id !== roadmapId);
  saveLocalStore(store);
}

export function getLocalTasks(roadmapId: string) {
  const store = ensureStoreExists();
  return store.tasks.filter((t) => t.roadmap_id === roadmapId);
}

export function updateLocalTask(taskId: string, updates: any) {
  const store = ensureStoreExists();
  store.tasks = store.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
  saveLocalStore(store);
}

export function saveLocalTask(task: any) {
  const store = ensureStoreExists();
  store.tasks.push(task);
  saveLocalStore(store);
}

export function getLocalStreak(userId: string) {
  const store = ensureStoreExists();
  return store.streaks[userId] || { current_streak: 0, longest_streak: 0, last_active_date: null };
}

export function saveLocalStreak(userId: string, streak: any) {
  const store = ensureStoreExists();
  store.streaks[userId] = streak;
  saveLocalStore(store);
}

export function getLocalCertificate(roadmapId: string) {
  const store = ensureStoreExists();
  return store.certificates.find((c) => c.roadmap_id === roadmapId) || null;
}

export function saveLocalCertificate(cert: any) {
  const store = ensureStoreExists();
  store.certificates = store.certificates.filter((c) => c.roadmap_id !== cert.roadmap_id);
  store.certificates.push(cert);
  saveLocalStore(store);
}

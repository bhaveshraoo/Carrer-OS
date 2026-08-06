import type {
  InterviewSession,
  InterviewQuestion,
  InterviewMemory,
  InterviewReport,
} from "./schema";

// In-memory fallback store for offline/demo reliability
const SESSIONS_STORE = new Map<string, {
  session: InterviewSession;
  questions: InterviewQuestion[];
  answers: any[];
  memory: InterviewMemory;
  report?: InterviewReport;
}>();

export function saveLocalSession(data: {
  session: InterviewSession;
  questions: InterviewQuestion[];
  answers?: any[];
  memory: InterviewMemory;
  report?: InterviewReport;
}) {
  SESSIONS_STORE.set(data.session.id, {
    session: data.session,
    questions: data.questions,
    answers: data.answers || [],
    memory: data.memory,
    report: data.report,
  });
}

export function getLocalSession(sessionId: string) {
  return SESSIONS_STORE.get(sessionId);
}

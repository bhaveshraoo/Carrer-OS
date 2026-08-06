export type InterviewType =
  | "Online Assessment"
  | "Technical Round 1"
  | "Technical Round 2"
  | "System Design"
  | "HR Round"
  | "Group Discussion"
  | "Managerial Round";

export const INTERVIEW_TYPES: { type: InterviewType; description: string }[] = [
  { type: "Online Assessment", description: "Coding, aptitude, or domain-specific online screening test" },
  { type: "Technical Round 1", description: "Core DSA, problem-solving, and fundamentals interview" },
  { type: "Technical Round 2", description: "Advanced coding, system architecture, or project deep-dive" },
  { type: "System Design", description: "High-level/low-level system architecture and scalability discussion" },
  { type: "HR Round", description: "Culture fit, behavioral STAR questions, and CTC negotiations" },
  { type: "Group Discussion", description: "Team communication, topic debate, and group problem-solving" },
  { type: "Managerial Round", description: "Engineering manager chat, past impact, and scenario testing" },
];

export function getInterviewTypeBadgeStyle(type: string): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (type) {
    case "Online Assessment":
      return {
        label: "Online Assessment",
        bg: "bg-purple-500/10 dark:bg-purple-500/20",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-500/30",
      };
    case "Technical Round 1":
      return {
        label: "Tech Round 1",
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-500/30",
      };
    case "Technical Round 2":
      return {
        label: "Tech Round 2",
        bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
        text: "text-cyan-700 dark:text-cyan-300",
        border: "border-cyan-500/30",
      };
    case "System Design":
      return {
        label: "System Design",
        bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
        text: "text-indigo-700 dark:text-indigo-300",
        border: "border-indigo-500/30",
      };
    case "HR Round":
      return {
        label: "HR Round",
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-500/30",
      };
    case "Group Discussion":
      return {
        label: "Group Discussion",
        bg: "bg-rose-500/10 dark:bg-rose-500/20",
        text: "text-rose-700 dark:text-rose-300",
        border: "border-rose-500/30",
      };
    case "Managerial Round":
      return {
        label: "Managerial Round",
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-500/30",
      };
    default:
      return {
        label: type,
        bg: "bg-slate-500/10 dark:bg-slate-500/20",
        text: "text-slate-700 dark:text-slate-300",
        border: "border-slate-500/30",
      };
  }
}

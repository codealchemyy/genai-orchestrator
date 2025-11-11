import type { AgentFn } from "./types.js";

/** Minimal “Research Assistant for Students” (MVP). */
const studentResearcherAgent: AgentFn = async ({ prompt }) => {
  const topic = (prompt ?? "").trim() || "the topic";
  const shortSummary = `Short summary: ${topic} — core idea in one line.`;
  const studyBullets = [
    `1) Key concept: explain the main term for ${topic}.`,
    `2) Example: give a brief real-world example or analogy.`,
    `3) Quick task: suggest a 5–10 minute exercise to test understanding.`,
  ];
  const further = "Further reading: check your class notes or an introductory article (stub).";

  return {
    content: [shortSummary, "", "Study bullets:", ...studyBullets, "", further].join("\n"),
    meta: { role: "student-researcher", stub: true },
  };
};

export default studentResearcherAgent;

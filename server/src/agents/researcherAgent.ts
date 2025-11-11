// src/agents/researcherAgent.ts
import type { AgentFn } from "./types.js";
import { fetchWikiSummary } from "../tools/wiki.js";
import { llm } from "../llm.js";

export const researcherAgent: AgentFn = async ({ prompt }) => {
  const p = (prompt ?? "").trim();

  // --- NEW: LLM mode if prompt starts with "research+:" ---
  if (p.toLowerCase().startsWith("+:")) {
    const topic = p.replace(/^\+:\s*/i, "");
    const answer = await llm(`Explain '${topic}' in one short paragraph, clear and beginner-friendly.`);
    return {
      content: answer,
      meta: {
        role: "researcher",
        backend:
          (process.env.NODE_ENV ?? "").toLowerCase() === "development"
            ? "ollama"
            : "openai",
      },
    };
  }

  // --- Default: Use Wikipedia API (deterministic) ---
  const summary = await fetchWikiSummary(p);
  return {
    content: [
      "RESEARCH NOTES",
      `- Topic: ${p}`,
      "",
      "Summary:",
      summary,
      "",
      "(Source: Wikipedia API — validated via Zod)",
    ].join("\n"),
    meta: { role: "researcher", tool: "fetchWikiSummary" },
  };
};

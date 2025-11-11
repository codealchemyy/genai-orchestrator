// src/agents/researcherAgent.ts
import { AgentFn } from "./types.js";

/**
 * Minimal "Researcher" sub-agent.
 * MVP behavior: return stubbed research notes based on the prompt.
 * (We'll replace the stub with a real model/tool call later.)
 */
export const researcherAgent: AgentFn = async ({ prompt }) => {
  return {
    content: [
      "RESEARCH NOTES",
      `- Topic: ${prompt}`,
      "- Findings: (stub for now)",
      "- Sources: (stub for now)"
    ].join("\n"),
    meta: { role: "researcher", stub: true }
  };
};

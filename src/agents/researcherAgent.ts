// src/agents/researcherAgent.ts
import { AgentFn } from "./types.js";
import { fetchWikiSummary } from "../tools/wiki.js";


/**
 * Minimal "Researcher" sub-agent.
 * MVP behavior: return stubbed research notes based on the prompt.
 * (We'll replace the stub with a real model/tool call later.)
 */
export const researcherAgent: AgentFn = async ({ prompt }) => {
    const summary = await fetchWikiSummary(prompt);

  return {
    content: [
      "RESEARCH NOTES",
      `- Topic: ${prompt}`,
      "",
      "Summary:",
      summary,
      "",
      "(Source: Wikipedia API — validated via Zod)",
    ].join("\n"),
    meta: { role: "researcher", tool: "fetchWikiSummary" }
  };
};

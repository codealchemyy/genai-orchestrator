// src/agents/factCheckerAgent.ts
import type { AgentFn } from "./types.js";

/**
 * Minimal "Fact-Checker" sub-agent (stub).
 * MVP: we don't call external APIs yet; we just return a placeholder.
 * We'll wire real tools in FR011.
 */
export const factCheckerAgent: AgentFn = async ({ prompt }) => {
  return {
    content: `FACT-CHECK:\n- Claim: ${prompt}\n- Verdict: (stub)\n- Evidence: (stub)`,
    meta: { role: "factChecker", stub: true },
  };
};

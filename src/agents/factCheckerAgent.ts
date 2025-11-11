// src/agents/factCheckerAgent.ts
import type { AgentFn } from "./types.js";
import { defineTerm } from "../tools/dictionary.js";

/**
 * "Fact-Checker" sub-agent (MVP).
 * Uses dictionary tool when checking a concept.
 */
export const factCheckerAgent: AgentFn = async ({ prompt }) => {
  const term = (prompt ?? "").trim().toLowerCase();
  if (!term) {
    return {
      content: "FACT-CHECK:\n(empty term)",
      meta: { role: "factChecker", backend: "tool/dictionary" },
    };
  }

  const definition = await defineTerm(term); // <-- returns a STRING

  if (definition && definition !== "No definition found (stub).") {
    return {
      content: `FACT-CHECK: TERM\n- Term: ${term}\n- Explanation: ${definition}`,
      meta: { role: "factChecker", backend: "tool/dictionary" },
    };
  }

  // Fallback stub
  return {
    content: `FACT-CHECK:\n- Claim: ${prompt}\n- Verdict: (stub)\n- Evidence: (stub)`,
    meta: { role: "factChecker", backend: "tool/dictionary", stub: true },
  };
};

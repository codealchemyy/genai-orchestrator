// src/agents/factCheckerAgent.ts
import type { AgentFn } from "./types.js";
import { defineTerm } from "../tools/dictionary.js";

/**
 * "Fact-Checker" sub-agent (MVP).
 * Now uses dictionary tool when checking a concept.
 */
export const factCheckerAgent: AgentFn = async ({ prompt }) => {
  const term = prompt.trim().toLowerCase();

  // If the phrase is one known in the dictionary tool → show explanation instead of just stub
  const definition = await defineTerm(term);

  if (definition && definition.definition !== "No definition found (stub).") {
    return {
      content: `FACT-CHECK: TERM\n- Term: ${term}\n- Explanation: ${definition.definition}`,
      meta: { role: "factChecker", tool: "dictionary-lookup" },
    };
  }

  // Otherwise → fallback stub (unchanged)
  return {
    content: `FACT-CHECK:\n- Claim: ${prompt}\n- Verdict: (stub)\n- Evidence: (stub)`,
    meta: { role: "factChecker", stub: true },
  };
};

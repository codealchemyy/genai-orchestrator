// src/agents/orchestrator.ts
import { echoAgent } from "./echoAgent.js";
import { researcherAgent } from "./researcherAgent.js";
import { summariserAgent } from "./summariserAgent.js";
import { factCheckerAgent } from "./factCheckerAgent.js";   // <-- add this
import type { AgentFn, AgentInput, AgentOutput } from "./types.js";
import studentResearcherAgent from "./studentResearcherAgent.js"; // default import

/**
 * Minimal orchestrator router (prefix-based):
 * - "research: ..."   -> researcherAgent
 * - "summarise: ..."  -> summariserAgent
 * - "fact: ..."       -> factCheckerAgent
 * - otherwise         -> echoAgent
 */
export const orchestrate: AgentFn = async (input: AgentInput): Promise<AgentOutput> => {
  const p = input.prompt.trim();

  if (p.toLowerCase().startsWith("research+:")) {
    const result = await researcherAgent({ prompt: p.replace(/^research\+:\s*/i, "+: ") });
    return { content: result.content, meta: { used: "researcherAgent", ...(result.meta ?? {}) } };
  }

  if (p.toLowerCase().startsWith("summarise:")) {
    const s = await summariserAgent({ prompt: p.replace(/^summarise:\s*/i, "") });
    return { content: s.content, meta: { used: "summariserAgent", ...(s.meta ?? {}) } };
  }


  // NEW ROUTE ↓
  if (p.toLowerCase().startsWith("fact:")) {
    const stu = await factCheckerAgent({ prompt: p.replace(/^fact:\s*/i, "") });
    return { content: stu.content, meta: { used: "factCheckerAgent", ...(stu.meta ?? {}) } };
  }

  if (p.toLowerCase().startsWith("student:")) {
  const q = p.replace(/^student:\s*/i, "");
  const result = await studentResearcherAgent({ prompt: q });
  return { content: result.content, meta: { used: "studentResearcherAgent" } };
}


  const e = await echoAgent({ prompt: p });
  return { content: e.content, meta: { used: "echoAgent", ...(e.meta ?? {}) } };
};

// src/agents/orchestrator.ts
import { echoAgent } from "./echoAgent.js";
import { researcherAgent } from "./researcherAgent.js";
import { summariserAgent } from "./summariserAgent.js";
import type { AgentFn, AgentInput, AgentOutput } from "./types.js";

/**
 * Minimal orchestrator router (prefix-based):
 * - "research: ..."   -> researcherAgent
 * - "summarise: ..."  -> summariserAgent
 * - otherwise         -> echoAgent
 */
export const orchestrate: AgentFn = async (input: AgentInput): Promise<AgentOutput> => {
  const p = input.prompt.trim();

  if (p.toLowerCase().startsWith("research:")) {
    const result = await researcherAgent({ prompt: p.replace(/^research:\s*/i, "") });
    return { content: result.content, meta: { used: "researcherAgent" } };
  }

  if (p.toLowerCase().startsWith("summarise:")) {
    const result = await summariserAgent({ prompt: p.replace(/^summarise:\s*/i, "") });
    return { content: result.content, meta: { used: "summariserAgent" } };
  }

  const result = await echoAgent({ prompt: p });
  return { content: result.content, meta: { used: "echoAgent" } };
};

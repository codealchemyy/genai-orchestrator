// src/agents/orchestrator.ts
import { echoAgent } from "./echoAgent.js";
import type { AgentFn, AgentInput, AgentOutput } from "./types.js";

/**
 * Minimal orchestrator:
 * - receives the user prompt
 * - routes to one sub-agent (echoAgent)
 * - later we’ll add researcher/summariser/fact-checker + routing (FR010)
 */
export const orchestrate: AgentFn = async (input: AgentInput): Promise<AgentOutput> => {
  const result = await echoAgent(input);
  return { content: result.content, meta: { used: "echoAgent" } };
};

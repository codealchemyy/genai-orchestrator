// src/agents/orchestrator.ts
import { echoAgent } from "./echoAgent.js";
import { researcherAgent } from "./researcherAgent.js";
import { summariserAgent } from "./summariserAgent.js";
import { factCheckerAgent } from "./factCheckerAgent.js";
import studentResearcherAgent from "./studentResearcherAgent.js";
import type { AgentFn, AgentInput, AgentOutput } from "./types.js";
import { ACADEMY_NAME } from "../academy.js";

export const orchestrate: AgentFn = async (input: AgentInput): Promise<AgentOutput> => {
  const p = input.prompt.trim();

  if (p.toLowerCase().startsWith("research:")) {
    const result = await researcherAgent({ prompt: p.replace(/^research:\s*/i, "") });
    return { content: result.content, meta: { used: "researcherAgent", academy: ACADEMY_NAME } };
  }

  if (p.toLowerCase().startsWith("summarise:")) {
    const result = await summariserAgent({ prompt: p.replace(/^summarise:\s*/i, "") });
    return { content: result.content, meta: { used: "summariserAgent", academy: ACADEMY_NAME } };
  }

  if (p.toLowerCase().startsWith("fact:")) {
    const result = await factCheckerAgent({ prompt: p.replace(/^fact:\s*/i, "") });
    return { content: result.content, meta: { used: "factCheckerAgent", academy: ACADEMY_NAME } };
  }

  if (p.toLowerCase().startsWith("student:")) {
    const q = p.replace(/^student:\s*/i, "");
    const result = await studentResearcherAgent({ prompt: q });
    return { content: result.content, meta: { used: "studentResearcherAgent", academy: ACADEMY_NAME } };
  }

  const result = await echoAgent({ prompt: p });
  return { content: result.content, meta: { used: "echoAgent", academy: ACADEMY_NAME } };
};

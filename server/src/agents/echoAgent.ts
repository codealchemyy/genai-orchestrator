// src/agents/echoAgent.ts
import { AgentFn } from "./types.js";

/* Fallback —
just repeats your prompt (for testing). */

export const echoAgent: AgentFn = async ({ prompt }) => {
  return { content: `ECHO: ${prompt}` };
};

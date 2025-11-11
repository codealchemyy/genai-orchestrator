// src/agents/echoAgent.ts
import { AgentFn } from "./types.js";

export const echoAgent: AgentFn = async ({ prompt }) => {
  // MVP: no external calls, just echo back
  return { content: `ECHO: ${prompt}` };
};

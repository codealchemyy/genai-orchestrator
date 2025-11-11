import type { AgentFn } from "./types.js";

/**
 * Minimal "Summariser" sub-agent.
 * MVP: returns a very short summary by truncation.
 */
export const summariserAgent: AgentFn = async ({ prompt }) => {
  const max = 180; // tiny summary
  const short = prompt.length > max ? prompt.slice(0, max) + "…" : prompt;
  return {
    content: `SUMMARY:\n${short}`,
    meta: { role: "summariser", stub: true },
  };
};

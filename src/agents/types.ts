// src/agents/types.ts
export type AgentInput = { prompt: string };
export type AgentOutput = { content: string; meta?: Record<string, unknown> };
export type AgentFn = (input: AgentInput) => Promise<AgentOutput>;

// src/agents/summariserAgent.ts
import type { AgentFn } from "./types.js";
import { llm } from "../llm.js";

export const summariserAgent: AgentFn = async ({ prompt }) => {
  // defensive: always coerce to a safe string
  const p = (prompt ?? "").toString().trim();
  if (!p) {
    return {
      content: "SUMMARY:\n(empty prompt)",
      meta: { role: "summariser", backend: "none" },
    };
  }

  // short, deterministic instruction for the model
  const instruction = `Summarise in ONE short sentence (<= 20 words), plain text, no bullets:\n\n${p}`;
  const text = (await llm(instruction)).trim();

  return {
    content: `SUMMARY:\n${text || "(no output)"}`,
    meta: {
      role: "summariser",
      // helps you verify whether Ollama (dev) or OpenAI (prod) was used
      backend:
        (process.env.NODE_ENV ?? "").toLowerCase() === "development"
          ? "ollama"
          : "openai",
    },
  };
};

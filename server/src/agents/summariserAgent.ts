// src/agents/summariserAgent.ts
import type { AgentFn } from "./types.js";
import { llm } from "../llm.js";

/* Summarizes text
(e.g. “summarize: ...”).
Calls the LLM. */


export const summariserAgent: AgentFn = async ({ prompt }) => {
  // defensive: always coerce to a safe string
  const p = (prompt ?? "").toString().trim();
  if (!p) {
    return {
      content: "SUMMARY:\n(empty prompt)",
      meta: { role: "summariser", backend: "none" },
    };
  }
  console.log(`[summariserAgent] received prompt="${p.slice(0,120)}"`);

  // short, deterministic instruction for the model
  const instruction = `Summarise in ONE short sentence (<= 20 words), plain text, no bullets:\n\n${p}`;
  console.log("[summariserAgent] calling llm...");

  const text = (await llm(instruction)).trim();
  console.log(`[summariserAgent] llm returned preview="${text.slice(0,120)}"`);


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

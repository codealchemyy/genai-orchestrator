// src/agents/echoAgent.ts
import { OpenAI } from "openai";
import { AgentFn } from "./types.js";  // NOTE: .js extension for NodeNext

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const echoAgent: AgentFn = async ({ prompt }) => {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  // minimal model call via Responses API (FR008)
  const res = await client.responses.create({
    model,
    input: `Echo this back to the user verbatim: ${prompt}`,
  });

  // SDK attaches helpers at runtime:
  // @ts-ignore
  const text: string = (res as any).output_text ?? "No output";
  return { content: `ECHO: ${text}` };
};

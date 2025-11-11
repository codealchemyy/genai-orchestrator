// src/llm.ts
import { OpenAI } from "openai";

const OLLAMA_BASE = process.env.OLLAMA_BASE ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.1:8b";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return (data?.response as string) ?? "";
}

async function callOpenAI(prompt: string): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const r = await client.responses.create({ model: OPENAI_MODEL, input: prompt });
  // SDK attaches a helper at runtime:
  // @ts-ignore
  return ((r as any).output_text ?? "") as string;
}

export async function llm(prompt: string): Promise<string> {
  const isDev = (process.env.NODE_ENV ?? "").toLowerCase() === "development";
  return isDev ? callOllama(prompt) : callOpenAI(prompt);
}

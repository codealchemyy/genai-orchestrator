// src/tools/wiki.ts
import { z } from "zod";

// Very small schema for the piece we care about
const WikiExtractSchema = z.object({
  extract: z.string().default(""),
});

export async function fetchWikiSummary(topic: string): Promise<string> {
  const title = encodeURIComponent(topic.trim());
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

  const res = await fetch(url, { headers: { "accept": "application/json" } });
  if (!res.ok) return `No summary found for "${topic}".`;

  const data = await res.json().catch(() => ({}));
  const parsed = WikiExtractSchema.safeParse(data);
  if (!parsed.success) return `No summary found for "${topic}".`;

  const text = parsed.data.extract.trim();
  return text ? text : `No summary found for "${topic}".`;
}

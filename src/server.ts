// src/server.ts
import express, { Request, Response } from "express";
import { z } from "zod";
import "dotenv/config";
import { orchestrate } from "./agents/orchestrator.js"; // NOTE .js
import swaggerRouter from "./swagger.js";


const app = express();
app.use(express.json());
app.use("/docs", swaggerRouter);


// ---- Zod schema (FR005)
const AgentRequestSchema = z.object({
  prompt: z.string().trim().min(1, "prompt must not be empty").max(2000, "prompt is too long"),
});
type AgentRequest = z.infer<typeof AgentRequestSchema>;

// ---- tiny guardrail (FR007)
const BLOCKLIST = [
  /password/i,
  /api[\s_-]?key/i,
  /token/i,
  /credit\s*card/i,
  /\bssn\b/i,
  /\bkill\b/i,
  /\b(?:fuck|shit|bitch)\b/i,
];

function violatesGuardrail(input: string): string | null {
  for (const rule of BLOCKLIST) if (rule.test(input)) return `Blocked by guardrail: matched ${rule}`;
  return null;
}

// health
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// ---- FR006 + FR009 (calls orchestrator) ----
app.post("/agent", async (req: Request, res: Response) => {
  const parsed = AgentRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }
  const { prompt } = parsed.data as AgentRequest;

  const guardIssue = violatesGuardrail(prompt);
  if (guardIssue) return res.status(400).json({ success: false, error: guardIssue });

  try {
    const result = await orchestrate({ prompt });
    return res.status(200).json({
      success: true,
      echo: prompt,
      answer: result.content,
      meta: result.meta ?? {},
    });
  } catch (err: any) {
    const detail =
        (process.env.NODE_ENV ?? "").toLowerCase() === "development"
        ? (err?.stack || err?.message || String(err))
        : undefined;

    console.error("Agent error:", detail ?? err);
    return res.status(500).json({
        success: false,
        error: "Agent call failed",
        detail, // only present in dev
    });
    }

});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

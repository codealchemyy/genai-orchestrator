import express from "express";
import { z } from "zod"
import { Request, Response} from "express"
import 'dotenv/config';

const app = express();
app.use(express.json());

const AgentRequestSchema = z.object({
    prompt: z
    .string()
    .trim()
    .min(1, "prompt must not be empty")
    .max(2000, "prompt is too long"),
});

type AgentRequest = z.infer<typeof AgentRequestSchema>;

// --- tiny guardrail (FR007) ---
const BLOCKLIST = [
  /password/i,
  /api[\s_-]?key/i,        // now matches "apikey", "api_key", "api-key", "api key"
  /token/i,
  /credit\s*card/i,
  /\bssn\b/i,
  /\bkill\b/i,              // simple violence keyword
  /\b(?:fuck|shit|bitch)\b/i, // fix word boundaries for profanity
];


function violatesGuardrail(input: string): string | null {
  for (const rule of BLOCKLIST) {
    if (rule.test(input)) return `Blocked by guardrail: matched ${rule}`;
  }
  return null;
}


// tiny health check
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
});

app.post("/agent", (req: Request, res: Response) => {
    const parsed = AgentRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        });
    }
    const { prompt } = parsed.data as AgentRequest;

    // Guardrail check
    const guardIssue = violatesGuardrail(prompt);
    if (guardIssue) {
        return res.status(400).json({
        success: false,
        error: guardIssue,
        });
    }
    
    // Minimal stub response — real orchestration comes later
    return res.status(200).json({
        success: true,
        echo: prompt,
        answer: "👋 Agent stub here: real AI will be added in the next steps.",
    });
});



const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

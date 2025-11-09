import { OpenAI } from "openai"
import express from "express";
import { z } from "zod"
import { Request, Response} from "express"
import 'dotenv/config';

const app = express();
app.use(express.json());

// --- OpenAI client (minimal) ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


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


// --- FR008: call a model (minimal) ---
app.post("/agent", async (req: Request, res: Response) => {
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

    try {
        // Minimal model call (Responses API)
        const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
        const result = await openai.responses.create({ model, input: prompt });

        // Safe minimal text extraction
        // @ts-ignore - SDK attaches helper getters at runtime
        const output = (result as any).output_text ?? "No output";

        
        // Minimal stub response — real orchestration comes later
        return res.status(200).json({
            success: true,
            model,
            echo: prompt,
            answer: "👋 Agent stub here: real AI will be added in the next steps.",
        });
    } catch (err: any) {
    console.error("OpenAI error:", err?.message || err);
    return res.status(500).json({ success: false, error: "Agent call failed" });
  }
});



const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});



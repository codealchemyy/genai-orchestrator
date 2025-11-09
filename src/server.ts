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

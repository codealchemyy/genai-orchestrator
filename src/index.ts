import express from "express";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const app = express();
app.use(express.json());

// healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// minimal Zod schema for FR005
const AgentRequest = z.object({
  prompt: z.string().min(1, "prompt cannot be empty"),
});

// FR006 stub: accepts { prompt } and echoes for now
app.post("/agent", (req, res) => {
  const parsed = AgentRequest.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid body",
      issues: parsed.error.flatten(),
    });
  }
  return res.json({
    echo: parsed.data.prompt,
    note: "Orchestrator will be implemented in a later step.",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

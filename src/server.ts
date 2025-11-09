import express from "express";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

// tiny health check
app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true, service: "genai-orchestrator" });
});

// root (optional)
app.get("/", (_req, res) => {
  res.status(200).send("Server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

# AI Agents Orchestrator

Minimal Express + TypeScript agent service.


<!-- ## UML Diagram

The full agent orchestration diagram is located here:

- [`docs/uml.md`](docs/uml.md)

This diagram illustrates:
- The /agent request flow
- How the orchestrator selects a sub-agent
- Where tools and the local model integrate -->

---

## 🧠 Features (MVP)

- Single `/agent` endpoint
- Zod request validation
- Guardrails (regex-based)
- Orchestrator that routes prompts to sub-agents
- 4 Sub-agents:
  - `researcherAgent` (uses Wikipedia API)
  - `summariserAgent` (uses local LLM via Ollama in dev)
  - `factCheckerAgent` (uses dictionary tool)
  - `studentResearcherAgent` (study guidance + term definitions)
- Local → OpenAI model switch (`llm()` helper)
- UML Sequence Diagram included (see below)

---

## UML Diagram

The orchestrator workflow is documented here:

➡️ **[UML Sequence Diagram](docs/uml.md)**

(If viewing on GitHub, the diagram will render automatically.)


---

## 🧪 How to Run Locally

```bash
git clone <git@github.com:codealchemyy/genai-orchestrator.git>
cd genai-orchestrator
npm install

## API Documentation

This project includes live interactive docs:

- Swagger UI: http://localhost:4000/docs  
- Health Check: http://localhost:4000/health

To test the main endpoint:

```bash
curl -X POST http://localhost:4000/agent \
  -H "Content-Type: application/json" \
  -d '{"prompt": "summarise: Neural networks are inspired by the brain."}'


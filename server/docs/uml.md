# Agent Orchestrator – Sequence (MVP)

```mermaid
sequenceDiagram
  participant C as Client (curl)
  participant API as Express /agent
  participant ORCH as Orchestrator
  participant E as echoAgent
  participant R as researcherAgent
  participant S as summariserAgent
  participant F as factCheckerAgent
  participant SR as studentResearcherAgent
  participant W as wiki tool
  participant D as dictionary tool
  participant LLM as LLM (Ollama/OpenAI)

  C->>API: POST /agent { prompt }
  API->>ORCH: orchestrate(prompt)

  alt research:
    ORCH->>R: researcherAgent(topic)
    R->>W: fetchWikiSummary(topic)
    W-->>R: summary
    R-->>ORCH: content
  else summarise:
    ORCH->>S: summariserAgent(text)
    S->>LLM: llm(instruction)
    LLM-->>S: summary
    S-->>ORCH: content
  else fact:
    ORCH->>F: factCheckerAgent(term)
    F->>D: defineTerm(term)
    D-->>F: definition
    F-->>ORCH: content
  else student:
    ORCH->>SR: studentResearcherAgent(prompt)
    SR-->>ORCH: content
  else default:
    ORCH->>E: echoAgent(prompt)
    E-->>ORCH: content
  end

  ORCH-->>API: final answer
  API-->>C: JSON response

// src/swagger.ts
import { Router } from "express";
import swaggerUi from "swagger-ui-express";

/* Enables Swagger UI documentation. */

const router = Router();

// ultra-minimal OpenAPI spec for our two routes
const spec = {
  openapi: "3.0.0",
  info: { title: "GenAI Orchestrator API", version: "1.0.0" },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: { "200": { description: "OK" } },
      },
    },
    "/agent": {
      post: {
        summary: "Run orchestrator",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["prompt"],
                properties: { prompt: { type: "string" } },
              },
              examples: {
                summarise: { value: { prompt: "summarise: Hello world paragraph..." } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Orchestrated response (success or stub)" },
          "400": { description: "Validation/guardrail error" },
          "500": { description: "Agent error" }
        },
      },
    },
  },
};

router.use("/", swaggerUi.serve, swaggerUi.setup(spec));

export default router;

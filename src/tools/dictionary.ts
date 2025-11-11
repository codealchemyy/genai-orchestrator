// src/tools/dictionary.ts
import { z } from "zod";

// Tiny schema for a definition result
const DefinitionSchema = z.object({
  term: z.string(),
  definition: z.string(),
});

/**
 * Minimal dictionary lookup (MVP).
 * No API calls yet — just a tiny internal lookup table.
 * We'll expand to real API later if desired.
 */
export async function defineTerm(term: string): Promise<string> {
  const lookup: Record<string, string> = {
    "neural network": "A computational model inspired by the human brain, used for pattern recognition and learning.",
    "gradient descent": "An optimization algorithm that adjusts parameters to reduce error.",
    "overfitting": "When a model memorizes training data instead of learning general patterns.",
  };

  const definition = lookup[term.toLowerCase()];
  const parsed = DefinitionSchema.safeParse({
    term,
    definition: definition ?? "No definition found (stub).",
  });

  return parsed.data.definition;
}

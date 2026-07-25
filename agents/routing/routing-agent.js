/**
 * Routing Agent Pattern — Vercel AI SDK (JS)
 *
 * Classify a user query into a category using `generateObject` (structured
 * output via Zod), then route it to a specialised sub-agent that generates
 * a response with `generateText`.
 *
 * SDK: Vercel AI SDK (`ai`, `@ai-sdk/openai`, `zod`)
 *   - generateObject → structured classification
 *   - generateText  → specialist response generation
 */

import { generateText, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const classificationSchema = z.object({
  type: z
    .enum(["technical", "billing", "general", "complaint"])
    .describe("Category of the customer query"),
  urgency: z
    .enum(["low", "medium", "high"])
    .describe("How urgent the issue is"),
  reasoning: z
    .string()
    .describe("Short explanation for the classification"),
});

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

async function classifyQuery(query) {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: classificationSchema,
    prompt: `Classify the following customer support query. Determine its type
(technical, billing, general, or complaint), its urgency level, and provide
a short reasoning.

Query: "${query}"`,
  });
  return object;
}

// ---------------------------------------------------------------------------
// Specialist agents (one per category)
// ---------------------------------------------------------------------------

const specialists = {
  technical: {
    system: `You are a technical support specialist. Provide clear,
step-by-step troubleshooting instructions. Be concise and helpful.`,
  },
  billing: {
    system: `You are a billing specialist. Address payment and subscription
issues professionally. Explain charges and refund policies clearly.`,
  },
  complaint: {
    system: `You are a customer relations specialist. Acknowledge the
customer's frustration, apologise, and offer concrete next steps.`,
  },
  general: {
    system: `You are a friendly customer service agent. Answer general
questions about products, services, and policies accurately.`,
  },
};

async function generateSpecialistResponse(query, classification) {
  const spec = specialists[classification.type] ?? specialists.general;

  const systemExtra =
    classification.urgency === "high"
      ? " This is HIGH PRIORITY — give the most direct solution."
      : "";

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: spec.system + systemExtra,
    prompt: query,
  });

  return text;
}

// ---------------------------------------------------------------------------
// Main entry-point
// ---------------------------------------------------------------------------

export async function routeCustomerQuery(query) {
  const classification = await classifyQuery(query);
  const response = await generateSpecialistResponse(query, classification);
  return { classification, response };
}

// ---------------------------------------------------------------------------
// Example usage
// ---------------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("=== Vercel AI SDK (JS): Routing Agent ===");

  const queries = [
    "I can't log into my account — the password reset isn't working.",
    "I was charged twice this month. I need a refund.",
    "What are your weekend store hours?",
    "This is the third time I've contacted you. Your service is terrible!",
  ];

  for (const query of queries) {
    console.log(`\n--- QUERY: ${query}`);
    const result = await routeCustomerQuery(query);
    console.log("Classification:", JSON.stringify(result.classification));
    console.log("Response:", result.response);
  }
}

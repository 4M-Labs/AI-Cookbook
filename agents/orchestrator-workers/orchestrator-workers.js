/**
 * Orchestrator-Workers Pattern — Vercel AI SDK (JS)
 *
 *   1. Orchestrator uses `generateObject` to plan which workers to call and
 *      what each one should do.
 *   2. Workers execute in parallel via `Promise.all` + `generateText`.
 *   3. A synthesizer merges all worker outputs with a final `generateText`.
 *
 * SDK: Vercel AI SDK (`ai`, `@ai-sdk/openai`, `zod`)
 *   - generateObject → orchestration plan (structured)
 *   - generateText  × N → workers (parallel)
 *   - generateText  × 1 → synthesis
 */

import { generateText, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Orchestration plan schema
// ---------------------------------------------------------------------------

const planSchema = z.object({
  workers: z
    .array(
      z.object({
        id: z.string().describe("Unique worker identifier"),
        role: z
          .enum(["researcher", "analyst", "writer", "reviewer"])
          .describe("Worker role"),
        task: z.string().describe("Specific task description for this worker"),
      })
    )
    .min(1)
    .describe("List of workers to spin up"),
});

// ---------------------------------------------------------------------------
// Worker role prompts
// ---------------------------------------------------------------------------

const roleSystems = {
  researcher: `You are a researcher. Gather facts, data, and context relevant
to the task. Be thorough but concise.`,
  analyst: `You are an analyst. Evaluate the provided information, identify
patterns, strengths, weaknesses, and key insights.`,
  writer: `You are a writer. Produce clear, well-structured prose. Use headings
and bullet points where appropriate.`,
  reviewer: `You are a reviewer. Critically assess the quality of the provided
content. Point out errors, gaps, and areas for improvement.`,
};

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

async function orchestrate(goal) {
  const { object: plan } = await generateObject({
    model: openai("gpt-4o"),
    schema: planSchema,
    prompt: `You have access to workers with roles: researcher, analyst, writer,
reviewer. Plan which workers to spawn to achieve this goal. Each worker gets
one focused task.

Goal: "${goal}"`,
  });
  return plan;
}

// ---------------------------------------------------------------------------
// Workers (parallel)
// ---------------------------------------------------------------------------

async function runWorkers(workers) {
  const results = await Promise.all(
    workers.map(async (w) => {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: roleSystems[w.role] ?? "You are a helpful assistant.",
        prompt: w.task,
      });
      return { id: w.id, role: w.role, text };
    })
  );
  return results;
}

// ---------------------------------------------------------------------------
// Synthesizer
// ---------------------------------------------------------------------------

async function synthesize(goal, workerResults) {
  const formatted = workerResults
    .map((r) => `### Worker: ${r.id} (${r.role})\n${r.text}`)
    .join("\n\n");

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a synthesizer. Combine the outputs of multiple workers into
a single, coherent, and well-structured final deliverable.`,
    prompt: `Goal: ${goal}\n\nWorker outputs:\n${formatted}\n\nProduce the final deliverable.`,
  });
  return text;
}

// ---------------------------------------------------------------------------
// Main entry-point
// ---------------------------------------------------------------------------

export async function orchestratorWorkers(goal) {
  console.log("Orchestrating...");
  const plan = await orchestrate(goal);
  console.log(
    `Spawning ${plan.workers.length} workers:`,
    plan.workers.map((w) => `${w.id}(${w.role})`).join(", ")
  );

  const workerResults = await runWorkers(plan.workers);

  console.log("Synthesizing...");
  const final = await synthesize(goal, workerResults);

  return { plan, workerResults, final };
}

// ---------------------------------------------------------------------------
// Example usage
// ---------------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("=== Vercel AI SDK (JS): Orchestrator-Workers ===");

  const goal = `Write a brief competitive analysis of the three leading
project management tools (Jira, Asana, Linear) for a startup CTO.`;

  const result = await orchestratorWorkers(goal);

  for (const w of result.workerResults) {
    console.log(`\n--- ${w.id} (${w.role}) ---\n${w.text}`);
  }
  console.log("\n--- Final Deliverable ---\n", result.final);
}

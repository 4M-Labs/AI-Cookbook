/**
 * Evaluator-Optimizer Pattern — Vercel AI SDK (JS)
 *
 * Iterative generate → evaluate → refine loop.
 *   1. `generateText` produces a solution.
 *   2. `generateObject` (Zod schema) evaluates it — returns a numeric score
 *      and actionable feedback.
 *   3. `generateText` refines the solution using the feedback.
 * Repeat until the score passes or the max iteration count is reached.
 *
 * SDK: Vercel AI SDK (`ai`, `@ai-sdk/openai`, `zod`)
 *   - generateText  → generation / refinement
 *   - generateObject → evaluation (structured)
 */

import { generateText, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_ITERATIONS = 3;
const PASS_THRESHOLD = 8; // out of 10

// ---------------------------------------------------------------------------
// Evaluation schema
// ---------------------------------------------------------------------------

const evaluationSchema = z.object({
  score: z.number().min(0).max(10).describe("Quality score from 0 to 10"),
  feedback: z
    .string()
    .describe("Specific, actionable feedback for improvement"),
  passed: z.boolean().describe("True if the solution meets quality bar"),
});

// ---------------------------------------------------------------------------
// Generate / Refine
// ---------------------------------------------------------------------------

async function generateInitial(prompt) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a senior software engineer. Write clean, efficient, and
well-documented code. Follow best practices.`,
    prompt,
  });
  return text;
}

async function refine(prompt, previousSolution, feedback) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a senior software engineer. Improve the following code based
on the evaluator's feedback. Keep what is already good and fix the issues raised.`,
    prompt: `Original request: ${prompt}\n\nPrevious solution:\n${previousSolution}\n\nEvaluator feedback:\n${feedback}\n\nProvide an improved solution.`,
  });
  return text;
}

// ---------------------------------------------------------------------------
// Evaluate
// ---------------------------------------------------------------------------

async function evaluate(prompt, solution) {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: evaluationSchema,
    prompt: `Evaluate the following solution against the original request.

Original request: ${prompt}

Solution:
${solution}

Score from 0-10, provide actionable feedback, and indicate if it passes (>= ${PASS_THRESHOLD}).`,
  });
  return object;
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

export async function evaluatorOptimizer(prompt) {
  let solution = await generateInitial(prompt);
  let bestSolution = solution;

  for (let i = 1; i <= MAX_ITERATIONS; i++) {
    console.log(`Iteration ${i}/${MAX_ITERATIONS} — evaluating...`);
    const evaluation = await evaluate(prompt, solution);
    console.log(`  Score: ${evaluation.score}/10 | Passed: ${evaluation.passed}`);

    if (evaluation.passed) {
      console.log("Solution passed — stopping.");
      return { solution, iterations: i, evaluation };
    }

    bestSolution = solution;
    console.log("  Refining...");
    solution = await refine(prompt, solution, evaluation.feedback);
  }

  // Return the best we have
  const finalEval = await evaluate(prompt, solution);
  return { solution, iterations: MAX_ITERATIONS, evaluation: finalEval };
}

// ---------------------------------------------------------------------------
// Example usage
// ---------------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("=== Vercel AI SDK (JS): Evaluator-Optimizer ===");

  const prompt = `Write a JavaScript function called fibonacci that returns
an array of the first n Fibonacci numbers. Include JSDoc, handle edge cases,
and ensure O(n) time complexity.`;

  const result = await evaluatorOptimizer(prompt);
  console.log("\n--- Final Solution ---\n", result.solution);
  console.log("Iterations:", result.iterations);
  console.log("Final score:", result.evaluation.score);
}

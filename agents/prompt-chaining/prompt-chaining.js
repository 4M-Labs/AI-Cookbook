/**
 * Prompt Chaining Pattern — Vercel AI SDK (JS)
 *
 * Sequential three-step chain: Analyse → Plan → Solve.
 * Each step uses `generateText` with its own system prompt.  The output of
 * step N is interpolated into the prompt of step N+1.
 *
 * SDK: Vercel AI SDK (`ai`, `@ai-sdk/openai`)
 *   - generateText × 3, sequentially chained
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// ---------------------------------------------------------------------------
// Step 1 — Analyse
// ---------------------------------------------------------------------------

async function analyze(problem) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a mathematics analyst. Given a math problem, identify:
1. The problem type (algebra, geometry, calculus, probability, etc.)
2. Key concepts required to solve it
3. The recommended approach
4. Potential pitfalls

Respond concisely in plain text.`,
    prompt: problem,
  });
  return text;
}

// ---------------------------------------------------------------------------
// Step 2 — Plan
// ---------------------------------------------------------------------------

async function plan(problem, analysis) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a maths tutor creating a solution plan. Given a problem and
its analysis, produce a numbered step-by-step plan. Include any relevant
formulas. Be concrete and actionable.`,
    prompt: `Problem:\n${problem}\n\nAnalysis:\n${analysis}\n\nCreate a solution plan.`,
  });
  return text;
}

// ---------------------------------------------------------------------------
// Step 3 — Solve
// ---------------------------------------------------------------------------

async function solve(problem, analysis, solutionPlan) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are an expert mathematics tutor. Solve the problem step by step,
showing all work. Follow the provided plan. Explain each step clearly.`,
    prompt: `Problem:\n${problem}\n\nAnalysis:\n${analysis}\n\nPlan:\n${solutionPlan}\n\nNow solve the problem, showing all work.`,
  });
  return text;
}

// ---------------------------------------------------------------------------
// Main entry-point
// ---------------------------------------------------------------------------

export async function promptChain(problem) {
  console.log("Step 1/3 — Analysing...");
  const analysis = await analyze(problem);

  console.log("Step 2/3 — Planning...");
  const solutionPlan = await plan(problem, analysis);

  console.log("Step 3/3 — Solving...");
  const solution = await solve(problem, analysis, solutionPlan);

  return { analysis, plan: solutionPlan, solution };
}

// ---------------------------------------------------------------------------
// Example usage
// ---------------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("=== Vercel AI SDK (JS): Prompt Chaining ===");

  const problem = `A cylindrical water tank has a radius of 5 m and a height of
12 m. Water flows in at 3 cubic metres per minute. How long does it take to
fill the tank to 80% capacity?`;

  const result = await promptChain(problem);

  console.log("\n--- Analysis ---\n", result.analysis);
  console.log("\n--- Plan ---\n", result.plan);
  console.log("\n--- Solution ---\n", result.solution);
}

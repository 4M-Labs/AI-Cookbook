/**
 * Parallelization Pattern — Vercel AI SDK (JS)
 *
 * Fan-out / fan-in: spawn multiple `generateText` calls in parallel with
 * `Promise.all`, then synthesise all results into a single coherent output
 * with a final `generateText` call.
 *
 * SDK: Vercel AI SDK (`ai`, `@ai-sdk/openai`)
 *   - generateText × N in parallel (Promise.all)
 *   - generateText × 1 for synthesis
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// ---------------------------------------------------------------------------
// Sub-task definitions
// ---------------------------------------------------------------------------

const subtasks = [
  {
    id: "strengths",
    system: `You are a product analyst. Identify the top 5 strengths of the
product described below. Be specific and concise.`,
  },
  {
    id: "weaknesses",
    system: `You are a product analyst. Identify the top 5 weaknesses or risks
of the product described below. Be specific and concise.`,
  },
  {
    id: "opportunities",
    system: `You are a market strategist. Identify 5 market opportunities for
the product described below. Think creatively but stay grounded.`,
  },
  {
    id: "competition",
    system: `You are a competitive intelligence analyst. Describe the top 5
competitors or competitive threats for the product described below.`,
  },
];

// ---------------------------------------------------------------------------
// Fan-out — run all analyses in parallel
// ---------------------------------------------------------------------------

async function analyseInParallel(productDescription) {
  const results = await Promise.all(
    subtasks.map(async (task) => {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: task.system,
        prompt: productDescription,
      });
      return { id: task.id, text };
    })
  );
  return results;
}

// ---------------------------------------------------------------------------
// Fan-in — synthesise all results
// ---------------------------------------------------------------------------

async function synthesize(results, productDescription) {
  const formatted = results
    .map((r) => `### ${r.id}\n${r.text}`)
    .join("\n\n");

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a senior strategist. Synthesise the following analyses into
a concise executive summary. Highlight the most important findings across all
dimensions and provide 3 actionable recommendations.`,
    prompt: `Product: ${productDescription}\n\nAnalyses:\n${formatted}`,
  });

  return text;
}

// ---------------------------------------------------------------------------
// Main entry-point
// ---------------------------------------------------------------------------

export async function parallelAnalysis(productDescription) {
  console.log("Fan-out: running 4 analyses in parallel...");
  const results = await analyseInParallel(productDescription);

  console.log("Fan-in: synthesising results...");
  const summary = await synthesize(results, productDescription);

  return { analyses: results, summary };
}

// ---------------------------------------------------------------------------
// Example usage
// ---------------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("=== Vercel AI SDK (JS): Parallelization ===");

  const product = `CloudNote — a collaborative note-taking app with real-time
editing, AI-powered summarisation, and end-to-end encryption. Free tier
with 1 GB storage; Pro at $8/mo.`;

  const result = await parallelAnalysis(product);

  for (const a of result.analyses) {
    console.log(`\n--- ${a.id} ---\n${a.text}`);
  }
  console.log("\n--- Summary ---\n", result.summary);
}

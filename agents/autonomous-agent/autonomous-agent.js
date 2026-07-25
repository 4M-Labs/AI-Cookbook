/**
 * Autonomous Agent (Observe → Think → Act) — Vercel AI SDK (JS)
 *
 * A simple agent loop with tools. Each iteration:
 *   1. Observe — gather the latest environment state.
 *   2. Think  — call `generateText` with tools; the model decides which tool
 *               to invoke (or finishes if it has enough information).
 *   3. Act    — execute the chosen tool and feed the result back.
 *
 * SDK: Vercel AI SDK (`ai`, `@ai-sdk/openai`, `zod`)
 *   - generateText with `tools` parameter
 *   - Tools defined with Zod schemas and `execute` functions
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

const tools = {
  search: {
    description: "Search the web for information on a given topic.",
    parameters: z.object({
      query: z.string().describe("The search query"),
    }),
    execute: async ({ query }) => {
      // Simulated search — in production call a real API
      const results = [
        `Result 1: Overview of "${query}" — key findings from recent studies.`,
        `Result 2: Expert opinions on "${query}" — pros and cons.`,
        `Result 3: Latest news about "${query}" — developments this quarter.`,
      ];
      return results.join("\n");
    },
  },

  calculate: {
    description: "Perform a mathematical calculation.",
    parameters: z.object({
      expression: z
        .string()
        .describe("Mathematical expression to evaluate, e.g. '2 + 2 * 3'"),
    }),
    execute: async ({ expression }) => {
      // Safe eval for demo purposes only
      const result = Function(`"use strict"; return (${expression})`)();
      return `${expression} = ${result}`;
    },
  },

  read_file: {
    description: "Read the contents of a file by name.",
    parameters: z.object({
      filename: z.string().describe("Name of the file to read"),
    }),
    execute: async ({ filename }) => {
      // Simulated file system
      const files = {
        "notes.txt": "Meeting notes: Discussed Q3 roadmap and hiring plan.",
        "data.csv": "id,name,score\n1,Alice,92\n2,Bob,87\n3,Carol,95",
        "config.json": '{"theme":"dark","language":"en"}',
      };
      return files[filename] ?? `Error: file "${filename}" not found.`;
    },
  },
};

// ---------------------------------------------------------------------------
// Agent loop
// ---------------------------------------------------------------------------

const MAX_STEPS = 5;
const SYSTEM_PROMPT = `You are an autonomous agent. You have access to tools
(search, calculate, read_file) to help you answer the user's request.

Think step by step. Use tools when you need information or want to perform a
calculation. When you have enough information, provide your final answer.

Keep going until you are confident you can give a complete answer.`;

export async function autonomousAgent(goal) {
  console.log(`Goal: ${goal}`);
  const history = [`User request: ${goal}`];

  for (let step = 1; step <= MAX_STEPS; step++) {
    console.log(`\nStep ${step}/${MAX_STEPS}`);

    const { text, toolResults } = await generateText({
      model: openai("gpt-4o"),
      system: SYSTEM_PROMPT,
      prompt:
        history.length === 0
          ? goal
          : `${goal}\n\nSo far you have:\n${history.join("\n")}\n\nWhat should you do next? If you have a final answer, state it clearly.`,
      tools,
      maxSteps: 2, // allow one tool call per loop iteration
    });

    if (toolResults && toolResults.length > 0) {
      for (const tr of toolResults) {
        const entry = `Tool call: ${tr.toolName}(${JSON.stringify(tr.args)}) → ${tr.result}`;
        console.log(`  ${entry}`);
        history.push(entry);
      }
    }

    // If the model produced a final answer (no tool calls), we're done
    if (!toolResults || toolResults.length === 0) {
      console.log("Agent finished.");
      return { answer: text, steps: step, history };
    }
  }

  console.log("Max steps reached.");
  return { answer: history[history.length - 1], steps: MAX_STEPS, history };
}

// ---------------------------------------------------------------------------
// Example usage
// ---------------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("=== Vercel AI SDK (JS): Autonomous Agent ===");

  const result = await autonomousAgent(
    "Read the file 'data.csv', calculate the average score, and tell me who has the highest score."
  );

  console.log("\n--- Final Answer ---\n", result.answer);
  console.log("Steps taken:", result.steps);
}

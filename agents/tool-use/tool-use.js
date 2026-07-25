/**
 * Tool Use Pattern
 * 
 * Agent with access to tools that it can call to perform actions.
 * Demonstrates how to define tools and handle tool calls.
 * SDK: Vercel AI SDK
 */

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const tools = {
  calculator: {
    description: 'Perform a mathematical calculation. Use this for any math operations.',
    parameters: z.object({
      expression: z.string().describe('A valid math expression, e.g. "2 + 2" or "5 * (3 + 1)"'),
    }),
    execute: async ({ expression }) => {
      try {
        // Safe math evaluation using Function constructor
        const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '');
        const result = new Function(`return (${sanitized})`)();
        return { expression, result, success: true };
      } catch (e) {
        return { expression, result: null, success: false, error: e.message };
      }
    },
  },
  search: {
    description: 'Search for information on a topic. Returns simulated search results.',
    parameters: z.object({
      query: z.string().describe('The search query'),
      numResults: z.number().optional().describe('Number of results to return (default 3)'),
    }),
    execute: async ({ query, numResults = 3 }) => {
      // Simulated search results
      const results = Array.from({ length: numResults }, (_, i) => ({
        title: `Result ${i + 1} for "${query}"`,
        snippet: `This is a simulated search result about ${query}. In production, this would call a real search API.`,
        url: `https://example.com/result-${i + 1}`,
      }));
      return { query, results, totalResults: numResults };
    },
  },
  readFile: {
    description: 'Read the contents of a file. Returns simulated file contents.',
    parameters: z.object({
      path: z.string().describe('The file path to read'),
    }),
    execute: async ({ path }) => {
      // Simulated file contents
      return {
        path,
        contents: `# Simulated file contents for ${path}\n\nThis is a placeholder. In production, this would read from the actual filesystem.`,
        size: 1024,
      };
    },
  },
};

export async function agentWithTools(prompt) {
  console.log(`\n=== Vercel AI SDK (JS): Tool Use Pattern ===`);
  console.log(`Prompt: ${prompt}\n`);

  const { text, toolCalls, toolResults } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt,
    tools,
    maxSteps: 5,
  });

  console.log(`Tool calls made: ${toolCalls.length}`);
  for (const call of toolCalls) {
    console.log(`  - ${call.toolName}(${JSON.stringify(call.args)})`);
  }

  return { text, toolCalls, toolResults };
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await agentWithTools(
    'Calculate the area of a circle with radius 5, then search for "circle geometry formulas"'
  );
  console.log('\n=== Final Response ===');
  console.log(result.text);
}

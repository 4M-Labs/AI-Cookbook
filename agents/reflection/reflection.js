/**
 * Reflection Pattern
 * 
 * Agent generates output, then critiques its own work, then improves it.
 * The cycle repeats until quality meets a threshold.
 * SDK: Vercel AI SDK
 */

import { generateText, generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const critiqueSchema = z.object({
  score: z.number().min(1).max(10).describe('Quality score from 1-10'),
  feedback: z.string().describe('Specific actionable feedback for improvement'),
  strengths: z.array(z.string()).describe('What works well'),
  weaknesses: z.array(z.string()).describe('What needs improvement'),
});

async function generate(prompt) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt,
    system: 'You are a helpful assistant. Generate high-quality, detailed responses.'
  });
  return text;
}

async function critique(output, prompt) {
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: critiqueSchema,
    prompt: `Original request: ${prompt}\n\nGenerated output:\n${output}\n\nCritique this output thoroughly.`,
    system: 'You are a constructive critic. Be specific and actionable.'
  });
  return object;
}

async function improve(output, critiqueResult, prompt) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Original request: ${prompt}\n\nPrevious output:\n${output}\n\nCritique (score: ${critiqueResult.score}/10):\n${critiqueResult.feedback}\n\nWeaknesses to address:\n${critiqueResult.weaknesses.map(w => `- ${w}`).join('\n')}\n\nGenerate an improved version addressing all the critique points.`,
    system: 'You are a helpful assistant. Generate improved responses based on detailed feedback.'
  });
  return text;
}

export async function reflectionLoop(prompt, { maxIterations = 3, minScore = 8 } = {}) {
  let output = await generate(prompt);
  console.log(`\n=== Vercel AI SDK (JS): Reflection Pattern ===`);
  console.log(`Prompt: ${prompt}\n`);

  for (let i = 0; i < maxIterations; i++) {
    console.log(`--- Iteration ${i + 1}/${maxIterations} ---`);
    const feedback = await critique(output, prompt);
    console.log(`Score: ${feedback.score}/10`);
    console.log(`Feedback: ${feedback.feedback.substring(0, 150)}...`);

    if (feedback.score >= minScore) {
      console.log(`\nQuality threshold met (${feedback.score}/${minScore}). Stopping early.`);
      break;
    }

    output = await improve(output, feedback, prompt);
    console.log(`Improved output length: ${output.length} chars\n`);
  }

  return output;
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await reflectionLoop('Write a haiku about coding', {
    maxIterations: 3,
    minScore: 8,
  });
  console.log('\n=== Final Output ===');
  console.log(result);
}

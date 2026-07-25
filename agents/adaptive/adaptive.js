/**
 * Adaptive Agent Pattern
 * 
 * Agent that first classifies query complexity, then routes to the
 * appropriate strategy: simple (direct), complex (multi-step), or creative (divergent).
 * SDK: Vercel AI SDK
 */

import { generateText, generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const classificationSchema = z.object({
  complexity: z.enum(['simple', 'complex', 'creative']).describe('The classification of the query'),
  reasoning: z.string().describe('Brief explanation of why this classification was chosen'),
  suggestedApproach: z.string().describe('Recommended approach for handling this query'),
});

async function classifyQuery(input) {
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: classificationSchema,
    prompt: `Classify this query by complexity and determine the best approach:\n\n${input}`,
    system: 'You are a query classifier. Analyze the input and determine its complexity level:\n- simple: factual questions, quick lookups, straightforward requests\n- complex: multi-step problems, analysis, research, comparisons\n- creative: writing, brainstorming, design, artistic tasks',
  });
  return object;
}

async function handleSimple(input) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: input,
    system: 'You are a helpful assistant. Provide quick, direct, and accurate answers.',
  });
  return text;
}

async function handleComplex(input) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Break down this complex task and solve it step by step:\n\n${input}\n\nProvide a thorough, well-reasoned analysis.`,
    system: 'You are a problem solver. Use systematic analysis for complex tasks. Show your reasoning step by step.',
  });
  return text;
}

async function handleCreative(input) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: input,
    system: 'You are a creative assistant. Think outside the box and provide innovative, engaging solutions. Be original and expressive.',
  });
  return text;
}

const handlers = {
  simple: handleSimple,
  complex: handleComplex,
  creative: handleCreative,
};

export async function adaptiveAgent(input) {
  console.log(`\n=== Vercel AI SDK (JS): Adaptive Agent Pattern ===`);
  console.log(`Input: ${input}\n`);

  const classification = await classifyQuery(input);
  console.log(`Classification: ${classification.complexity}`);
  console.log(`Reasoning: ${classification.reasoning}`);
  console.log(`Suggested approach: ${classification.suggestedApproach}\n`);

  const handler = handlers[classification.complexity] || handleSimple;
  const result = await handler(input);

  return { classification, result };
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const simple = await adaptiveAgent('What is the capital of France?');
  console.log('\n=== Response ===');
  console.log(simple.result);

  const complex = await adaptiveAgent(
    'Compare the pros and cons of microservices vs monolithic architecture for a startup'
  );
  console.log('\n=== Response ===');
  console.log(complex.result);
}

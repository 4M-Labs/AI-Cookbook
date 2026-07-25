/**
 * Multi-Agent Pattern
 * 
 * Multiple specialized agents working together in a pipeline.
 * A researcher gathers information, a writer formats it, and an editor polishes it.
 * SDK: Vercel AI SDK
 */

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

async function researcherAgent(topic) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Research the following topic thoroughly and provide key findings, data points, and insights:\n\n${topic}`,
    system: 'You are a research specialist. Gather comprehensive, accurate information. Include specific facts, statistics, and expert opinions where possible.',
  });
  return text;
}

async function writerAgent(research, topic) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Based on this research, write a well-structured article about "${topic}":\n\n${research}\n\nWrite a clear, engaging article with an introduction, key points, and conclusion.`,
    system: 'You are a professional writer. Create well-structured, engaging content. Use clear headings and paragraphs.',
  });
  return text;
}

async function editorAgent(draft) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Edit and improve this article for clarity, flow, and impact:\n\n${draft}`,
    system: 'You are an experienced editor. Polish the text for publication. Fix awkward phrasing, improve transitions, and ensure consistent tone.',
  });
  return text;
}

export async function multiAgentWorkflow(topic) {
  console.log(`\n=== Vercel AI SDK (JS): Multi-Agent Pattern ===`);
  console.log(`Topic: ${topic}\n`);

  console.log('Step 1: Researcher gathering information...');
  const research = await researcherAgent(topic);
  console.log(`  Research complete (${research.length} chars)\n`);

  console.log('Step 2: Writer creating draft...');
  const draft = await writerAgent(research, topic);
  console.log(`  Draft complete (${draft.length} chars)\n`);

  console.log('Step 3: Editor polishing...');
  const final = await editorAgent(draft);
  console.log(`  Final version complete (${final.length} chars)\n`);

  return { research, draft, final };
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await multiAgentWorkflow('The benefits of remote work in 2026');
  console.log('=== Final Article ===');
  console.log(result.final);
}

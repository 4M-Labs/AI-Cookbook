/**
 * Claude Agent SDK Pattern Implementation
 *
 * This file demonstrates the agentic pattern using the Claude Agent SDK.
 * It showcases how to build tool-using agents with streaming, built-in
 * tools, and model-agnostic design for complex workflows.
 */
import { query, ClaudeAgentOptions } from '@anthropic-ai/claude-agent-sdk';

/**
 * Code review agent that analyzes a file and suggests improvements
 */
async function reviewCode(filePath) {
  const options = new ClaudeAgentOptions({
    allowed_tools: ['Read', 'Glob', 'Grep'],
    max_turns: 5,
  });

  let output = '';
  for await (const msg of query({
    prompt: `Review the code in ${filePath}. Check for bugs, performance
      issues, and style problems. Provide specific line-level suggestions.`,
    options,
  })) {
    if (msg.type === 'assistant') {
      output += msg.content;
    }
  }

  return output;
}

/**
 * File operations agent that reads, analyzes, and writes files
 */
async function analyzeAndReport(directory) {
  const options = new ClaudeAgentOptions({
    allowed_tools: ['Read', 'Glob', 'Grep', 'Write'],
    max_turns: 8,
  });

  const messages = [];
  for await (const msg of query({
    prompt: `Scan ${directory} for TODO and FIXME comments. Write a
      summary report to ${directory}/todo-report.md with file paths,
      line numbers, and the comment text.`,
    options,
  })) {
    messages.push(msg);
  }

  return messages.filter((m) => m.type === 'assistant').map((m) => m.content).join('');
}

/**
 * Web research agent that searches and synthesizes findings
 */
async function researchTopic(topic) {
  const options = new ClaudeAgentOptions({
    allowed_tools: ['WebSearch', 'Read', 'Write'],
    max_turns: 6,
  });

  let output = '';
  for await (const msg of query({
    prompt: `Research "${topic}". Search for recent developments, find
      authoritative sources, and write a 300-word summary with citations.`,
    options,
  })) {
    if (msg.type === 'assistant') {
      output += msg.content;
    }
  }

  return output;
}

/**
 * Multi-step pipeline: gather -> transform -> validate
 *
 * Each step uses different tools, and the agent decides
 * which tools to invoke based on the task description.
 */
async function dataPipeline(sourceUrl) {
  const options = new ClaudeAgentOptions({
    allowed_tools: ['Bash', 'Read', 'Write', 'WebSearch'],
    max_turns: 10,
  });

  const steps = [];
  for await (const msg of query({
    prompt: `Fetch data from ${sourceUrl}, validate its structure,
      transform it into clean JSON, and save the result to output.json.`,
    options,
  })) {
    if (msg.type === 'assistant') {
      steps.push(msg.content);
    }
  }

  return steps;
}

/**
 * Streaming agent with real-time output
 */
async function streamAssistant(userMessage) {
  const options = new ClaudeAgentOptions({
    allowed_tools: ['Read', 'Glob'],
    max_turns: 3,
  });

  for await (const msg of query({
    prompt: userMessage,
    options,
  })) {
    if (msg.type === 'assistant') {
      process.stdout.write(msg.content);
    }
  }
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    console.log('=== Claude Agent SDK: Code Review ===');
    await reviewCode('./src/index.js');

    console.log('\n=== Claude Agent SDK: Research ===');
    const summary = await researchTopic('AI agent frameworks 2025');
    console.log(summary);
  })();
}

/**
 * OpenAI Agents SDK Pattern Implementation
 *
 * This file demonstrates the agentic pattern using the OpenAI Agents SDK.
 * It showcases how to build multi-agent systems with handoffs, guardrails,
 * and built-in tracing for complex workflows.
 */
import { Agent, run, functionTool, setTracingDisabled } from 'openai-agents';

/**
 * Research agent that gathers information on a topic
 */
const researcher = new Agent({
  name: 'Researcher',
  instructions: `You are a research specialist. Given a topic, produce
    a concise factual summary with key statistics, recent developments,
    and relevant context. Cite your confidence level for each claim.`,
});

/**
 * Writer agent that transforms research into polished content
 */
const writer = new Agent({
  name: 'Writer',
  instructions: `You are a content writer. Given research notes, produce
    a clear, engaging draft. Use short paragraphs, concrete examples,
    and a professional tone. Do not fabricate data.`,
});

/**
 * Editor agent that reviews and refines drafts
 */
const editor = new Agent({
  name: 'Editor',
  instructions: `You are an editor. Review the draft for accuracy, clarity,
    tone, and structure. Fix grammar, improve flow, and flag any
    unsupported claims. Return the polished final version.`,
});

/**
 * Custom tool: fetches live data from an external source
 */
const fetchLiveData = functionTool({
  description: 'Fetch live data from an API endpoint',
  parameters: {
    type: 'object',
    properties: {
      url: { type: 'string', description: 'The URL to fetch data from' },
    },
    required: ['url'],
  },
  execute: async ({ url }) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return await res.json();
  },
});

/**
 * Full pipeline: research -> write -> edit with handoffs
 *
 * Handoffs let agents transfer control to the next specialist
 * once their part is complete, creating a sequential pipeline.
 */
async function produceArticle(topic) {
  setTracingDisabled(false); // Enable tracing for observability

  const result = await run({
    agent: researcher,
    prompt: `Research this topic thoroughly: ${topic}`,
    tools: [fetchLiveData],
    maxTurns: 5,
    // Hand off to writer after research is done
    handoffs: [writer],
  });

  console.log('Pipeline output:', result.finalOutput);
  return result.finalOutput;
}

/**
 * Single agent with guardrails for safe tool use
 *
 * Guardrails validate inputs and outputs at each step,
 * preventing the agent from taking unsafe actions.
 */
async function safeAssistant(userMessage) {
  const assistant = new Agent({
    name: 'SafeAssistant',
    instructions: `You are a helpful assistant. Only answer questions
      about publicly available information. Never share personal data
      or attempt to access restricted systems.`,
    tools: [fetchLiveData],
  });

  const result = await run({
    agent: assistant,
    prompt: userMessage,
    maxTurns: 3,
  });

  return result.finalOutput;
}

/**
 * Multi-turn conversation with a persistent agent
 */
async function conversationalAgent(messages) {
  const agent = new Agent({
    name: 'Conversationalist',
    instructions: `You are a knowledgeable assistant. Maintain context
      across the conversation. Be concise and precise.`,
  });

  const result = await run({
    agent,
    prompt: messages[messages.length - 1].content,
    maxTurns: 1,
  });

  return result.finalOutput;
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    console.log('=== OpenAI Agents SDK: Article Pipeline ===');
    await produceArticle('The state of AI in 2025');

    console.log('\n=== OpenAI Agents SDK: Safe Assistant ===');
    const answer = await safeAssistant('What is quantum computing?');
    console.log(answer);
  })();
}

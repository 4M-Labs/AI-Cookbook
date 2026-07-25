# OpenAI Agents SDK

<!--
SEO/AEO Metadata
Primary Keyword: OpenAI Agents SDK pattern
Secondary Keywords: multi-agent handoffs, AI agent guardrails, agentic workflow SDK
Target Intent: informational
Suggested Slug: agents/openai-agents-sdk
Meta Description: Build multi-agent systems with handoffs, guardrails, and tracing using the OpenAI Agents SDK. A practical guide with JavaScript code examples.
-->

The OpenAI Agents SDK lets you compose multiple AI agents into structured workflows. Each agent specializes in one task, and handoffs pass control between them like a relay race.

---

## When to Use

- Multi-step workflows where different agents handle different phases (research, writing, editing)
- You need built-in guardrails to validate inputs and outputs at each step
- Tracing and observability matter for debugging complex agent chains
- Handoffs between agents should be explicit and controllable
- You want typed function tools with schema validation

## Basic Example

```javascript
import { Agent, run } from 'openai-agents';

const researcher = new Agent({
  name: 'Researcher',
  instructions: 'You are a research specialist. Produce concise factual summaries.',
});

const result = await run({
  agent: researcher,
  prompt: 'Summarize the latest developments in renewable energy.',
  maxTurns: 3,
});

console.log(result.finalOutput);
```

## Key Variations

### Agent Handoffs

Pass control between agents in a pipeline. Each agent completes its part and hands off to the next.

```javascript
const writer = new Agent({
  name: 'Writer',
  instructions: 'Turn research notes into a polished article.',
});

const editor = new Agent({
  name: 'Editor',
  instructions: 'Review the draft for accuracy and clarity.',
});

const result = await run({
  agent: researcher,
  prompt: 'Write an article about AI safety.',
  handoffs: [writer],
  maxTurns: 5,
});
```

### Function Tools

Define typed tools that agents can call. The SDK validates parameters against the schema automatically.

```javascript
import { functionTool } from 'openai-agents';

const searchTool = functionTool({
  description: 'Search the web for current information',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
    },
    required: ['query'],
  },
  execute: async ({ query }) => {
    // Your search implementation
    return `Results for: ${query}`;
  },
});

const agent = new Agent({
  name: 'Searcher',
  instructions: 'Use the search tool to find information.',
  tools: [searchTool],
});
```

### Guardrails

Add validation layers that check agent inputs and outputs before they proceed.

```javascript
const safeAgent = new Agent({
  name: 'SafeAgent',
  instructions: 'Only answer factual questions. Never guess.',
  guardrails: [
    // Guardrails validate each step before execution
  ],
});

const result = await run({
  agent: safeAgent,
  prompt: userMessage,
  maxTurns: 3,
});
```

## Best Practices

- Give each agent a clear, narrow role with explicit instructions
- Set `maxTurns` to prevent runaway agent loops
- Use function tools for structured data access instead of free-form prompts
- Enable tracing during development for visibility into agent decisions
- Start with two agents and add complexity only after validating behavior

## Limitations

- Each agent adds latency from an additional model call
- Handoffs require careful prompt design to avoid context loss
- Guardrails add overhead on every step, slowing execution
- Debugging multi-agent chains is harder than single-prompt flows
- Token costs multiply with the number of agents and turns

---

**Built by [4M Labs](https://4mlabs.io) -- Ship AI that works.**

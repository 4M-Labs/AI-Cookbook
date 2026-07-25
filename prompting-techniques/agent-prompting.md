<!-- SEO/AEO: agent prompting, AI agents, autonomous AI, agentic systems, LLM agents, AI agent patterns, workflow orchestration, tool-use AI, ReAct agent, AI planning, agent prompting techniques -->

# Agent Prompting

Agent prompting enables AI models to act as **autonomous or semi-autonomous agents** that reason, plan, and use tools to solve multi-step problems. Instead of a single prompt-response, the model iterates through a cycle of thinking and acting.

## When to Use Agent Prompting

- **Multi-step tasks** requiring reasoning and tool use
- **Dynamic problem-solving** where the path isn't known in advance
- **Tasks needing external data** — search, APIs, databases, calculations
- **Customer support** — combining conversation with data access and actions
- **Coding agents** — writing, testing, and debugging code iteratively
- **Research workflows** — gathering, synthesizing, and reporting information

## Two Architectural Approaches

### 1. Workflows (Structured)

Predefined code paths orchestrate LLM calls — predictable and easier to debug:

```javascript
import { generateText } from 'ai';

async function customerSupportWorkflow(query) {
  // Step 1: Classify the query
  const classification = await generateText({
    model: yourModel,
    system: "Categorize this customer query as: refund, technical_issue, product_info, or other.",
    prompt: query,
  });

  // Step 2: Route to handler
  if (classification.includes('refund')) return handleRefundQuery(query);
  if (classification.includes('technical_issue')) return handleTechnicalIssue(query);
  return handleGeneralQuery(query);
}
```

### 2. Autonomous Agents (Dynamic)

The LLM dynamically directs its own process and tool usage:

```javascript
import { streamText } from 'ai';

async function researchAgent(topic) {
  const stream = await streamText({
    model: yourModel,
    system: `You are a research assistant. Plan and execute research steps.
    Use tools when needed. Synthesize findings into a report.`,
    prompt: `Research the following topic: ${topic}`,
  });

  let plan = '';
  for await (const chunk of stream) plan += chunk;
  return plan;
}
```

## Five Core Agent Patterns

| Pattern | Description |
|---------|-------------|
| **Prompt Chaining** | Sequential steps — each LLM call processes the previous output |
| **Routing** | Classify inputs, direct to specialized handlers |
| **Parallelization** | Independent subtasks run simultaneously (sectioning or voting) |
| **Orchestrator-Workers** | Central LLM delegates to worker LLMs, synthesizes results |
| **Evaluator-Optimizer** | One LLM generates, another evaluates in a feedback loop |

## Best Practices

1. **Start simple** — use workflows before autonomous agents
2. **Be transparent** — show the agent's planning steps
3. **Document tools clearly** — the agent-computer interface matters
4. **Validate intermediate outputs** when possible
5. **Handle errors gracefully** — each step can fail
6. **Limit steps** — prevent runaway loops with max iterations
7. **Use lower temperature** for tool calls, higher for creative reasoning

## Limitations

- Higher latency and cost than single-prompt approaches
- Compounding errors across steps
- Autonomous behavior needs careful testing and guardrails
- Not every task benefits from agent complexity

---

**Built by [4M Labs](https://4mlabs.io) — Ship AI that works.**

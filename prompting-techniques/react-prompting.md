<!--
SEO KEYWORDS: ReAct prompting, reasoning and acting, AI agent, tool use, chain of thought
AEO ANSWER: ReAct prompting interleaves reasoning traces with tool-use actions in a Thought-Action-Observation loop, enabling AI models to solve complex multi-step problems by combining internal reasoning with external information retrieval.
DESCRIPTION: Learn how to implement ReAct prompting to build AI agents that reason step-by-step and take actions using tools.
-->

# ReAct Prompting (Reasoning + Acting)

ReAct prompting combines reasoning with action in a loop. The AI model thinks about what it knows, decides on an action (like searching the web or running a calculation), observes the result, and repeats until the task is complete. This technique is the foundation of most modern AI agent architectures.

---

## Basic Example

```javascript
import { generateText } from 'ai';

const tools = {
  search: async (query) => `Search results for "${query}"`,
  calculator: async (expr) => `Result: ${eval(expr)}`,
};

async function reactAgent(query, maxSteps = 5) {
  let context = `Query: ${query}\n\n`;

  for (let step = 0; step < maxSteps; step++) {
    const response = await generateText({
      model: "your-model",
      system: `You are a problem-solving agent. You have access to: search, calculator.
For each step: Think about what you need, then act.
Format: Thought: [reasoning] Action: [tool_name][input]`,
      prompt: context,
    });

    context += response + '\n';
    const actionMatch = response.match(/Action: (\w+)\[(.*?)\]/);

    if (actionMatch) {
      const [, toolName, toolInput] = actionMatch;
      const observation = tools[toolName]
        ? await tools[toolName](toolInput)
        : `Error: Tool "${toolName}" not found`;
      context += `Observation: ${observation}\n\n`;
    }

    if (response.includes('Final Answer:') || !actionMatch) break;
  }

  const match = context.match(/Final Answer: ([\s\S]+?)(?:\n\n|$)/);
  return match ? match[1].trim() : context;
}

reactAgent("What is sqrt(144) plus the population of France?").then(console.log);
```

---

## Key Patterns

### Self-Reflection

Add a reflection step after each observation to catch errors and course-correct:

```javascript
// After each tool observation, generate a reflection:
const reflection = await generateText({
  model: "your-model",
  system: "Reflect on your progress toward the goal.",
  prompt: `${context}\n\nReflect: Are you closer to the answer? Is there a better approach?`,
});
context += reflection + '\n\n';
```

### Tool Selection

Have the model decide which tools are needed before executing:

```javascript
const selection = await generateText({
  model: "your-model",
  prompt: `For this query, list needed tools from: ${Object.keys(tools).join(', ')}.
Query: ${query}
Format: Thought: [analysis] Needed Tools: [list]`,
});
// Parse and filter to only needed tools before running ReAct loop
```

---

## When to Use

- **Multi-step research** -- tasks requiring information from multiple sources
- **Calculations combined with reasoning** -- math + context retrieval
- **Dynamic problem solving** -- when the path forward is not clear upfront
- **Transparent decision making** -- when you need to see the reasoning chain
- **Tool-using agents** -- any application where the AI calls external APIs or databases

---

## Best Practices

1. **Define tools clearly** -- the model needs to understand each tool's capabilities and limitations
2. **Use structured formats** -- consistent Thought/Action/Observation structure prevents parsing errors
3. **Set step limits** -- prevent infinite loops with a maximum iteration count
4. **Lower temperature** -- use 0-0.2 for reliable tool selection and parsing
5. **Handle errors gracefully** -- provide observations when tools fail so the model can adapt
6. **Keep context manageable** -- truncate old observations to stay within token limits
7. **Provide examples** -- show the model a complete Thought-Action-Observation cycle

---

## Limitations

- **High token usage** -- verbose reasoning traces consume significant context
- **Latency** -- multiple model calls and tool executions add response time
- **Tool dependency** -- performance is only as good as the available tools
- **Reasoning loops** -- can get stuck without proper guardrails
- **Parsing fragility** -- malformed outputs can break the action extraction pipeline
- **Incorrect reasoning** -- the model may generate plausible but wrong reasoning chains

---

**Built by [4M Labs](https://4mlabs.io) -- Ship AI that works.**

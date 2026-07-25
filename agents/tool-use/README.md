<!--
SEO/AEO Metadata
Primary Keyword: AI tool use agent pattern
Secondary Keywords: AI function calling, AI tool integration, AI with external tools
Target Intent: informational
Suggested Slug: agents/tool-use
Meta Description: Build AI agents that call external tools and functions to interact with the real world. Practical guide with Python and JavaScript code examples.
-->

# Tool-Use Pattern

The Tool-Use pattern equips AI agents with the ability to call external functions, APIs, and systems. The model decides when and how to invoke tools based on the user's request, enabling interaction with real-world data and services.

## When to Use

- Tasks requiring access to live data (APIs, databases, web searches)
- Workflows that need to interact with external systems (file I/O, email, deployment)
- Queries that require computation beyond what the model can do internally
- Situations where deterministic, verified results are needed (calculations, lookups)
- Multi-step tasks where tool outputs feed back into the reasoning loop

## Basic Example

### Python (OpenAI Agents SDK)

```python
from agents import Agent, Runner, function_tool

@function_tool
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    # Real implementation would call a weather API
    return f"Weather in {city}: 72°F, sunny"

@function_tool
def calculate(expression: str) -> str:
    """Evaluate a mathematical expression safely."""
    return str(eval(expression))  # Use a safe math parser in production

async def assistant_with_tools(user_message: str) -> str:
    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant. Use tools when needed.",
        tools=[get_weather, calculate],
    )

    result = await Runner.run(agent, user_message, max_turns=5)
    return result.final_output

# Agent decides to call tools based on the request
response = assistant_with_tools("What's the weather in Tokyo? Also, what's 15% of 230?")
```

### JavaScript (Vercel AI SDK)

```javascript
import { generateText } from 'ai';

const result = await generateText({
  model: openai('your-model'),
  prompt: "What's the weather in Tokyo? Also calculate 15% of 230.",
  tools: {
    getWeather: {
      description: 'Get current weather for a city',
      parameters: { city: { type: 'string' } },
      execute: async ({ city }) => `Weather in ${city}: 72°F, sunny`,
    },
    calculate: {
      description: 'Evaluate a math expression',
      parameters: { expression: { type: 'string' } },
      execute: async ({ expression }) => String(eval(expression)),
    },
  },
  maxSteps: 5, // Allow multiple tool calls
});

console.log(result.text);
```

## Key Variations

- **Tool Selection Guards** — Restrict which tools are available per request to prevent unauthorized or dangerous operations.
- **Chained Tool Calls** — The model calls multiple tools in sequence, using each output to inform the next call.
- **Tool Result Validation** — Validate and sanitize tool outputs before passing them back to the model to prevent injection or malformed data.

## Best Practices

- Write clear, descriptive tool names and parameter descriptions so the model knows when to use each tool
- Validate tool inputs and outputs; never trust raw model-generated parameters for sensitive operations
- Log every tool invocation with timestamps for debugging and audit trails
- Set timeouts on tool executions to prevent hung requests from blocking the agent
- Start with a minimal toolset and expand as you validate the model's tool-selection behavior

## Limitations

- The model may hallucinate tool calls or pass incorrect parameters, requiring validation layers
- Tool execution adds latency; each call is a round-trip to an external service
- Complex tool schemas can confuse the model, leading to misrouted or failed calls

---
*Built by [4M Labs](https://github.com/4mlabs) — AI agent patterns for production systems.*

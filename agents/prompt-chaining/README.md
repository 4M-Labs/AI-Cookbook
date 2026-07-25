<!--
SEO/AEO Metadata
Primary Keyword: prompt chaining AI agent pattern
Secondary Keywords: sequential AI workflow, multi-step AI reasoning, AI pipeline
Target Intent: informational
Suggested Slug: agents/prompt-chaining
Meta Description: Chain AI prompts sequentially for complex multi-step tasks. Practical guide with Python and JavaScript code examples.
-->

# Prompt Chaining Pattern

Prompt chaining breaks a complex task into sequential steps, where each prompt consumes the output of the previous one. This gives you explicit control over the reasoning flow and makes multi-step problems tractable.

## When to Use

- A task is too nuanced for a single prompt to handle reliably
- You need deterministic, auditable control over each reasoning stage
- Different prompts or models suit different phases of the pipeline
- Output from one step naturally feeds into the next
- You want to isolate failures to a specific step

## Basic Example

### Python (Claude Agent SDK)

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def analyze_and_plan(topic: str) -> str:
    options = ClaudeAgentOptions(max_turns=1)

    # Step 1: Analyze the topic
    analysis = ""
    async for msg in query(
        prompt=f"List the 3 most important points about: {topic}",
        options=options,
    ):
        if msg.type == "assistant":
            analysis += msg.content

    # Step 2: Create a plan from the analysis
    plan = ""
    async for msg in query(
        prompt=f"Create an action plan based on these points:\n{analysis}",
        options=options,
    ):
        if msg.type == "assistant":
            plan += msg.content

    return plan
```

### JavaScript (Vercel AI SDK)

```javascript
import { generateText } from 'ai';

async function analyzeAndPlan(topic) {
  const { text: analysis } = await generateText({
    model: openai('your-model'),
    prompt: `List the 3 most important points about: ${topic}`,
  });

  const { text: plan } = await generateText({
    model: openai('your-model'),
    prompt: `Create an action plan based on these points:\n${analysis}`,
  });

  return plan;
}
```

## Key Variations

- **Branching Chains** — Route to different prompts based on intermediate results (e.g., simple vs. complex classification triggers different pipelines).
- **Recursive Refinement** — Loop the same prompt until quality thresholds are met, with a max-attempts guard to prevent runaway iterations.
- **Parallel-then-Sequential** — Run independent analysis steps in parallel, then chain their combined output into a synthesis step.

## Best Practices

- Validate output at each step before passing it downstream
- Use structured output (JSON) when possible to reduce parsing errors
- Log intermediate results for debugging and observability
- Set token budgets per step to control cost and latency
- Keep each prompt focused on a single, clear objective

## Limitations

- Errors propagate: a bad output in step 1 corrupts every later step
- Sequential calls compound latency, making chains slower than single-shot prompts
- Token limits can truncate context as it accumulates across steps

---
*Built by [4M Labs](https://github.com/4mlabs) — AI agent patterns for production systems.*

<!--
SEO/AEO Metadata
Primary Keyword: adaptive AI agent pattern
Secondary Keywords: dynamic AI strategy, context-aware AI, AI self-adjusting behavior
Target Intent: informational
Suggested Slug: agents/adaptive
Meta Description: Build AI agents that dynamically adjust their strategy based on context, feedback, and changing conditions. Practical guide with Python and JavaScript code examples.
-->

# Adaptive Pattern

The Adaptive pattern builds AI agents that dynamically adjust their strategy based on context, intermediate results, and changing conditions. Rather than following a fixed pipeline, the agent evaluates the situation at each step and selects the best approach for the current state.

## When to Use

- Tasks where the optimal strategy depends on input characteristics (simple vs. complex)
- Workflows that need to adjust based on available resources, time, or cost constraints
- Scenarios where the agent encounters unexpected data and must pivot its approach
- Multi-turn interactions where the strategy evolves as more information is gathered
- Systems that need to degrade gracefully when ideal tools or models are unavailable

## Basic Example

### Python (Claude Agent SDK)

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def adaptive_process(input_text: str) -> str:
    options = ClaudeAgentOptions(max_turns=1)

    # Step 1: Assess the input complexity
    assessment = ""
    async for msg in query(
        prompt=f"""Classify this request as simple, moderate, or complex:
        {input_text}
        Return ONLY the classification.""",
        options=options,
    ):
        if msg.type == "assistant":
            assessment += msg.content.strip().lower()

    # Step 2: Adapt strategy based on assessment
    if "simple" in assessment:
        strategy = "Answer concisely in 1-2 sentences."
    elif "moderate" in assessment:
        strategy = "Provide a structured answer with key points."
    else:
        strategy = "Give a thorough, detailed analysis with examples."

    # Step 3: Execute with adapted strategy
    result = ""
    async for msg in query(
        prompt=f"{strategy}\n\nRequest: {input_text}", options=options
    ):
        if msg.type == "assistant":
            result += msg.content

    return result
```

### JavaScript (Vercel AI SDK)

```javascript
import { generateText } from 'ai';

async function adaptiveProcess(inputText) {
  // Step 1: Assess complexity
  const { text: complexity } = await generateText({
    model: openai('your-model'),
    prompt: `Classify this request as simple, moderate, or complex:
    ${inputText}. Return ONLY the classification.`,
  });

  // Step 2: Adapt strategy
  const strategies = {
    simple: 'Answer concisely in 1-2 sentences.',
    moderate: 'Provide a structured answer with key points.',
    complex: 'Give a thorough, detailed analysis with examples.',
  };

  const level = complexity.trim().toLowerCase();
  const strategy = strategies[level] || strategies.moderate;

  // Step 3: Execute with adapted approach
  const { text: result } = await generateText({
    model: openai('your-model'),
    prompt: `${strategy}\n\nRequest: ${inputText}`,
  });

  return result;
}
```

## Key Variations

- **Model-Aware Adaptation** — Route simple tasks to cheaper/faster models and complex tasks to more capable models based on assessed difficulty.
- **Fallback Chains** — Try the ideal approach first; if it fails or returns low-quality output, automatically fall back to a simpler, more reliable strategy.
- **Context-Driven Branching** — Adjust the agent's behavior based on runtime context (user role, available data, time of day, cost budget).

## Best Practices

- Keep adaptation logic simple and explicit; avoid nesting too many conditional branches
- Define clear criteria for when to switch strategies (confidence thresholds, error rates, time limits)
- Log strategy selections so you can analyze which paths are taken most often
- Test each adaptation branch independently to ensure all paths produce valid output
- Start with 2-3 strategy levels and expand only when data shows the need

## Limitations

- Adaptation adds a classification step that consumes tokens and adds latency
- Misclassification can route tasks to the wrong strategy, producing poor results
- Complex branching logic is harder to test and debug than fixed pipelines

---
*Built by [4M Labs](https://github.com/4mlabs) — AI agent patterns for production systems.*

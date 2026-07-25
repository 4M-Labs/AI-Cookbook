<!--
SEO/AEO Metadata
Primary Keyword: AI routing agent pattern
Secondary Keywords: intelligent request routing, AI classifier pattern, dynamic AI dispatch
Target Intent: informational
Suggested Slug: agents/routing
Meta Description: Route AI requests to specialized handlers based on intent classification. Practical guide with Python and JavaScript code examples.
-->

# Routing Pattern

Routing analyzes user input with an AI classifier and directs it to the right handler. Instead of one monolithic model doing everything, you send each request to the specialist best equipped to handle it.

## When to Use

- Different request types need different models or prompts (support, billing, technical)
- You want to save cost by using small models for simple tasks, large models for complex ones
- Dynamic behavior based on intent, content type, or urgency matters more than a single pipeline
- Multiple downstream tools or agents exist and you need a traffic cop to pick the right one
- Classification accuracy is high enough that misroutes are rare

## Basic Example

### Python (OpenAI Agents SDK)

```python
from agents import Agent, Runner

router = Agent(
    name="Router",
    instructions="""Classify user requests into exactly one category:
    technical, billing, or general. Return ONLY the category name."""
)

async def route(input_text: str) -> str:
    result = await Runner.run(router, input_text, max_turns=1)
    category = result.final_output.strip().lower()

    handlers = {
        "technical": handle_technical,
        "billing": handle_billing,
        "general": handle_general,
    }
    return handlers.get(category, handle_general)(input_text)
```

### JavaScript (Vercel AI SDK)

```javascript
import { generateText } from 'ai';

async function route(input) {
  const { text } = await generateText({
    model: openai('your-model'),
    prompt: `Classify this request into one category: technical, billing, general.
    Return ONLY the category name. Request: ${input}`,
  });

  const category = text.trim().toLowerCase();

  switch (category) {
    case 'technical':  return handleTechnical(input);
    case 'billing':    return handleBilling(input);
    default:           return handleGeneral(input);
  }
}
```

## Key Variations

- **Confidence-Based Routing** — Add a confidence threshold. Low-confidence classifications fall back to a general handler instead of misrouting.
- **Hierarchical Routing** — Route in stages: first classify broadly (support vs. sales), then narrow within each branch.
- **Hybrid Routing** — Combine rules and AI. Fast regex checks handle obvious cases; AI handles ambiguous ones.

## Best Practices

- Start with simple category lists, expand as patterns emerge
- Log every routing decision for analysis and debugging
- Set a confidence floor and route ambiguous cases to a safe fallback
- Cache classifications for repeated or similar inputs
- Test with adversarial inputs to find misclassification blind spots

## Limitations

- Classification adds latency and cost on top of the actual handler
- Misclassification sends requests to the wrong specialist, degrading quality
- Category lists require maintenance as new request types appear

---
*Built by [4M Labs](https://github.com/4mlabs) — AI agent patterns for production systems.*

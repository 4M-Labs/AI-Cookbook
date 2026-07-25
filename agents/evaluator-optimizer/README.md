<!--
SEO/AEO Metadata
Primary Keyword: evaluator optimizer AI pattern
Secondary Keywords: AI self-improvement loop, AI quality feedback, iterative AI refinement
Target Intent: informational
Suggested Slug: agents/evaluator-optimizer
Meta Description: Build AI systems that evaluate their own output and iteratively improve quality. Practical guide with Python and JavaScript code examples.
-->

# Evaluator-Optimizer Pattern

The Evaluator-Optimizer pattern builds an iterative feedback loop where AI generates output, evaluates it against defined criteria, and refines until quality standards are met.

## When to Use

- Code generation where output must pass linting, type checks, or unit tests
- Content creation requiring tone, accuracy, or SEO compliance
- Data transformation with validation rules and schema constraints
- Report drafting that needs factual accuracy and formatting standards
- Prompt engineering where output quality improves with self-critique

## Basic Example

### Python (Claude Agent SDK)

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def generate_and_evaluate(prompt: str, criteria: str) -> dict:
    options = ClaudeAgentOptions(max_turns=1)

    # Step 1: Generate
    draft = ""
    async for msg in query(prompt=prompt, options=options):
        if msg.type == "assistant":
            draft += msg.content

    # Step 2: Evaluate
    evaluation = ""
    async for msg in query(
        prompt=f"""Evaluate this output against the criteria:
        Criteria: {criteria}
        Output: {draft}
        Return a score (1-10) and specific feedback for improvement.""",
        options=options,
    ):
        if msg.type == "assistant":
            evaluation += msg.content

    # Step 3: Refine if needed
    refined = ""
    async for msg in query(
        prompt=f"""Improve this output based on feedback:
        Original: {draft}
        Feedback: {evaluation}
        Produce a refined version.""",
        options=options,
    ):
        if msg.type == "assistant":
            refined += msg.content

    return {"draft": draft, "evaluation": evaluation, "refined": refined}
```

### JavaScript (Vercel AI SDK)

```javascript
import { generateText } from 'ai';

async function generateAndEvaluate(prompt, criteria) {
  // Step 1: Generate
  const { text: draft } = await generateText({
    model: openai('your-model'),
    prompt,
  });

  // Step 2: Evaluate
  const { text: evaluation } = await generateText({
    model: openai('your-model'),
    prompt: `Evaluate this output against the criteria:
    Criteria: ${criteria}
    Output: ${draft}
    Return a score (1-10) and specific feedback.`,
  });

  // Step 3: Refine
  const { text: refined } = await generateText({
    model: openai('your-model'),
    prompt: `Improve this output based on feedback:
    Original: ${draft}
    Feedback: ${evaluation}`,
  });

  return { draft, evaluation, refined };
}
```

## Key Variations

- **Weighted Scoring** — Adjust importance per criterion to prioritize what matters most (e.g., security weight 10 vs. style weight 3).
- **Max Attempts Guard** — Prevent runaway loops with a hard iteration limit and minimum score threshold.
- **Multi-Criteria with Feedback** — Each criterion returns a pass/fail, score, and feedback string for targeted refinement.

## Best Practices

- Make criteria specific and measurable, not vague like "good quality"
- Use weights to reflect true priorities; a 10x weight difference means 10x importance
- Set MAX_ATTEMPTS low (3-5) to control cost and latency
- Log each iteration's output to debug refinement behavior
- Start with fewer criteria and add more as patterns stabilize

## Limitations

- Quality depends on how clear and specific the initial prompt is
- Each iteration consumes tokens; costs scale linearly with attempts
- AI evaluation is not perfect; it can reward surface-level fixes over deep corrections

---
*Built by [4M Labs](https://github.com/4mlabs) — AI agent patterns for production systems.*

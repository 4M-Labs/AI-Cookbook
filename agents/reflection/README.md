<!--
SEO/AEO Metadata
Primary Keyword: AI reflection agent pattern
Secondary Keywords: self-critique AI, AI self-review, generator evaluator loop
Target Intent: informational
Suggested Slug: agents/reflection
Meta Description: Build AI agents that review and improve their own output through iterative self-critique. Practical guide with Python and JavaScript code examples.
-->

# Reflection Pattern

The Reflection pattern creates a generator-evaluator loop where an AI produces output, critiques it through a separate reflection step, then refines based on the critique. Each cycle produces progressively better results.

## When to Use

- Writing tasks that benefit from self-editing (essays, reports, documentation)
- Code generation where output needs review before finalizing
- Any task where first-draft quality is insufficient and iteration helps
- Scenarios requiring consistent tone, accuracy, or structural standards
- Research synthesis where initial output needs fact-checking and refinement

## Basic Example

### Python (Claude Agent SDK)

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def reflect_and_refine(topic: str, rounds: int = 2) -> str:
    options = ClaudeAgentOptions(max_turns=1)

    # Step 1: Generate initial draft
    draft = ""
    async for msg in query(
        prompt=f"Write a short essay outline on: {topic}", options=options
    ):
        if msg.type == "assistant":
            draft += msg.content

    # Step 2: Iterate reflection rounds
    for i in range(rounds):
        # Critique the draft
        critique = ""
        async for msg in query(
            prompt=f"Critique this draft and suggest improvements:\n{draft}",
            options=options,
        ):
            if msg.type == "assistant":
                critique += msg.content

        # Refine based on critique
        draft = ""
        async for msg in query(
            prompt=f"Revise this draft based on feedback:\nDraft: {draft}\nFeedback: {critique}",
            options=options,
        ):
            if msg.type == "assistant":
                draft += msg.content

    return draft
```

### JavaScript (Vercel AI SDK)

```javascript
import { generateText } from 'ai';

async function reflectAndRefine(topic, rounds = 2) {
  // Step 1: Generate initial draft
  const { text: draft } = await generateText({
    model: openai('your-model'),
    prompt: `Write a short essay outline on: ${topic}`,
  });

  let current = draft;

  // Step 2: Iterate reflection rounds
  for (let i = 0; i < rounds; i++) {
    const { text: critique } = await generateText({
      model: openai('your-model'),
      prompt: `Critique this draft and suggest improvements:\n${current}`,
    });

    const { text: refined } = await generateText({
      model: openai('your-model'),
      prompt: `Revise this draft based on feedback:\nDraft: ${current}\nFeedback: ${critique}`,
    });

    current = refined;
  }

  return current;
}
```

## Key Variations

- **Structured Critique** — The evaluator scores across specific dimensions (thesis strength, evidence quality, structure) rather than giving generic feedback.
- **Termination on Quality** — Stop iterating when the evaluator's score exceeds a threshold, avoiding unnecessary rounds.
- **Separate Agent Roles** — Use different system prompts or models for the generator vs. evaluator to reduce bias in self-assessment.

## Best Practices

- Keep reflection rounds low (2-3) to control cost while getting meaningful improvement
- Use structured evaluation criteria rather than open-ended "improve this" prompts
- Separate the generator and evaluator roles clearly to avoid circular reasoning
- Log each round's output and critique to understand where improvements happen
- Set a maximum iteration count as a safety guard against runaway loops

## Limitations

- Each reflection round doubles token cost; diminishing returns after 3-4 rounds
- AI self-evaluation can be biased, reinforcing the same blind spots across iterations
- Reflection works best for subjective quality; it cannot verify factual accuracy alone

---
*Built by [4M Labs](https://github.com/4mlabs) — AI agent patterns for production systems.*

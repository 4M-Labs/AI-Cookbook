<!--
SEO/AEO Metadata
Primary Keyword: multi-agent AI pattern
Secondary Keywords: multi-agent systems, AI agent collaboration, cooperative AI agents
Target Intent: informational
Suggested Slug: agents/multi-agent
Meta Description: Build systems where multiple AI agents collaborate, each with specialized roles, to solve complex tasks. Practical guide with Python and JavaScript code examples.
-->

# Multi-Agent Pattern

The Multi-Agent pattern coordinates multiple specialized AI agents that collaborate on a shared goal. Each agent has a distinct role, expertise, and tool access, and they communicate or hand off work to produce a combined result greater than any single agent could achieve.

## When to Use

- Complex tasks requiring diverse expertise (research + writing + editing)
- Workflows where different agents need different system prompts or models
- Scenarios requiring separation of concerns (planning vs. execution vs. review)
- Tasks that benefit from adversarial review (one agent proposes, another critiques)
- Systems where agents need to hand off work to the next specialist in a pipeline

## Basic Example

### Python (OpenAI Agents SDK)

```python
import asyncio
from agents import Agent, Runner

researcher = Agent(
    name="Researcher",
    instructions="""You are a research specialist. Given a topic, gather key facts,
    statistics, and recent developments. Output structured research notes."""
)

writer = Agent(
    name="Writer",
    instructions="""You are a content writer. Given research notes, produce
    a clear, engaging article with short paragraphs and concrete examples."""
)

editor = Agent(
    name="Editor",
    instructions="""You are an editor. Review the draft for accuracy, clarity,
    tone, and structure. Return the polished final version."""
)

async def multi_agent_pipeline(topic: str) -> str:
    # Step 1: Research
    research = await Runner.run(
        researcher, f"Research: {topic}", max_turns=3
    )

    # Step 2: Write
    draft = await Runner.run(
        writer, f"Write about:\n{research.final_output}", max_turns=3
    )

    # Step 3: Edit
    final = await Runner.run(
        editor, f"Edit this draft:\n{draft.final_output}", max_turns=3
    )

    return final.final_output
```

### JavaScript (Vercel AI SDK)

```javascript
import { generateText } from 'ai';

async function multiAgentPipeline(topic) {
  // Agent 1: Researcher
  const { text: research } = await generateText({
    model: openai('your-model'),
    system: 'You are a research specialist. Gather facts and data.',
    prompt: `Research this topic: ${topic}`,
  });

  // Agent 2: Writer
  const { text: draft } = await generateText({
    model: openai('your-model'),
    system: 'You are a content writer. Produce engaging, clear articles.',
    prompt: `Write an article based on this research:\n${research}`,
  });

  // Agent 3: Editor
  const { text: final } = await generateText({
    model: openai('your-model'),
    system: 'You are an editor. Polish for accuracy, clarity, and tone.',
    prompt: `Edit this draft:\n${draft}`,
  });

  return final;
}
```

## Key Variations

- **Pipeline Agents** — Agents execute in a fixed sequence (research -> write -> edit), each passing output to the next.
- **Debate Agents** — Two agents argue opposing positions; a judge agent evaluates arguments and produces a balanced conclusion.
- **Specialist Pool** — A router agent dynamically selects which specialist to invoke based on the task type.

## Best Practices

- Give each agent a focused system prompt with clear role boundaries and output format expectations
- Use handoffs or explicit output passing rather than shared state to avoid coupling
- Limit the number of agents; each additional agent adds latency and coordination overhead
- Define clear input/output contracts between agents so failures are isolated
- Trace which agent handled which part of the task for debugging and accountability

## Limitations

- Coordination overhead grows with the number of agents; more agents means more latency
- Inconsistent outputs between agents can be hard to reconcile without a synthesis step
- Multi-agent systems are harder to debug than single-agent chains

---
*Built by [4M Labs](https://github.com/4mlabs) — AI agent patterns for production systems.*

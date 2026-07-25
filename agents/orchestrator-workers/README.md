<!--
SEO/AEO Metadata
Primary Keyword: orchestrator workers AI pattern
Secondary Keywords: AI task decomposition, AI parallel workers, AI coordinator pattern
Target Intent: informational
Suggested Slug: agents/orchestrator-workers
Meta Description: Coordinate multiple AI workers from a central orchestrator for complex multi-part tasks. Practical guide with Python and JavaScript code examples.
-->

# Orchestrator-Workers Pattern

A central orchestrator AI breaks down complex tasks and assigns subtasks to specialized worker AIs, then synthesizes their outputs into a final result.

## When to Use

- Tasks that require multiple types of expertise (research, analysis, writing)
- Workflows with independent subtasks that can run in parallel
- Complex goals that need decomposition into smaller, manageable pieces
- Projects requiring quality validation at multiple stages
- When you need different AI "personalities" for different parts of a job

## Basic Example

### Python (OpenAI Agents SDK)

```python
import asyncio
from agents import Agent, Runner

orchestrator = Agent(
    name="Orchestrator",
    instructions="""Break down the task into subtasks. For each subtask,
    specify which worker should handle it (researcher, writer, analyst).
    Return a JSON plan with subtasks and assigned workers."""
)

researcher = Agent(
    name="Researcher",
    instructions="You are a research specialist. Gather facts and data."
)
writer = Agent(
    name="Writer",
    instructions="You are a content writer. Produce clear, engaging drafts."
)

async def orchestrate(goal: str) -> str:
    # Step 1: Orchestrator creates a plan
    plan = await Runner.run(orchestrator, goal, max_turns=1)

    # Step 2: Execute workers based on the plan
    research_result = await Runner.run(
        researcher, f"Research for: {goal}", max_turns=3
    )
    write_result = await Runner.run(
        writer, f"Write about: {research_result.final_output}", max_turns=3
    )

    return write_result.final_output
```

### JavaScript (Vercel AI SDK)

```javascript
import { generateText } from 'ai';

async function orchestrate(goal) {
  // Step 1: Orchestrator decomposes the task
  const { text: plan } = await generateText({
    model: openai('your-model'),
    prompt: `Break this goal into subtasks with assigned workers:
    Goal: ${goal}. Return JSON with subtasks and worker assignments.`,
  });

  // Step 2: Execute workers
  const { text: research } = await generateText({
    model: openai('your-model'),
    prompt: `Research this topic thoroughly: ${goal}`,
  });

  const { text: draft } = await generateText({
    model: openai('your-model'),
    prompt: `Write a report based on this research:\n${research}`,
  });

  return draft;
}
```

## Key Variations

- **Sequential Workers** — Tasks execute in order where each worker depends on the previous result (research -> analyze -> write).
- **Parallel Workers** — Independent tasks run simultaneously for faster throughput, with the orchestrator waiting for all to complete.
- **Conditional Workers** — The orchestrator selects workers dynamically based on task type and content analysis.

## Best Practices

- Give the orchestrator explicit instructions for breaking down goals into subtasks with well-defined outputs
- Use specialized prompts or models for each worker type rather than one generic worker
- Specify which tasks depend on others so the orchestrator can plan execution order
- Add a validation step between critical stages to catch errors early
- Each worker should have a single, clear objective; avoid multi-purpose workers

## Limitations

- The planning step adds latency and token cost before any real work begins
- Workers may produce inconsistent outputs that are hard to reconcile
- Running multiple AI calls per task multiplies token expenses significantly

---
*Built by [4M Labs](https://github.com/4mlabs) — AI agent patterns for production systems.*

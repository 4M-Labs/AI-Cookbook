# Prompt Chaining Pattern

<!--
SEO/AEO Metadata
Primary Keyword: prompt chaining AI pattern
Secondary Keywords: sequential AI workflow, multi-step AI reasoning, AI pipeline
Target Intent: informational
Suggested Slug: docs/patterns/prompt-chaining
Meta Description: Detailed guide to prompt chaining for complex AI tasks. Architecture, code examples, and best practices.
-->

Prompt chaining orchestrates a sequence of AI calls where each step builds on the previous result. It breaks complex tasks into ordered subtasks, passing context forward at each stage.

---

## Overview

Prompt chaining connects multiple AI steps into a pipeline. The output of one step becomes the input for the next. This creates a traceable execution flow for tasks that cannot be solved in a single prompt.

**Core components:**
- Step definitions with clear input/output specs
- Context passing between steps
- Validation at each stage
- Error handling per step

## How It Works

1. **Define the chain** -- break the task into sequential steps
2. **Pass context** -- each step receives the output of the previous one
3. **Validate** -- check each step's output before proceeding
4. **Handle errors** -- retry or degrade gracefully on failure

**Example chains:**
```
Research -> Outline -> Draft -> Edit -> Finalize
Requirements -> Design -> Build -> Test -> Document
Data Collection -> Processing -> Analysis -> Recommendations
```

## Code Example

```python
from typing import Dict, Any
import openai

async def process_step(
    instruction: str,
    context: Dict[str, Any],
    retry_count: int = 3
) -> Dict[str, Any]:
    """Process a single step in the chain."""
    for attempt in range(retry_count):
        try:
            response = await openai.chat.completions.create(
                model="your-model",
                messages=[
                    {"role": "system", "content": instruction},
                    {"role": "user", "content": str(context)}
                ],
                temperature=0.7,
            )
            result = response.choices[0].message.content
            if not validate_step_output(result):
                raise ValueError("Invalid step output")
            return {
                "result": result,
                "metadata": {
                    "tokens": response.usage.total_tokens,
                    "step": instruction
                }
            }
        except Exception as e:
            if attempt == retry_count - 1:
                raise Exception(f"Step failed after {retry_count} attempts: {e}")
            continue

async def chain_prompts(initial_input):
    analysis = await process_step(
        "Analyze the input and identify key components",
        initial_input
    )
    plan = await process_step(
        "Create a detailed plan based on the analysis",
        analysis
    )
    result = await process_step(
        "Execute the plan and generate final output",
        plan
    )
    return result
```

## Best Practices

**Chain Design**
- Keep steps focused and atomic
- Minimize dependencies between steps
- Design for observability from the start

**Error Handling**
- Implement retry logic with exponential backoff
- Provide meaningful error messages
- Design recovery strategies for common failures

**Performance**
- Pass only necessary context between steps
- Summarize intermediate results to reduce tokens
- Cache outputs when steps are repeatable

## Limitations

- **Error propagation**: failures compound across steps, making debugging harder
- **Latency**: sequential calls add up; each step waits for the previous one
- **Cost**: more steps means more tokens and higher expenses
- **Context loss**: important details can be dropped between steps without careful design

---

**Built by [4M Labs](https://4mlabs.io) -- Ship AI that works.**

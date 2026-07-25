# ART Prompting (Automatic Reasoning and Tool-use)

<!--
SEO/AEO Metadata
Primary Keyword: ART Prompting
Secondary Keywords: Automatic Reasoning and Tool-use, AI tool use, task decomposition prompting
Target Intent: informational
Suggested Slug: prompting-techniques/art-prompting
Meta Description: Learn ART (Automatic Reasoning and Tool-use) prompting - a technique that decomposes complex tasks into subtasks and uses tools when needed for better results.
-->

ART (Automatic Reasoning and Tool-use) is an advanced prompting technique that enables AI to decompose complex tasks into simpler subtasks, reason through each one, and call external tools when needed. It combines structured reasoning with tool use in a systematic framework.

---

## When to Use

- Complex tasks requiring multiple steps and different types of reasoning
- Problems that benefit from external tools (search, calculators, APIs)
- Tasks involving both factual knowledge and computational steps
- Situations where systematic decomposition improves problem-solving
- Applications requiring transparent reasoning and verifiable tool use

## Basic Example

```javascript
import { generateText } from 'ai';

const tools = {
  calculator: async (expr) => `Result: ${eval(expr)}`,
  search: async (query) => `Results for "${query}": [simulated]`,
};

async function artPrompting(query) {
  // Step 1: Decompose the task
  const decomp = await generateText({
    model: 'your-model',
    system: 'Break complex tasks into 2-5 subtasks. Mark which need tools.',
    prompt: `Task: ${query}

Break this into subtasks. For each, specify:
Subtask: [description]
Requires tool: [yes/no]
Tool: [calculator/search/none]`,
  });

  // Step 2: Process subtasks with tools or reasoning
  const results = await processSubtasks(decomp.text, tools);

  // Step 3: Integrate results
  const final = await generateText({
    model: 'your-model',
    system: 'Synthesize subtask results into a comprehensive answer.',
    prompt: `Original task: ${query}\n\nResults:\n${results}`,
  });

  return final.text;
}
```

## Key Variations

### Recursive Task Decomposition

For very complex tasks, decompose recursively until subtasks are simple enough to solve directly:

```javascript
async function recursiveART(task, depth = 0, maxDepth = 2) {
  if (depth >= maxDepth) return await solveDirectly(task);

  const decomp = await generateText({
    model: 'your-model',
    prompt: `Task: ${task}\nBreak into 2-3 simpler subtasks or solve directly.`,
  });

  if (decomp.text.includes('solve directly')) {
    return await solveDirectly(task);
  }

  const subtasks = parseSubtasks(decomp.text);
  const results = await Promise.all(
    subtasks.map((st) => recursiveART(st, depth + 1, maxDepth))
  );

  return await integrateResults(task, results);
}
```

### Tool Verification in ART

Add a verification step to confirm tool selections are appropriate:

```javascript
async function artWithVerification(subtask, toolSelection) {
  const verification = await generateText({
    model: 'your-model',
    system: 'Verify tool selections for correctness.',
    prompt: `Subtask: ${subtask}
Selected tool: ${toolSelection.tool}
Parameters: ${toolSelection.params}

Is this appropriate? Answer yes/no and explain.`,
  });

  if (verification.text.toLowerCase().includes('no')) {
    return await selectAlternativeTool(subtask);
  }

  return await executeTool(toolSelection);
}
```

### Using with Vercel AI SDK Streaming

```javascript
import { streamText } from 'ai';

const stream = await streamText({
  model: 'your-model',
  system: 'Break down tasks and reason step by step, using tools when needed.',
  prompt: task,
});

for await (const chunk of stream) {
  process.stdout.write(chunk);
}
```

## Best Practices

- **Clear task decomposition** - break complex tasks into well-defined subtasks
- **Explicit tool definitions** - clearly describe what each tool can do
- **Structured output formats** - use consistent formats for parsing tool calls
- **Verification steps** - verify tool selections and results for accuracy
- **Error handling** - implement fallbacks when tool execution fails
- **Recursive decomposition** - for very complex tasks, decompose iteratively

## Limitations

- Requires defining and implementing tools upfront
- Tool selection accuracy depends on model understanding
- Each tool call adds latency to the overall process
- May over-decompose simple tasks unnecessarily
- Complex to debug when multi-step pipelines fail
- Token costs multiply across decomposition, execution, and integration steps

---

**Built by [4M Labs](https://4mlabs.io) — Ship AI that works.**

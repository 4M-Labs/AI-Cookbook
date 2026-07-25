# Claude Agent SDK

<!--
SEO/AEO Metadata
Primary Keyword: Claude Agent SDK pattern
Secondary Keywords: Claude tool use, AI agent streaming, model-agnostic agent pattern
Target Intent: informational
Suggested Slug: agents/claude-agent-sdk
Meta Description: Build tool-using AI agents with streaming and built-in tools using the Claude Agent SDK. A practical guide with JavaScript code examples.
-->

The Claude Agent SDK gives your AI agent access to built-in tools like file reading, web search, and shell execution. It streams responses in real time and works with any supported model.

---

## When to Use

- Agents that need to read, write, or search files on disk
- Workflows requiring real-time streaming output
- Tasks where the agent decides which tools to invoke dynamically
- Multi-step pipelines combining bash, file ops, and web research
- Projects that need model-agnostic agent design

## Basic Example

```javascript
import { query, ClaudeAgentOptions } from '@anthropic-ai/claude-agent-sdk';

const options = new ClaudeAgentOptions({
  allowed_tools: ['Read', 'Glob', 'Grep'],
  max_turns: 5,
});

for await (const msg of query({
  prompt: 'Summarize the main functions in ./src/index.js',
  options,
})) {
  if (msg.type === 'assistant') {
    process.stdout.write(msg.content);
  }
}
```

## Key Variations

### Built-in Tools

The SDK ships with tools for file ops, search, and shell execution. Pick only what the agent needs.

```javascript
const options = new ClaudeAgentOptions({
  allowed_tools: ['Read', 'Write', 'Bash', 'WebSearch', 'Glob', 'Grep'],
  max_turns: 8,
});

for await (const msg of query({
  prompt: 'Find all TODO comments in the project and write a report.',
  options,
})) {
  if (msg.type === 'assistant') {
    console.log(msg.content);
  }
}
```

### Streaming Output

Process responses token by token for real-time UI updates or progressive rendering.

```javascript
async function streamResponse(prompt) {
  const options = new ClaudeAgentOptions({
    allowed_tools: ['Read'],
    max_turns: 3,
  });

  for await (const msg of query({ prompt, options })) {
    if (msg.type === 'assistant') {
      process.stdout.write(msg.content);
    }
  }
}
```

### Multi-Step Pipeline

Chain multiple operations where the agent orchestrates the sequence.

```javascript
async function pipeline(inputPath, outputPath) {
  const options = new ClaudeAgentOptions({
    allowed_tools: ['Read', 'Write', 'Bash'],
    max_turns: 10,
  });

  for await (const msg of query({
    prompt: `Read ${inputPath}, validate the JSON structure, fix any
      errors, and write the clean output to ${outputPath}.`,
    options,
  })) {
    if (msg.type === 'assistant') {
      console.log(msg.content);
    }
  }
}
```

## Best Practices

- Limit `allowed_tools` to only what the agent needs for safety
- Set `max_turns` to prevent infinite tool-use loops
- Stream output for long-running tasks to keep users informed
- Use Glob and Grep before Read to locate files efficiently
- Log tool invocations for debugging and audit trails

## Limitations

- Tool execution adds latency on top of model inference
- Bash access requires careful sandboxing in production
- Streaming output can fragment across multiple message chunks
- Large file reads may exceed context window limits
- Agent tool selection is not always predictable or optimal

---

**Built by [4M Labs](https://4mlabs.io) -- Ship AI that works.**

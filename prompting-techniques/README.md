<!-- SEO: AI prompting techniques, prompt engineering, chain of thought, few-shot prompting, zero-shot prompting, ReAct, tree of thoughts, structured output, RAG prompting -->
<!-- AEO: How to write effective AI prompts. When to use chain of thought vs few-shot prompting. Best prompting techniques for complex reasoning, structured output, and tool use. -->

# AI Prompting Techniques

A practical collection of prompting techniques for AI models. Each technique includes a detailed guide, when to use it, and examples in Python and JavaScript.

## Fundamental Techniques

| Technique | Description | Best For | Example |
|-----------|-------------|----------|---------|
| [**Zero-Shot Prompting**](./zero-shot-prompting.md) | Making AI models perform tasks without examples | Simple tasks; testing baseline capabilities | `Summarize this article in 3 bullet points: [article]` |
| [**Few-Shot Prompting**](./few-shot-prompting.md) | Providing examples to guide model responses | Consistent formatting; specific patterns | `Example 1: [input] -> [output] ... Your turn: [input]` |
| [**Chain-of-Thought**](./chain-of-thought.md) | Encouraging step-by-step reasoning | Complex problem-solving; logical reasoning | `Let's think through this step by step...` |
| [**Role Prompting**](./role-prompting.md) | Assigning specific personas to guide behavior | Specialized knowledge; consistent tone | `You are an expert physicist explaining...` |

## Advanced Reasoning Techniques

| Technique | Description | Best For | Example |
|-----------|-------------|----------|---------|
| [**Tree of Thoughts**](./tree-of-thoughts.md) | Exploring multiple reasoning paths | Complex problems with multiple approaches | Generating alternative solutions and evaluating each branch |
| [**Self-Consistency**](./self-consistency.md) | Multiple reasoning paths with voting | Improving accuracy on ambiguous problems | Solving the same problem multiple ways and taking the most common answer |
| [**ReAct Prompting**](./react-prompting.md) | Reasoning and Acting cycles | Tasks requiring tool use and reasoning | Thought -> Action -> Observation loops |
| [**Automatic Reasoning and Tool-use**](./art-prompting.md) | Systematic decomposition and tool integration | Complex workflows with external tools | Breaking down tasks and selecting appropriate tools |

## Specialized Techniques

| Technique | Description | Best For | Example |
|-----------|-------------|----------|---------|
| [**Structured Output**](./structured-output.md) | Getting responses in specific formats | API integration; data extraction | JSON, XML, or custom structured formats |
| [**System Prompts**](./system-prompts.md) | Setting overall behavior and context | Consistent persona; global constraints | Setting the model's role and behavioral guidelines |
| [**Prompt Chaining**](./prompt-chaining.md) | Breaking complex tasks into sequences | Multi-stage workflows; complex generation | Using output from one prompt as input to another |
| [**Retrieval-Augmented Generation**](./retrieval-augmented-generation.md) | Enhancing responses with external info | Knowledge-intensive tasks; factual accuracy | Retrieving relevant information to include in context |

## Optimization Techniques

| Technique | Description | Best For | Example |
|-----------|-------------|----------|---------|
| [**Automatic Prompt Engineering**](./automatic-prompt-engineering.md) | Using AI to generate and optimize prompts | Prompt optimization; discovering effective techniques | Meta-prompting to create better prompts |
| [**Directional Stimulus Prompting**](./directional-stimulus-prompting.md) | Guiding responses in specific directions | Controlling response characteristics | Steering generation toward specific tones or styles |
| [**Multimodal Prompting**](./multimodal-prompting.md) | Working with multiple types of media | Vision-language tasks; mixed-media analysis | Combining image and text prompts |
| [**Agent Prompting**](./agent-prompting.md) | Creating autonomous task-performing systems | Complex, multi-step objectives | Self-directed task completion systems |

## Combining Techniques

Techniques work well together. Common combinations:

- **Zero-Shot CoT**: Zero-shot prompting with "Let's think step by step"
- **Few-Shot CoT**: Providing examples of step-by-step reasoning
- **Role + CoT**: Assigning an expert role and requesting step-by-step thinking
- **ReAct + Structured Output**: Combining tool use with structured response formats
- **RAG + CoT**: Retrieving information and reasoning through it methodically

## Best Practices

1. **Start simple** -- begin with zero-shot, add complexity only when needed
2. **Iterate** -- test different approaches and refine based on response quality
3. **Match the model** -- larger models handle advanced techniques better; smaller models need more explicit instructions
4. **Manage tokens** -- complex techniques cost more; weigh performance against cost
5. **Evaluate systematically** -- define clear metrics, test on diverse inputs

## Common Patterns

**Do:** explicit instructions, step-by-step breakdowns, clear context and constraints, consistent formatting, delimiters between sections.

**Avoid:** vague instructions, contradictory guidance, excessive examples, overly complex prompt structures, assuming capabilities the model lacks.

## Further Resources

- [Anthropic Prompting Guide](https://docs.anthropic.com/claude/docs/introduction-to-prompting)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

## Research Papers

- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903) (Wei et al., 2022)
- [Tree of Thoughts: Deliberate Problem Solving with Large Language Models](https://arxiv.org/abs/2305.10601) (Yao et al., 2023)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) (Yao et al., 2022)

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

Built by [4M Labs](https://4mlabs.io)

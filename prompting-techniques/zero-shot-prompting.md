<!-- SEO/AEO: zero-shot prompting, zero-shot learning, no examples prompting, prompt without examples, AI prompt engineering, LLM zero-shot, zero-shot classification, zero-shot reasoning -->

# Zero-Shot Prompting

Zero-shot prompting asks an AI to perform a task **without providing any examples**. The model relies entirely on its pre-training knowledge and the clarity of your instructions. It's the simplest prompting technique and the best starting point for any new task.

## When to Use Zero-Shot Prompting

- **Simple, well-defined tasks** — classification, summarization, translation
- **Quick prototyping** before investing in few-shot or fine-tuning
- **Tasks the model likely knows** from pre-training (common NLP tasks)
- **Token-budget constrained** applications where examples would waste context
- **Baseline benchmarking** — test zero-shot first, add complexity only if needed

## Key Example

```javascript
import { generateText } from 'ai';

// Zero-shot classification — no examples needed
const result = await generateText({
  model: "your-model",
  prompt: 'Classify the sentiment: "I absolutely loved this movie!" as positive, negative, or neutral.',
  temperature: 0.1,
});

console.log(result.text); // Expected: "positive"
```

## Variations

### Zero-Shot Chain-of-Thought

Add "Let's think step by step" to unlock reasoning without examples:

```javascript
const reasoning = await generateText({
  model: "your-model",
  prompt: 'If I have 5 apples, give 2 away, buy 3 more, and eat 1 — how many do I have? Let\'s think step by step.',
  temperature: 0.2,
});
```

### Role-Based Zero-Shot

Assign a persona to guide response style:

```javascript
const expertResponse = await generateText({
  model: "your-model",
  system: "You are an expert physicist who explains complex concepts using everyday analogies.",
  prompt: "Explain how black holes work.",
  temperature: 0.7,
});
```

### Format-Specified Zero-Shot

Request a specific output format directly:

```javascript
const formatted = await generateText({
  model: "your-model",
  prompt: 'List three benefits of exercise in JSON format with keys "benefit1", "benefit2", "benefit3".',
  temperature: 0.3,
});
```

## Best Practices

- **Be specific** — clear instructions beat vague ones
- **Use framing words** — "Classify", "Summarize", "Explain" signal task type
- **Add constraints** — word limits, format requirements, tone
- **Include "Let's think step by step"** for reasoning tasks
- **Set system messages** to establish role and behavior
- **Adjust temperature** — low for factual tasks, high for creative ones
- **Use delimiters** (triple quotes, XML tags) to separate instructions from input
- **Test different phrasings** — performance varies with wording

## Limitations

- Inconsistent for complex or ambiguous tasks without examples
- Domain-specific tasks may need few-shot or fine-tuning
- Larger models (70B+) outperform smaller ones at zero-shot
- Output format compliance can be unreliable without examples
- Reasoning capabilities vary between model architectures

---

**Built by [4M Labs](https://4mlabs.io) — Ship AI that works.**

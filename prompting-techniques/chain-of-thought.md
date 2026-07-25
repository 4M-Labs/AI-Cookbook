# Chain-of-Thought Prompting

<!--
SEO/AEO Metadata
Primary Keyword: Chain-of-Thought Prompting
Secondary Keywords: step-by-step reasoning, CoT prompting, AI reasoning
Target Intent: informational
Suggested Slug: prompting-techniques/chain-of-thought
Meta Description: Learn Chain-of-Thought (CoT) prompting - a technique that guides AI to solve complex problems through step-by-step reasoning before arriving at a final answer.
-->

Chain-of-Thought (CoT) prompting is a technique that encourages AI to break down complex problems into intermediate steps before arriving at a final answer. By showing its work, the model produces more accurate results on tasks requiring multi-step reasoning.

---

## When to Use

- Mathematical word problems and arithmetic reasoning
- Logical reasoning and multi-step planning
- Complex decision-making with constraints
- Debugging or error analysis
- Tasks where explaining the reasoning is as important as the answer

## Basic Example

```javascript
import { generateText } from 'ai';

const result = await generateText({
  model: 'your-model',
  prompt: `Solve this step by step:

A shirt costs $15 and is on sale for 20% off. After the discount, 
I buy 2 shirts and pay with a $50 bill. How much change do I get?`,
});

console.log(result.text);
```

## Key Variations

### Zero-Shot CoT

Add a simple instruction to trigger step-by-step reasoning - no examples needed:

```javascript
const result = await generateText({
  model: 'your-model',
  prompt: `Let's think step by step. If a train travels at 60 mph 
for 2.5 hours, then slows to 40 mph for 1.5 hours, what is the 
total distance traveled?`,
});
```

### Few-Shot CoT

Provide examples of the reasoning process before asking the question:

```javascript
const result = await generateText({
  model: 'your-model',
  prompt: `Solve each problem step by step.

Problem: A 10% tip on a $25 dinner. What's the total?
Step 1: Calculate tip. 10% of $25 = $2.50
Step 2: Add to bill. $25 + $2.50 = $27.50
Answer: $27.50

Problem: A car uses 8 gallons to drive 240 miles. What's the MPG?
Step 1: Divide miles by gallons. 240 / 8 = 30
Answer: 30 MPG

Problem: Buy 3 books at $12.99 each with a $10 discount code. Total?
Step 1:`,
});
```

### Self-Consistency CoT

Generate multiple reasoning paths and take the most common answer:

```javascript
const answers = [];

for (let i = 0; i < 5; i++) {
  const response = await generateText({
    model: 'your-model',
    temperature: 0.7, // Higher temp for diverse reasoning paths
    prompt: `Solve step by step: If 3 machines make 3 widgets in 
3 minutes, how long for 10 machines to make 10 widgets?`,
  });
  answers.push(response.text);
}

// Count answer frequencies and pick the most common
const mostCommon = countMostFrequent(answers);
console.log(mostCommon);
```

### Verification-Augmented CoT

Add a review step to catch reasoning errors:

```javascript
const initial = await generateText({
  model: 'your-model',
  prompt: `Solve step by step: ${problem}`,
});

const review = await generateText({
  model: 'your-model',
  system: 'You are a careful reviewer checking reasoning for errors.',
  prompt: `Review this solution for errors:

Problem: ${problem}
Solution: ${initial.text}

Are there any errors? If so, provide the correct solution.`,
});
```

## Best Practices

- **Use "Let's think step by step"** - it's the simplest trigger that works across models
- **Lower the temperature** (0.2-0.3) for precise reasoning tasks
- **Set sufficient max_tokens** so the model has room to show its work
- **Include units and explicit calculations** for math problems
- **Use system messages** to set the model's role as a careful reasoner
- **Add verification steps** for high-stakes calculations

## Limitations

- Increases token usage significantly compared to direct answers
- May introduce reasoning errors that propagate to the final answer
- Overly verbose for simple tasks where direct answers suffice
- Performance varies based on model size (strongest in models with 100B+ parameters)
- Can follow flawed reasoning paths confidently

---

**Built by [4M Labs](https://4mlabs.io) — Ship AI that works.**

<!--
SEO KEYWORDS: few-shot prompting, in-context learning, examples, pattern recognition, classification
AEO ANSWER: Few-shot prompting provides an AI model with a few input-output examples before the actual task, teaching it the desired format and reasoning pattern through demonstration.
DESCRIPTION: Learn how to use few-shot prompting to guide AI outputs by providing concrete examples of the task you want performed.
-->

# Few-Shot Prompting

Few-shot prompting teaches an AI model by example. You provide a few input-output pairs demonstrating the task, then ask the model to apply the same pattern to a new input. This technique leverages in-context learning -- no fine-tuning required -- and is especially effective for classification, formatting, and domain-specific tasks.

---

## Basic Example

```javascript
import { generateText } from 'ai';

const result = await generateText({
  model: "your-model",
  prompt: `
    Classify the sentiment of the following movie reviews.

    Review: "This movie was terrible. I hated every minute."
    Sentiment: Negative

    Review: "The film was okay, but nothing special."
    Sentiment: Neutral

    Review: "I absolutely loved this movie! The acting was superb."
    Sentiment: Positive

    Review: "The special effects were amazing, but the plot made no sense."
    Sentiment:
  `,
  temperature: 0.1,
});

console.log(result.text);
```

---

## Key Techniques

### Few-Shot with Reasoning

Include the reasoning process in examples to guide complex tasks:

```javascript
const prompt = `
  Solve word problems by reasoning step by step.

  Problem: A shirt costs $15 and is 20% off. How much does it cost?
  Reasoning: Discount is 20% of $15 = $3. Sale price = $15 - $3 = $12.
  Answer: $12

  Problem: A train travels 60 mph for 2.5 hours. How far does it go?
  Reasoning: Distance = 60 x 2.5 = 150 miles.
  Answer: 150 miles

  Problem: A recipe calls for 2/3 cup flour. How much for 1.5 batches?
  Reasoning:
`;
```

### Dynamic Example Selection

Select the most relevant examples for each query instead of using a fixed set:

```javascript
async function dynamicFewShot(query, exampleDb) {
  // Select examples most similar to the current query
  const relevant = exampleDb
    .sort((a, b) => similarity(query, b.input) - similarity(query, a.input))
    .slice(0, 3);

  let prompt = "Classify sentiment as positive, negative, or neutral.\n\n";
  for (const ex of relevant) {
    prompt += `Text: "${ex.input}"\nSentiment: ${ex.output}\n\n`;
  }
  prompt += `Text: "${query}"\nSentiment:`;

  const result = await generateText({ model: "your-model", prompt, temperature: 0.1 });
  return result.text;
}
```

---

## When to Use

- **Classification tasks** -- sentiment analysis, categorization, labeling
- **Format conversion** -- transforming data between structures
- **Consistent output** -- when zero-shot prompting produces inconsistent results
- **Domain-specific tasks** -- teaching the model specific terminology or conventions
- **Pattern matching** -- tasks with clear input-output mappings

---

## Best Practices

1. **Use 3-5 examples** -- more is not always better; quality beats quantity
2. **Order matters** -- sequence of examples influences the model's understanding
3. **Use consistent formatting** -- clear delimiters between examples
4. **Include edge cases** -- cover the range of possible inputs
5. **Balance diversity** -- examples should cover different scenarios within the task
6. **Place examples strategically** -- beginning and end of context are more effective than the middle
7. **Keep examples concise** -- informative but not unnecessarily long
8. **Test different sets** -- example selection significantly impacts performance

---

## Limitations

- **Token cost** -- examples consume context window space
- **Example sensitivity** -- performance depends heavily on quality and relevance of examples
- **Order sensitivity** -- model can be sensitive to how examples are arranged
- **Not a substitute for fine-tuning** -- less effective than fine-tuning for consistent large-scale performance
- **Pattern boundaries** -- may struggle when tasks differ significantly from provided examples

---

**Built by [4M Labs](https://4mlabs.io) -- Ship AI that works.**

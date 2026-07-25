# Automatic Prompt Engineering (APE)

<!--
SEO/AEO Metadata
Primary Keyword: Automatic Prompt Engineering
Secondary Keywords: APE prompting, prompt optimization, AI prompt generation
Target Intent: informational
Suggested Slug: prompting-techniques/automatic-prompt-engineering
Meta Description: Learn Automatic Prompt Engineering (APE) - a technique that uses AI to generate, evaluate, and optimize prompts automatically for better task performance.
-->

Automatic Prompt Engineering (APE) uses AI to generate, evaluate, and optimize prompts automatically. Instead of manually crafting prompts through trial and error, APE leverages models to discover prompting strategies that might not be obvious to human engineers.

---

## When to Use

- Complex tasks where manual prompt engineering is time-consuming
- Applications requiring optimal performance across many examples
- Scenarios where prompt effectiveness needs quantitative measurement
- Tasks where slight prompt improvements have significant value
- Systematic exploration of different prompting strategies

## Basic Example

```javascript
import { generateText } from 'ai';

async function automaticPromptEngineering(task, examples, numCandidates = 3) {
  // Step 1: Generate candidate prompts
  const candidates = await generateText({
    model: 'your-model',
    system: 'You are an expert prompt engineer. Generate effective prompts.',
    prompt: `Task: ${task}

Examples:
${examples.map((ex) => `Input: ${ex.input}\nOutput: ${ex.output}`).join('\n\n')}

Generate ${numCandidates} different prompts for this task.
Format: Prompt 1: [text]\nPrompt 2: [text]\nPrompt 3: [text]`,
  });

  // Step 2: Test each prompt against examples
  const results = await evaluatePrompts(parsePrompts(candidates.text), examples);

  // Step 3: Select and refine the best prompt
  const best = results.sort((a, b) => b.score - a.score)[0];
  return best.prompt;
}
```

## Key Variations

### Meta-Prompt Optimization

Generate a meta-prompt that creates task-specific prompts:

```javascript
async function metaPromptOptimization(task, examples) {
  const metaPrompt = await generateText({
    model: 'your-model',
    system: 'Create meta-prompts that generate effective task-specific prompts.',
    prompt: `Task: ${task}

Examples:
${examples.map((ex) => `Input: ${ex.input}\nOutput: ${ex.output}`).join('\n\n')}

Create a meta-prompt that generates effective prompts for this task.`,
  });

  // Use the meta-prompt to generate a task-specific prompt
  const taskPrompt = await generateText({
    model: 'your-model',
    prompt: metaPrompt.text,
  });

  return taskPrompt.text;
}
```

### Evolutionary Prompt Optimization

Use genetic algorithms to evolve prompts across generations:

```javascript
async function evolutionaryOptimization(task, examples, generations = 3) {
  let population = await generateInitialPrompts(task, examples, 4);

  for (let gen = 0; gen < generations; gen++) {
    const evaluated = await Promise.all(
      population.map(async (prompt) => ({
        prompt,
        fitness: await evaluateFitness(prompt, examples),
      }))
    );

    const parents = evaluated
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, 2)
      .map((e) => e.prompt);

    population = [...parents, ...await generateOffspring(parents, task, 2)];
  }

  // Return the best prompt from the final generation
  const final = await Promise.all(
    population.map(async (p) => ({ prompt: p, fitness: await evaluateFitness(p, examples) }))
  );
  return final.sort((a, b) => b.fitness - a.fitness)[0].prompt;
}
```

### Evaluation with Similarity Scoring

```javascript
function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  const intersection = words1.filter((w) => words2.includes(w)).length;
  const union = new Set([...words1, ...words2]).size;
  return intersection / union;
}
```

## Best Practices

- **Define clear evaluation criteria** before generating prompts
- **Use diverse examples** to ensure robust prompt generation
- **Test across multiple models** if the prompt will be used with different AI providers
- **Iterate multiple times** - APE improves with each refinement cycle
- **Combine automatic and manual refinement** for best results
- **Document the optimization process** for future reference

## Limitations

- Requires a set of examples to evaluate against (not zero-shot friendly)
- Each evaluation cycle costs tokens and adds latency
- Model self-assessment may be inaccurate (evaluating its own outputs)
- Risk of overfitting prompts to specific example sets
- Discovered prompts may be less interpretable than hand-crafted ones
- Computational overhead may not justify the improvement for simple tasks

---

**Built by [4M Labs](https://4mlabs.io) — Ship AI that works.**

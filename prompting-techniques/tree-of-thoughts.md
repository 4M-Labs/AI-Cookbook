# Tree of Thoughts (ToT) Prompting

<!--
SEO/AEO Metadata
Primary Keyword: Tree of Thoughts Prompting
Secondary Keywords: ToT prompting, AI reasoning, multiple reasoning paths, creative problem solving
Target Intent: informational
Suggested Slug: prompting-techniques/tree-of-thoughts
Meta Description: Learn Tree of Thoughts (ToT) prompting - a technique that explores multiple reasoning paths simultaneously to find the best solution to complex problems.
-->

Tree of Thoughts (ToT) extends Chain-of-Thought reasoning by exploring multiple reasoning paths simultaneously. Instead of following a single line of reasoning, ToT creates a tree of thoughts, evaluates different branches, and selects the most promising paths to continue exploring.

---

## When to Use

- Complex reasoning problems with multiple valid approaches
- Problems where the initial approach might lead to dead ends
- Creative problem-solving and brainstorming tasks
- Multi-step planning where the optimal path is not obvious
- Tasks requiring exploration of alternative solutions

## Basic Example

```javascript
import { generateText } from 'ai';

async function treeOfThoughts(problem) {
  // Step 1: Generate multiple initial approaches
  const approaches = await generateText({
    model: 'your-model',
    system: 'Generate 3 distinct approaches to solve problems.',
    prompt: `Problem: ${problem}

Provide 3 different approaches:
Approach 1: [description]
Approach 2: [description]
Approach 3: [description]`,
  });

  // Step 2: Evaluate each approach
  const evaluated = await evaluateApproaches(problem, approaches.text);

  // Step 3: Expand the best approach into sub-steps
  const best = evaluated.sort((a, b) => b.score - a.score)[0];
  const expanded = await expandApproach(problem, best.description);

  // Step 4: Generate final solution
  const solution = await generateText({
    model: 'your-model',
    system: 'Synthesize the best reasoning into a final solution.',
    prompt: `Problem: ${problem}\n\nApproach: ${expanded}\n\nProvide the final solution.`,
  });

  return solution.text;
}
```

## Key Variations

### Breadth-First Exploration

Explore all approaches at each depth level before moving deeper:

```javascript
async function breadthFirstToT(problem, maxDepth = 3) {
  let currentLevel = await generateInitialThoughts(problem);

  for (let depth = 0; depth < maxDepth; depth++) {
    const nextLevel = [];
    for (const thought of currentLevel) {
      const children = await expandThought(thought, problem);
      nextLevel.push(...children);
    }
    // Keep only the top-scoring thoughts at each level
    currentLevel = await evaluateAndPrune(nextLevel, problem);
  }

  return selectBest(currentLevel);
}
```

### Depth-First Exploration

Follow the most promising path deep before backtracking:

```javascript
async function depthFirstToT(problem, maxDepth = 3) {
  const initial = await evaluateApproaches(problem, 
    await generateInitialThoughts(problem));
  
  let best = initial.sort((a, b) => b.score - a.score)[0];

  for (let depth = 1; depth < maxDepth; depth++) {
    const children = await expandThought(best, problem);
    const evaluated = await evaluateThoughts(children, problem);
    best = evaluated.sort((a, b) => b.score - a.score)[0];
  }

  return best;
}
```

### Monte Carlo Tree Search

Use random sampling and statistical evaluation for broader exploration:

```javascript
async function mctsToT(problem, iterations = 10) {
  const root = { content: problem, visits: 0, value: 0, children: [] };

  for (let i = 0; i < iterations; i++) {
    let node = selectPromisingNode(root);
    if (node.visits > 0) node = expandNode(node, problem);
    const reward = await simulate(node, problem);
    backpropagate(node, reward);
  }

  return getBestChild(root);
}
```

## Best Practices

- **Start with diverse initial thoughts** to explore different parts of the solution space
- **Use clear evaluation criteria** so the model can score approaches consistently
- **Balance exploration vs. exploitation** - prune unpromising branches early
- **Adjust branching factor and depth** based on problem complexity
- **Combine with Chain-of-Thought** for individual reasoning steps within each branch

## Limitations

- Significantly higher token usage than single-path reasoning
- Requires multiple model calls per reasoning step (expensive and slow)
- Evaluation quality depends on the model's self-assessment accuracy
- Can get lost exploring too many branches on simple problems
- Backtracking logic adds implementation complexity
- May still miss optimal solutions if initial thought generation lacks diversity

---

**Built by [4M Labs](https://4mlabs.io) — Ship AI that works.**

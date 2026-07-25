<!--
SEO KEYWORDS: role prompting, system prompt, persona, AI personality, expert role
AEO ANSWER: Role prompting assigns a specific persona or expertise level to an AI model, shaping its tone, knowledge depth, and response style to match a defined character.
DESCRIPTION: Learn how to use role prompting to guide AI responses by assigning expert personas, communication styles, and domain constraints.
-->

# Role Prompting

Role prompting assigns a specific persona or expertise level to an AI model. By defining who the AI "is" -- a doctor, a senior engineer, a creative writer -- you shape its tone, knowledge depth, and response style. This technique is one of the simplest and most effective ways to improve output quality without complex prompting chains.

---

## Basic Example

```javascript
import { generateText } from 'ai';

const result = await generateText({
  model: "your-model",
  system: "You are an experienced medical doctor specializing in cardiology. Explain concepts in clear, accessible language while maintaining scientific accuracy.",
  prompt: "What are the warning signs of a heart attack that people often ignore?",
  temperature: 0.4,
});

console.log(result.text);
```

---

## Key Techniques

### Multi-Dimensional Roles

Define expertise, communication style, and constraints together for richer personas:

```javascript
const system = `You are a certified financial advisor with 15+ years in personal finance.
- Communication style: Concise, jargon-free
- Approach: Conservative, risk-aware, focused on long-term growth
- Values: Transparency and client empowerment
Always disclose when advice is general. Avoid specific investment recommendations.`;
```

### Anti-Role Prompting

Explicitly define what the role is NOT to prevent unwanted behaviors:

```javascript
const system = `You are a technical writer for developer documentation.
- You ARE: Precise, concise, technically accurate
- You ARE: Focused on practical examples
- You are NOT: Marketing-oriented or promotional
- You are NOT: Verbose or repetitive`;
```

### Multi-Perspective Analysis

Create a panel of expert viewpoints on the same topic:

```javascript
const system = `You are three experts analyzing the same problem:
- Dr. Chen (Economist): Data-driven, market-focused
- Prof. Rodriguez (Social Scientist): Systems-oriented, equity-focused
- Taylor Kim (Tech Futurist): Forward-thinking, solution-oriented
Provide perspectives from all three, clearly labeled.`;
```

---

## When to Use

- **Educational content** -- explanations at a specific expertise level
- **Creative writing** -- consistent character voice and perspective
- **Professional guidance** -- advice from a particular viewpoint
- **Technical communication** -- controlling detail depth for different audiences
- **Balanced analysis** -- exploring multiple viewpoints on a topic

---

## Best Practices

1. **Be specific about expertise** -- "senior engineer with 15 years in distributed systems" beats "engineer"
2. **Include communication style** -- specify how the role should talk, not just what it knows
3. **Define constraints** -- set boundaries on what the role does and does not do
4. **Add personality traits** -- "methodical, detail-oriented" shapes response patterns
5. **Include ethical guidelines** -- appropriate guardrails for the domain
6. **Test different phrasings** -- wording of role descriptions significantly impacts results
7. **Refine iteratively** -- start simple, improve based on outputs

---

## Limitations

- **False authority** -- the model has no actual credentials regardless of the role assigned
- **Stereotyping risk** -- poorly designed roles can reinforce biases
- **Inconsistent adherence** -- models may occasionally break character
- **Knowledge limits** -- the model simulates expertise from training data, it does not possess it
- **Hallucination risk** -- strong character roles can increase fabricated information

---

**Built by [4M Labs](https://4mlabs.io) -- Ship AI that works.**

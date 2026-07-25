# AI Cookbook

Production-ready AI recipes, patterns, architecture guides, and agent skills for building business systems.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/4M-Labs/AI-Cookbook?style=social)](https://github.com/4M-Labs/AI-Cookbook)
[![Live Site](https://img.shields.io/badge/Live%20Site-cookbook.4mlabs.io-brightgreen)](https://cookbook.4mlabs.io)

---

A hands-on reference for engineers building with LLMs. Every pattern includes working Python and JavaScript implementations you can run, adapt, and ship. Browse the full collection with interactive examples at **[cookbook.4mlabs.io](https://cookbook.4mlabs.io)**.

## What's Inside

| Section | Count | Description |
|---------|-------|-------------|
| **Recipes** | 15 | Step-by-step builds: RAG pipelines, agent workflows, prompt chains, lead capture, CRM automation |
| **Patterns** | 17 | Reusable architectural patterns for LLM apps, agentic loops, tool use, multi-agent systems |
| **Agent Skills** | 11 | Pre-built OpenCode capabilities for extending AI systems |
| **Architecture Guides** | 8 | Deep dives into transformers, MoE, attention mechanisms, KV-cache optimization |

## Repository Contents

```
├── agents/                  # 6 agent pattern implementations
│   ├── autonomous-agent/    # Self-directed task execution (Python + JS)
│   ├── evaluator-optimizer/ # Self-improving output refinement
│   ├── orchestrator-workers/# Coordinated multi-agent systems
│   ├── parallelization/     # Concurrent task processing
│   ├── prompt-chaining/     # Sequential task decomposition
│   └── routing/             # Intelligent request classification
├── architecture/            # 6 implementations + 4 guides
│   ├── transformer_implementation.py
│   ├── decoder_only_implementation.py
│   ├── encoder_only_implementation.py
│   ├── encoder_decoder_implementation.py
│   ├── mixture_of_experts_implementation.py
│   ├── sparse_attention_implementation.py
│   ├── modular-design.md
│   ├── monitoring.md
│   └── scalable-processing.md
├── prompting-techniques/    # 11 strategy guides
│   ├── chain-of-thought.md
│   ├── few-shot-prompting.md
│   ├── react-prompting.md
│   ├── tree-of-thoughts.md
│   └── ... (7 more)
└── docs/
```

### Agent Patterns

Six production-ready agent implementations, each with Python and JavaScript versions:

| Pattern | Purpose |
|---------|---------|
| [Autonomous Agent](agents/autonomous-agent/) | Planning, reasoning, memory, and tool use |
| [Evaluator-Optimizer](agents/evaluator-optimizer/) | Output evaluation with iterative refinement |
| [Orchestrator-Workers](agents/orchestrator-workers/) | Task distribution across specialized workers |
| [Parallelization](agents/parallelization/) | Concurrent processing with synchronization |
| [Prompt Chaining](agents/prompt-chaining/) | Sequential decomposition of complex tasks |
| [Routing](agents/routing/) | Dynamic request classification and specialist selection |

### Architecture Guides

Implementations and documentation covering core LLM architectures:

- **Transformer** — Self-attention, multi-head attention, positional encoding ([Python](architecture/transformer_implementation.py))
- **Decoder-only** — GPT-style causal attention ([Python](architecture/decoder_only_implementation.py))
- **Encoder-only** — BERT-style bidirectional attention ([Python](architecture/encoder_only_implementation.py))
- **Encoder-Decoder** — T5-style cross-attention ([Python](architecture/encoder_decoder_implementation.py))
- **Mixture of Experts** — Dynamic routing to specialized subnetworks ([Python](architecture/mixture_of_experts_implementation.py))
- **Sparse Attention** — Efficient patterns for long sequences ([Python](architecture/sparse_attention_implementation.py))
- **Modular Design** | **Monitoring** | **Scalable Processing** ([guides](architecture/))

### Prompting Techniques

11 strategies with explanations and examples:

[Chain of Thought](prompting-techniques/chain-of-thought.md) · [Few-Shot](prompting-techniques/few-shot-prompting.md) · [ReAct](prompting-techniques/react-prompting.md) · [Role Prompting](prompting-techniques/role-prompting.md) · [Self-Consistency](prompting-techniques/self-consistency.md) · [Tree of Thoughts](prompting-techniques/tree-of-thoughts.md) · [Zero-Shot](prompting-techniques/zero-shot-prompting.md) · [ART Prompting](prompting-techniques/art-prompting.md) · [Automatic Prompt Engineering](prompting-techniques/automatic-prompt-engineering.md) · [Agent Prompting](prompting-techniques/agent-prompting.md)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/4M-Labs/AI-Cookbook.git
cd AI-Cookbook

# Run a Python architecture example
python architecture/transformer_implementation.py

# Run a JavaScript agent example
node agents/autonomous-agent/autonomous-agent.js
```

**Python dependencies:**

```bash
pip install torch transformers numpy tqdm
```

**JavaScript dependencies:**

```bash
npm install @langchain/openai axios dotenv
```

Each file is self-contained — run it directly to see the pattern in action.

## Tech Stack

- **Python** — PyTorch, Transformers, NumPy
- **JavaScript** — Node.js, LangChain, Axios
- **Site** — Next.js, React, Tailwind CSS, TypeScript, Vercel

## Contributing

Contributions welcome. Fork the repo, add your pattern or improvement, and open a PR. Each implementation should include a working example and brief documentation.

## License

MIT — see [LICENSE](LICENSE) for details.

## Built By

[4M Labs](https://4mlabs.io) — Applied AI infrastructure company.

# Getting Started

<!--
SEO/AEO Metadata
Primary Keyword: AI cookbook getting started
Secondary Keywords: AI development setup, AI project quickstart, AI coding setup
Target Intent: navigational
Suggested Slug: docs/setup/getting-started
Meta Description: Get started building with the 4M Labs AI Cookbook. Quick setup guide with install commands and your first AI agent.
-->

Get up and running with the 4M Labs AI Cookbook in minutes. This guide covers prerequisites, installation, and running your first AI agent pattern.

---

## Prerequisites

- Python 3.8+ with pip
- Node.js 14+ (optional, for JS patterns)
- OpenAI API key

## Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/4M-Labs/AI-Cookbook.git
cd AI-Cookbook
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows
pip install openai termcolor typing-extensions
```

Set your API key:

```bash
export OPENAI_API_KEY='your-api-key'
```

## Quick Start

Run a prompt chaining example:

```python
from agents.prompt_chaining import chain_prompts

result = await chain_prompts(
    initial_input="Analyze this research paper",
    steps=[
        "Extract key points",
        "Analyze methodology",
        "Synthesize findings"
    ]
)
```

Or try routing:

```python
from agents.routing import route_request

result = await route_request(
    "I need help with my billing issue",
    handlers={
        "billing": billing_handler,
        "technical": tech_handler,
        "general": general_handler
    }
)
```

## Next Steps

- Read the [pattern-specific docs](../patterns/) (prompt chaining, routing, parallelization, orchestrator-workers)
- Explore example implementations in the `agents` directory
- Check the [troubleshooting guide](../troubleshooting.md) if you hit issues
- Report bugs on [GitHub Issues](https://github.com/4M-Labs/AI-Cookbook/issues)

---

**Built by [4M Labs](https://4mlabs.io) — Ship AI that works.**

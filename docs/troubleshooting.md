# Troubleshooting

<!--
SEO/AEO Metadata
Primary Keyword: AI agent troubleshooting
Secondary Keywords: AI debugging, AI error fixes, common AI issues
Target Intent: problem-solving
Suggested Slug: docs/troubleshooting
Meta Description: Fix common issues with AI agents and prompts. Quick solutions for token limits, API errors, slow responses, and more.
-->

Fix common issues with AI agents and prompts. Solutions for API errors, performance problems, and quality issues.

---

## API Key Authentication Failed

```
Error: Authentication failed. Invalid API key provided
```

Verify your API key is set in environment variables with no whitespace:

```python
import os

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("API key not found in environment variables")
```

## Rate Limit Exceeded

```
Error: Rate limit exceeded. Please try again in Xs
```

Implement exponential backoff with random jitter:

```python
import asyncio
import random

async def with_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            if "rate limit" in str(e).lower():
                await asyncio.sleep(2 ** attempt + random.random())
                continue
            raise
```

## Slow Response Times

Use caching to reduce redundant API calls for repeated inputs:

```python
from functools import lru_cache

@lru_cache(maxsize=100)
async def cached_process(input_data: str) -> str:
    return await expensive_operation(input_data)
```

## Inconsistent Output Quality

Validate responses against expected schema before using results:

```python
def validate_output(result: dict) -> bool:
    required_fields = ["summary", "analysis", "recommendations"]
    return all(field in result for field in required_fields)
```

## Context Loss Between Steps

Track context explicitly so each step receives the information it needs:

```python
class ContextManager:
    def __init__(self):
        self.context = {}

    def update_context(self, key: str, value):
        self.context[key] = value

    def get_context(self, key: str):
        return self.context.get(key)
```

## Prompt Chain Breaks

Save intermediate results so chains can recover from failures:

```python
class ChainManager:
    def __init__(self):
        self.checkpoints = {}

    async def execute_step(self, step_id: str, func):
        try:
            result = await func()
            self.checkpoints[step_id] = result
            return result
        except Exception:
            if step_id in self.checkpoints:
                return self.checkpoints[step_id]
            raise
```

## Routing Misclassification

Add confidence thresholds so low-confidence requests hit a fallback:

```python
async def route_with_confidence(request: str, threshold: float = 0.7):
    classification = await classify_request(request)
    if classification.confidence < threshold:
        return await fallback_handler(request)
    return await route_to_handler(classification.type, request)
```

## Parallel Task Overload

Limit concurrent requests with a semaphore to prevent resource exhaustion:

```python
semaphore = asyncio.Semaphore(5)

async def controlled_execute(task):
    async with semaphore:
        return await task()
```

---

**Built by [4M Labs](https://4mlabs.io) — Ship AI that works.**

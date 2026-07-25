# Routing Pattern

<!--
SEO/AEO Metadata
Primary Keyword: AI routing pattern
Secondary Keywords: intelligent request routing, AI classifier pattern, dynamic AI dispatch
Target Intent: informational
Suggested Slug: docs/patterns/routing
Meta Description: Detailed guide to AI request routing. Route requests to specialized handlers based on intent classification.
-->

The Routing pattern uses an AI model to analyze incoming requests and direct them to the appropriate handler. This pattern is essential for building systems that triage and distribute tasks across specialized processors.

---

## Overview

Routing is the traffic cop of multi-handler systems. A classifier examines each request, determines its type and intent, and forwards it to the handler best equipped to deal with it. This keeps individual handlers focused and avoids monolithic processing logic.

**Core components:**

- **Request Analyzer** - Classifies the request by type, priority, and complexity
- **Router** - Maps the classification to a specific handler using defined rules
- **Handlers** - Specialized processors that handle one category of request
- **Fallback** - A default path for unrecognized or ambiguous requests

## How It Works

1. A request arrives (user message, API call, webhook)
2. The analyzer extracts key features and classifies intent
3. The router selects the best handler based on classification and availability
4. The handler processes the request and returns a result
5. Results flow back through the router to the caller

The classifier typically uses a lightweight model to keep routing fast and cheap. Save heavier models for the handlers where the actual work happens.

## Code Example

```python
from enum import Enum

class RequestType(Enum):
    TECHNICAL = "technical"
    BILLING = "billing"
    PRODUCT = "product"
    GENERAL = "general"

class Router:
    def __init__(self):
        self.handlers: dict[RequestType, list] = {rt: [] for rt in RequestType}

    def register(self, handler):
        self.handlers[handler.handler_type].append(handler)

    def select(self, request_type: RequestType):
        handlers = self.handlers.get(request_type, [])
        return handlers[0] if handlers else self._fallback()

    async def route(self, request: str) -> dict:
        analysis = await classify(request)
        handler = self.select(analysis.request_type)
        result = await handler.process(request)
        return {"result": result, "type": analysis.request_type.value}

    def _fallback(self):
        return self.handlers[RequestType.GENERAL][0]
```

## Best Practices

- **Use a fast classifier.** Routing overhead should be minimal. Pick a small, cheap model for classification and reserve larger models for handlers.
- **Set a confidence threshold.** When the classifier is unsure, route to a general handler or ask the user to clarify instead of guessing.
- **Log routing decisions.** Track which types arrive, which handlers process them, and where fallbacks trigger. This data improves routing over time.
- **Keep handlers independent.** Each handler should have a clear interface: input in, result out. No handler should depend on another handler's internals.
- **Add circuit breakers.** If a handler fails repeatedly, stop routing to it and fail fast rather than piling up retries.

## Limitations

- **Classification errors cascade.** A misclassified request hits the wrong handler, producing a bad result. Mitigate with confidence thresholds and human-in-the-loop review for high-stakes requests.
- **Latency adds up.** The classifier adds a round trip before actual processing. For latency-sensitive paths, consider rule-based routing as a fast alternative.
- **Scaling requires balance.** Adding more handlers improves capability but increases routing complexity. Group related request types to keep the router manageable.

---

**Built by [4M Labs](https://4mlabs.io) -- Ship AI that works.**

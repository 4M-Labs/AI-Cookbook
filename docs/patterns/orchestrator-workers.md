# Orchestrator-Workers Pattern

<!--
SEO/AEO Metadata
Primary Keyword: orchestrator workers AI pattern
Secondary Keywords: AI task decomposition, AI parallel workers, AI coordinator pattern
Target Intent: informational
Suggested Slug: docs/patterns/orchestrator-workers
Meta Description: Detailed guide to the orchestrator-workers pattern for coordinating multiple AI agents. Architecture, code, and best practices.
-->

The Orchestrator-Workers pattern uses a central coordinator to break complex tasks into subtasks, assign them to specialized AI workers, and synthesize the results into a coherent output.

---

## Overview

The orchestrator acts as the brain. It plans the workflow, assigns tasks to worker agents, manages dependencies, and combines results. Each worker handles a focused domain: research, synthesis, validation, or specialized analysis.

**Use this when:**
- Tasks require multiple types of expertise
- Workflows have interdependent steps
- Quality control across outputs matters
- A single AI pass is not enough

## How It Works

1. **Planning** - The orchestrator analyzes the goal and creates a task graph with dependencies
2. **Assignment** - Tasks are dispatched to the appropriate worker type
3. **Execution** - Workers process their tasks (parallel where possible)
4. **Synthesis** - The orchestrator combines worker outputs into a final result
5. **Validation** - Optional quality check before returning the output

## Code Example

```python
from dataclasses import dataclass
from enum import Enum

class WorkerType(Enum):
    RESEARCHER = "researcher"
    SYNTHESIZER = "synthesizer"
    VALIDATOR = "validator"

@dataclass
class Task:
    id: str
    worker_type: WorkerType
    description: str
    depends_on: list[str]

@dataclass
class WorkerResult:
    task_id: str
    output: str
    status: str  # "success" or "failure"

class Orchestrator:
    def __init__(self, workers: dict[WorkerType, callable]):
        self.workers = workers

    async def orchestrate(self, goal: str) -> dict:
        # 1. Plan
        plan = await self.create_plan(goal)
        tasks = plan["tasks"]

        # 2. Execute respecting dependencies
        results = await self.execute_tasks(tasks)

        # 3. Synthesize
        final = await self.synthesize(results, goal)

        return {"goal": goal, "output": final, "results": results}

    async def execute_tasks(self, tasks: list[Task]) -> list[WorkerResult]:
        completed = set()
        results = []

        while len(completed) < len(tasks):
            ready = [
                t for t in tasks
                if t.id not in completed
                and all(d in completed for d in t.depends_on)
            ]
            for task in ready:
                worker = self.workers[task.worker_type]
                result = await worker(task)
                results.append(result)
                completed.add(task.id)

        return results
```

## Best Practices

- **Clear task definitions** - Each worker gets explicit requirements and context
- **Dependency management** - Define task order to avoid race conditions
- **Error handling** - Workers should return structured failures, not crash
- **Selective parallelism** - Run independent tasks concurrently, serialized tasks sequentially
- **Result validation** - Add a validation worker to catch inconsistencies before synthesis

## Limitations

- **Overhead** - Orchestrator planning adds latency for simple tasks
- **Token cost** - Multiple AI calls multiply token usage
- **Context loss** - Workers operate in isolation; passing full context between them is expensive
- **Complexity** - Debugging distributed worker failures is harder than a single AI call

---

**Built by [4M Labs](https://4mlabs.io) — Ship AI that works.**

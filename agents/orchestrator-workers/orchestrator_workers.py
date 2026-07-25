"""
Orchestrator-Workers Agent Pattern Implementation

This file demonstrates the Orchestrator-Workers pattern using the OpenAI Agents SDK.
It showcases how a central orchestrator agent plans work and delegates subtasks
to specialized worker agents, then synthesizes their outputs.
"""

import asyncio
from agents import Agent, Runner, function_tool


@function_tool
def get_worker_types() -> str:
    """List available worker types and their capabilities."""
    return (
        "researcher: Gathers and analyzes information\n"
        "synthesizer: Combines and summarizes information\n"
        "validator: Checks outputs against requirements\n"
        "specialist: Performs domain-specific tasks"
    )


async def run_worker(worker: Agent, task_description: str) -> str:
    """Execute a single worker task and return its output."""
    result = await Runner.run(worker, task_description, max_turns=2)
    return result.final_output


async def orchestrate(goal: str) -> str:
    """
    Orchestrator plans the work, dispatches worker agents,
    and synthesizes the final result.
    """
    researcher = Agent(
        name="Researcher",
        instructions="""You are a research worker. Gather and analyze information
        thoroughly. Focus on accuracy and completeness. Provide citations.""",
    )

    synthesizer = Agent(
        name="Synthesizer",
        instructions="""You are a synthesis worker. Combine information from
        multiple sources into coherent, well-structured outputs.""",
    )

    validator = Agent(
        name="Validator",
        instructions="""You are a validation worker. Check outputs against
        specified requirements. Be thorough about issues found.""",
    )

    # Step 1: Orchestrator creates a plan
    orchestrator = Agent(
        name="Orchestrator",
        instructions="""You are a task orchestrator. Break down the goal into
        subtasks. For each subtask, specify: id, worker type, and description.
        Return a numbered list of tasks.""",
        tools=[get_worker_types],
    )

    plan_result = await Runner.run(
        orchestrator,
        f"Create an execution plan for this goal: {goal}",
        max_turns=3,
    )
    plan = plan_result.final_output
    print(f"Execution plan:\n{plan}\n")

    # Step 2: Dispatch workers (simplified: run researcher for all tasks)
    worker_tasks = [
        "Research the target audience and market trends for this project.",
        "Analyze competitor strategies and identify gaps.",
        "Synthesize findings into a coherent market analysis.",
        "Validate that all claims are supported by evidence.",
    ]

    print("Dispatching worker agents...")
    worker_results = await asyncio.gather(
        *(run_worker(researcher, task) for task in worker_tasks)
    )

    # Step 3: Synthesize final output
    combined = "\n\n".join(
        f"--- Worker {i+1} ---\n{r}" for i, r in enumerate(worker_results)
    )

    final = await Runner.run(
        synthesizer,
        f"Goal: {goal}\n\nWorker outputs:\n{combined}\n\n"
        "Synthesize these into a final coherent report.",
        max_turns=1,
    )

    return final.final_output


if __name__ == "__main__":
    goal = (
        "Create a comprehensive market analysis report for a new smartphone app, "
        "including target audience analysis, competitor research, and pricing strategy."
    )

    print("=== OpenAI Agents SDK (Python): Orchestrator-Workers ===")
    result = asyncio.run(orchestrate(goal))
    print(result)

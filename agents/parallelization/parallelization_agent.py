"""
Parallelization Agent Pattern Implementation

This file demonstrates the Parallelization pattern using the OpenAI Agents SDK.
It showcases how to distribute tasks across multiple agent runs simultaneously,
then aggregate results for complex, multi-part operations.
"""

import asyncio
from agents import Agent, Runner


async def process_subtask(agent: Agent, task: str) -> str:
    """Run a single subtask through an agent and return its output."""
    result = await Runner.run(agent, task, max_turns=1)
    return result.final_output


async def parallel_process(main_task: str, subtasks: list[str]) -> str:
    """
    Fan out subtasks to agents in parallel, then aggregate.

    Each subtask runs as an independent Runner.run() call.
    asyncio.gather() executes them concurrently. A synthesizer
    agent merges all results into a coherent final output.
    """
    analyst = Agent(
        name="Analyst",
        instructions="""You are an analyst. Given a specific aspect to analyze,
        provide a focused, detailed analysis. Be concise and evidence-based.""",
    )

    # Run all subtasks concurrently
    print(f"Processing {len(subtasks)} subtasks in parallel...")
    results = await asyncio.gather(
        *(process_subtask(analyst, task) for task in subtasks)
    )

    # Aggregate results with a synthesizer agent
    synthesizer = Agent(
        name="Synthesizer",
        instructions="""You are a synthesizer. Combine multiple analysis results
        into a single coherent report. Resolve conflicts, highlight key findings,
        and maintain logical flow.""",
    )

    combined = "\n\n".join(
        f"--- Subtask {i+1} ---\n{r}" for i, r in enumerate(results)
    )

    final = await Runner.run(
        synthesizer,
        f"Main task: {main_task}\n\nIndividual results:\n{combined}",
        max_turns=1,
    )

    return final.final_output


if __name__ == "__main__":
    task = "Analyze a research paper and provide a comprehensive review"
    subtasks = [
        "Analyze the methodology section: evaluate research design, sample size, and controls.",
        "Analyze the results section: assess statistical significance and data visualization.",
        "Analyze the discussion: check if conclusions are supported by the data.",
    ]

    print("=== OpenAI Agents SDK (Python): Parallelization ===")
    result = asyncio.run(parallel_process(task, subtasks))
    print(result)

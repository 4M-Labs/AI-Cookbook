"""
Prompt Chaining Pattern Implementation

This file demonstrates the Prompt Chaining pattern using the Claude Agent SDK.
It showcases how to chain multiple LLM calls to solve a complex problem step by step,
where each step's output feeds into the next.
"""

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions


async def analyze_problem(problem: str) -> str:
    """Step 1: Analyze the math problem to understand its nature."""
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"""Analyze this math problem and return a JSON object with:
        - problem_type: the category of problem
        - relevant_concepts: array of math concepts needed
        - suggested_approach: high-level solution strategy
        - potential_challenges: array of difficulties to watch for
        - estimated_complexity: simple, moderate, or complex

        Problem: "{problem}" """,
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return result


async def create_solution_plan(problem: str, analysis: str) -> str:
    """Step 2: Create a solution plan based on the analysis."""
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"""Based on this problem analysis, create a step-by-step solution plan.

        Problem: "{problem}"
        Analysis: {analysis}

        Return a JSON object with:
        - steps: array of step-by-step instructions
        - formulas: array of formulas needed
        - variables_to_track: array of variables
        - expected_result: the expected form of the answer""",
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return result


async def generate_solution(problem: str, analysis: str, plan: str) -> str:
    """Step 3: Generate the final solution based on analysis and plan."""
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"""Solve this math problem step by step, showing all work.

        Problem: "{problem}"
        Analysis: {analysis}
        Plan: {plan}

        Show every calculation and explain your reasoning clearly.""",
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return result


async def solve_math_problem(problem: str) -> str:
    """
    Full chain: analyze -> plan -> solve.

    Each step uses a separate query() call, and the output of each
    step feeds into the next prompt, forming a sequential chain.
    """
    print("Step 1: Analyzing problem...")
    analysis = await analyze_problem(problem)

    print("Step 2: Creating solution plan...")
    plan = await create_solution_plan(problem, analysis)

    print("Step 3: Generating solution...")
    solution = await generate_solution(problem, analysis, plan)

    return solution


if __name__ == "__main__":
    problem = (
        "A cylindrical water tank has a radius of 5 meters and a height of 12 meters. "
        "If water is flowing into the tank at a rate of 3 cubic meters per minute, "
        "how long will it take to fill the tank to 80% of its capacity?"
    )

    print("=== Claude Agent SDK (Python): Prompt Chaining ===")
    result = asyncio.run(solve_math_problem(problem))
    print(result)

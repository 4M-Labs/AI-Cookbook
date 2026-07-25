"""
Evaluator-Optimizer Agent Pattern Implementation

This file demonstrates the Evaluator-Optimizer pattern using the Claude Agent SDK.
It showcases a feedback loop where generated solutions are evaluated against
criteria and refined until they meet quality standards.
"""

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

MAX_ATTEMPTS = 5
MINIMUM_SCORE = 7.5


async def generate_solution(prompt: str) -> str:
    """Generate an initial solution based on the prompt."""
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"Generate a high-quality solution for: {prompt}",
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return result


async def evaluate_solution(
    solution: str, criteria: list[str], prompt: str
) -> dict:
    """
    Evaluate a solution against criteria. Returns a score (0-10)
    and structured feedback for improvement.
    """
    criteria_text = "\n".join(f"- {c}" for c in criteria)
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"""Evaluate this solution against the criteria below.

        Original prompt: {prompt}
        Solution: {solution}

        Criteria:
        {criteria_text}

        Return a JSON object with:
        - score: number (0-10)
        - meets_criteria: boolean (score >= {MINIMUM_SCORE})
        - feedback: specific, actionable improvement suggestions""",
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return {"raw": result}


async def refine_solution(
    prompt: str, previous_solution: str, feedback: str
) -> str:
    """Generate an improved solution based on evaluation feedback."""
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"""Improve this solution based on the feedback provided.

        Original prompt: {prompt}
        Previous solution: {previous_solution}
        Feedback: {feedback}

        Generate an improved version that addresses the feedback.""",
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return result


async def optimize(prompt: str, criteria: list[str]) -> dict:
    """
    Main loop: generate -> evaluate -> refine until quality threshold
    is met or max attempts are exhausted.
    """
    print(f"Optimizing: {prompt[:60]}...")

    solution = await generate_solution(prompt)
    evaluation = await evaluate_solution(solution, criteria, prompt)
    attempts = 1

    while attempts < MAX_ATTEMPTS:
        print(f"  Attempt {attempts}: refining...")
        solution = await refine_solution(prompt, solution, evaluation["raw"])
        evaluation = await evaluate_solution(solution, criteria, prompt)
        attempts += 1

        if "meets_criteria" in evaluation["raw"] and "true" in evaluation["raw"].lower():
            print("  Quality threshold reached!")
            break

    return {
        "final_solution": solution,
        "evaluation": evaluation["raw"],
        "attempts": attempts,
    }


if __name__ == "__main__":
    prompt = "Create a marketing strategy for an eco-friendly phone case targeting millennials"
    criteria = [
        "Accuracy: strategies are based on sound marketing principles",
        "Completeness: covers audience, positioning, channels, metrics",
        "Relevance: addresses eco-friendly aspects and millennial preferences",
        "Clarity: easy to understand and well-structured",
        "Actionability: provides concrete, implementable steps",
    ]

    print("=== Claude Agent SDK (Python): Evaluator-Optimizer ===")
    result = asyncio.run(optimize(prompt, criteria))
    print(f"\nAttempts: {result['attempts']}")
    print(f"\nFinal Solution:\n{result['final_solution']}")

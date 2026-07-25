"""
Reflection Agent Pattern Implementation

This file demonstrates the Reflection pattern using the Claude Agent SDK.
It showcases a generator-evaluator loop: an agent generates a draft answer,
then a separate reflection step critiques it, then the agent refines based
on the critique. This is the classic "reflection" pattern where an agent
reviews its own output and improves iteratively.
"""

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

MAX_ROUNDS = 2


async def generate_draft(topic: str) -> str:
    """Generate an initial draft answer on the given topic."""
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"""Write a short essay outline (3-5 paragraphs) on: "{topic}"

        Include:
        - A compelling thesis statement
        - 3 supporting arguments with brief explanations
        - A conclusion that ties back to the thesis

        Be specific and use concrete examples where possible.""",
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return result


async def reflect_on_draft(topic: str, draft: str) -> str:
    """Critique the draft and provide structured feedback for improvement."""
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"""You are a critical reviewer. Analyze this essay outline on "{topic}" and provide specific, actionable feedback.

        Draft to review:
        {draft}

        Evaluate on these dimensions:
        1. Thesis strength: Is the argument clear and compelling?
        2. Evidence quality: Are examples specific and convincing?
        3. Structure: Does the outline flow logically?
        4. Completeness: Are there gaps in the argument?
        5. Originality: Does it offer fresh perspective?

        For each dimension, provide:
        - A brief assessment (1-2 sentences)
        - A concrete suggestion for improvement

        Be honest and specific — vague praise is not helpful.""",
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return result


async def refine_draft(topic: str, draft: str, critique: str) -> str:
    """Refine the draft based on the critique from the reflection step."""
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"""Revise this essay outline on "{topic}" based on the reviewer's feedback.

        Original draft:
        {draft}

        Reviewer's critique:
        {critique}

        Produce an improved version that:
        - Addresses each point raised by the reviewer
        - Maintains the strengths of the original
        - Adds specificity where the reviewer found gaps
        - Improves structure and flow""",
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return result


async def reflect_and_refine(topic: str) -> dict:
    """
    Full reflection loop: generate -> reflect -> refine, repeated for MAX_ROUNDS.

    Each round the agent generates (or refines) a draft, then a separate
    reflection step critiques it. The critique feeds back into the next
    refinement cycle, producing progressively better output.
    """
    print(f"Topic: {topic}")
    print("-" * 50)

    # Round 1: generate initial draft
    print("Round 1: Generating initial draft...")
    draft = await generate_draft(topic)

    for round_num in range(1, MAX_ROUNDS + 1):
        print(f"Round {round_num}: Reflecting on draft...")
        critique = await reflect_on_draft(topic, draft)

        print(f"Round {round_num}: Refining based on critique...")
        draft = await refine_draft(topic, draft, critique)

        print(f"Round {round_num}: Complete.")

    return {"topic": topic, "final_outline": draft, "rounds": MAX_ROUNDS}


if __name__ == "__main__":
    topic = "The future of renewable energy"

    print("=== Claude Agent SDK (Python): Reflection ===")
    result = asyncio.run(reflect_and_refine(topic))
    print(f"\nFinal Outline ({result['rounds']} rounds):\n")
    print(result["final_outline"])

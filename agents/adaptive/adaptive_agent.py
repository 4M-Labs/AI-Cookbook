"""
Adaptive Agent Pattern Implementation

This file demonstrates the Adaptive Agent pattern using the Claude Agent SDK.
It showcases an agent that first classifies the complexity of a query, then
routes to different strategies based on the classification. Simple queries get
a direct answer; complex queries get a multi-step analysis with evaluation.
Two sequential query() calls handle classification and response generation.
"""

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions


async def classify_query_complexity(user_query: str) -> dict:
    """
    Step 1: Classify the query into simple or complex.

    A simple query can be answered directly with factual recall.
    A complex query requires multi-step reasoning, analysis, or synthesis.
    """
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"""Classify this query by complexity. Respond with ONLY a JSON object.

        Query: "{user_query}"

        Classification criteria:
        - "simple": Single-fact recall, definition, or straightforward question
          that can be answered in 1-2 sentences without analysis.
        - "complex": Requires multi-step reasoning, comparison, analysis,
          evaluation, or synthesis of multiple information sources.

        Return JSON:
        {{
            "complexity": "simple" or "complex",
            "reasoning": "brief explanation of why",
            "strategy": "direct_answer" for simple, "multi_step_analysis" for complex
        }}""",
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return {"raw": result}


async def direct_answer(user_query: str) -> str:
    """Handle a simple query with a direct, concise response."""
    options = ClaudeAgentOptions(max_turns=1)
    result = ""
    async for msg in query(
        prompt=f"""Answer this question directly and concisely in 1-3 sentences.
        Be factual and precise. No preamble or filler.

        Question: "{user_query}" """,
        options=options,
    ):
        if msg.type == "assistant":
            result += msg.content
    return result


async def multi_step_analysis(user_query: str) -> str:
    """
    Handle a complex query with structured multi-step analysis.

    Steps: decompose -> research/analyze -> synthesize -> evaluate.
    """
    options = ClaudeAgentOptions(max_turns=1)

    # Step 1: Decompose the query
    decomposition = ""
    async for msg in query(
        prompt=f"""Decompose this complex query into sub-questions that can each
        be answered independently. List 3-5 specific sub-questions.

        Query: "{user_query}" """,
        options=options,
    ):
        if msg.type == "assistant":
            decomposition += msg.content

    # Step 2: Answer each sub-question
    analysis = ""
    async for msg in query(
        prompt=f"""Based on these sub-questions, provide a detailed analysis
        for each one. Be thorough and evidence-based.

        Original query: "{user_query}"

        Sub-questions to analyze:
        {decomposition}""",
        options=options,
    ):
        if msg.type == "assistant":
            analysis += msg.content

    # Step 3: Synthesize and evaluate
    synthesis = ""
    async for msg in query(
        prompt=f"""Synthesize the following analyses into a coherent, comprehensive
        answer to the original query. Then evaluate the quality of your answer
        by noting any limitations, assumptions, or areas requiring further research.

        Original query: "{user_query}"

        Analysis of sub-questions:
        {analysis}

        Provide:
        1. A synthesized answer (3-5 paragraphs)
        2. A brief quality self-assessment""",
        options=options,
    ):
        if msg.type == "assistant":
            synthesis += msg.content

    return synthesis


async def adaptive_respond(user_query: str) -> dict:
    """
    Main adaptive flow: classify -> route -> respond.

    First classifies query complexity, then chooses the appropriate
    strategy: direct answer for simple queries, multi-step analysis
    for complex ones.
    """
    print(f"Query: {user_query}")
    print("-" * 50)

    # Step 1: Classify
    print("Step 1: Classifying query complexity...")
    classification = await classify_query_complexity(user_query)
    print(f"Classification: {classification['raw'][:200]}...")

    # Step 2: Route based on classification
    is_complex = "complex" in classification["raw"].lower()

    if is_complex:
        print("Step 2: Routing to multi-step analysis...")
        response = await multi_step_analysis(user_query)
        strategy_used = "multi_step_analysis"
    else:
        print("Step 2: Routing to direct answer...")
        response = await direct_answer(user_query)
        strategy_used = "direct_answer"

    print("Done.")

    return {
        "query": user_query,
        "classification": classification["raw"],
        "strategy_used": strategy_used,
        "response": response,
    }


if __name__ == "__main__":
    query_text = "What causes climate change?"

    print("=== Claude Agent SDK (Python): Adaptive Agent ===")
    result = asyncio.run(adaptive_respond(query_text))
    print(f"\nStrategy used: {result['strategy_used']}")
    print(f"\nResponse:\n{result['response']}")

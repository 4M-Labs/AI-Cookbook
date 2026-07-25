"""
Tool Use Agent Pattern Implementation

This file demonstrates the Tool Use pattern using the OpenAI Agents SDK.
It showcases an agent with multiple tools that can call them dynamically
based on user queries. The agent decides which tools to invoke and in what
order to fulfill a request.
"""

import asyncio
import math
from agents import Agent, Runner, function_tool


@function_tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression. Supports basic arithmetic, powers, roots, and common math functions.

    Examples:
    - "2 + 2" -> "4"
    - "sqrt(144)" -> "12.0"
    - "3.14 * 5^2" -> "78.5"
    """
    allowed_names = {
        "abs": abs,
        "round": round,
        "min": min,
        "max": max,
        "sum": sum,
        "pow": pow,
        "sqrt": math.sqrt,
        "pi": math.pi,
        "e": math.e,
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "log": math.log,
        "log10": math.log10,
        "factorial": math.factorial,
        "ceil": math.ceil,
        "floor": math.floor,
    }
    try:
        result = eval(expression, {"__builtins__": {}}, allowed_names)
        return f"Result: {result}"
    except Exception as e:
        return f"Error evaluating expression: {e}"


@function_tool
def web_search_simulator(query: str) -> str:
    """Simulate a web search and return relevant results. Returns a list of mock search results with titles, URLs, and snippets.

    Use this to find information, papers, articles, or data on any topic.
    """
    mock_results = {
        "renewable energy": [
            {"title": "Solar Power Efficiency Reaches Record 47.1%", "url": "https://energy.gov/solar-record", "snippet": "NREL researchers achieved 47.1% efficiency in multi-junction solar cells, surpassing previous records."},
            {"title": "Wind Energy Cost Drops 70% Since 2010", "url": "https://iea.org/wind-costs", "snippet": "Onshore wind is now the cheapest source of new electricity generation in many markets."},
            {"title": "Grid-Scale Battery Storage Breakthroughs 2025", "url": "https://nature.com/energy-storage", "snippet": "New iron-air batteries promise 100-hour storage at one-tenth the cost of lithium-ion."},
        ],
        "AI research": [
            {"title": "Scaling Laws for Neural Language Models", "url": "https://arxiv.org/abs/2001.08361", "snippet": "Empirical study of how performance depends on dataset size, model size, and compute."},
            {"title": "Constitutional AI: Harmlessness from AI Feedback", "url": "https://arxiv.org/abs/2212.08073", "snippet": "Method for training AI systems to be helpful, harmless, and honest without human labels."},
        ],
        "climate change": [
            {"title": "IPCC AR6 Synthesis Report", "url": "https://ipcc.ch/report/ar6-syr", "snippet": "Human activities have caused approximately 1.1C of global warming above pre-industrial levels."},
            {"title": "Carbon Capture Technology Progress 2025", "url": "https://nature.com/carbon-capture", "snippet": "Direct air capture costs fell 60% in 3 years, reaching $250 per ton of CO2."},
        ],
    }

    query_lower = query.lower()
    results = []
    for key, entries in mock_results.items():
        if any(word in query_lower for word in key.split()):
            results.extend(entries)

    if not results:
        results = [
            {"title": f"General results for: {query}", "url": "https://example.com", "snippet": "No specific mock data available for this query. This is a simulated search result."},
        ]

    formatted = []
    for i, r in enumerate(results[:5], 1):
        formatted.append(f"{i}. {r['title']}\n   URL: {r['url']}\n   {r['snippet']}")

    return "\n\n".join(formatted)


@function_tool
def read_file(file_path: str) -> str:
    """Read the contents of a file at the given path. Returns the file content as a string. Use this to examine existing files, data, or documents."""
    mock_files = {
        "data.csv": "name,score,grade\nAlice,95,A\nBob,82,B\nCharlie,91,A\nDiana,78,C",
        "config.json": '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 2048}',
        "notes.md": "# Project Notes\n\n- Deadline: March 15\n- Budget: $50,000\n- Team: 4 engineers",
    }
    if file_path in mock_files:
        return f"Contents of {file_path}:\n{mock_files[file_path]}"
    return f"File not found: {file_path}. Available files: {', '.join(mock_files.keys())}"


async def process_query(user_query: str) -> str:
    """
    Run the tool-use agent on a user query.

    The agent receives the query and decides which tools to call
    dynamically. It can chain multiple tool calls in sequence.
    """
    agent = Agent(
        name="ToolAssistant",
        instructions="""You are a helpful assistant with access to tools.
        Use the calculator for math computations, web_search_simulator for
        finding information, and read_file for examining files.

        Always use the appropriate tool for each part of the user's request.
        If multiple tools are needed, call them in logical order and combine
        the results into a clear, comprehensive answer.""",
        tools=[calculator, web_search_simulator, read_file],
    )

    result = await Runner.run(
        agent,
        user_query,
        max_turns=5,
    )

    return result.final_output


if __name__ == "__main__":
    query = "Calculate the area of a circle with radius 5, then search for related research papers."

    print("=== OpenAI Agents SDK (Python): Tool Use ===")
    answer = asyncio.run(process_query(query))
    print(answer)

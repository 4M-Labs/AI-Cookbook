"""
Autonomous Agent Pattern Implementation

This file demonstrates the Autonomous Agent pattern using the OpenAI Agents SDK.
It showcases how to create an agent with tools that operates in an observe-think-act
loop, autonomously working toward a goal until it decides the task is complete.
"""

import asyncio
from agents import Agent, Runner, function_tool


@function_tool
def search_web(query: str) -> str:
    """Search the web for information on a given topic."""
    # In production, integrate with a real search API.
    return f"Search results for '{query}': [simulated results about {query}]"


@function_tool
def analyze_data(data: str) -> str:
    """Analyze the given data and extract key insights."""
    return f"Analysis of '{data}': Key insights extracted."


@function_tool
def write_report(content: str) -> str:
    """Write the final report to a file."""
    # In production, write to a real file.
    return f"Report written successfully ({len(content)} chars)."


async def autonomous_research(goal: str, max_iterations: int = 5) -> str:
    """
    Agent loop: observe -> think -> act, repeating until the goal
    is achieved or the iteration limit is reached.

    The agent decides its own next action based on the current state,
    using function_tool tools to interact with the environment.
    """
    agent = Agent(
        name="ResearchAgent",
        instructions=f"""You are an autonomous research agent. Your goal is: {goal}

        You have tools to search, analyze, and write. In each step:
        1. Assess what you know and what you still need
        2. Choose the best tool to advance toward the goal
        3. Use the tool and evaluate the result
        4. If the goal is achieved, write the final report and stop

        Be methodical. Don't repeat actions. Track your progress.""",
        tools=[search_web, analyze_data, write_report],
    )

    result = await Runner.run(
        agent,
        f"Begin working toward this goal: {goal}",
        max_turns=max_iterations,
    )

    return result.final_output


if __name__ == "__main__":
    goal = "Research the latest advancements in renewable energy and summarize the top 3 most promising technologies"

    print("=== OpenAI Agents SDK (Python): Autonomous Agent ===")
    result = asyncio.run(autonomous_research(goal, max_iterations=5))
    print(result)

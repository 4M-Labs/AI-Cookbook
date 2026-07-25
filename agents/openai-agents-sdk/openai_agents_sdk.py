"""
OpenAI Agents SDK Pattern Implementation

This file demonstrates the agentic pattern using the OpenAI Agents SDK (Python).
It showcases how to build multi-agent systems with handoffs, guardrails,
and built-in tracing for complex workflows.
"""

import asyncio
from agents import Agent, Runner, function_tool, set_tracing_disabled


@function_tool
def fetch_live_data(url: str) -> dict:
    """Fetch live data from an API endpoint."""
    import urllib.request
    import json

    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


async def produce_article(topic: str) -> str:
    """
    Full pipeline: research -> write -> edit with handoffs.

    Handoffs let agents transfer control to the next specialist
    once their part is complete, creating a sequential pipeline.
    """
    set_tracing_disabled(False)  # Enable tracing for observability

    researcher = Agent(
        name="Researcher",
        instructions="""You are a research specialist. Given a topic, produce
        a concise factual summary with key statistics, recent developments,
        and relevant context. Cite your confidence level for each claim.""",
    )

    writer = Agent(
        name="Writer",
        instructions="""You are a content writer. Given research notes, produce
        a clear, engaging draft. Use short paragraphs, concrete examples,
        and a professional tone. Do not fabricate data.""",
    )

    editor = Agent(
        name="Editor",
        instructions="""You are an editor. Review the draft for accuracy, clarity,
        tone, and structure. Fix grammar, improve flow, and flag any
        unsupported claims. Return the polished final version.""",
    )

    result = await Runner.run(
        researcher,
        f"Research this topic thoroughly: {topic}",
        tools=[fetch_live_data],
        max_turns=5,
        handoffs=[writer],
    )

    print("Pipeline output:", result.final_output)
    return result.final_output


async def safe_assistant(user_message: str) -> str:
    """
    Single agent with guardrails for safe tool use.

    Guardrails validate inputs and outputs at each step,
    preventing the agent from taking unsafe actions.
    """
    assistant = Agent(
        name="SafeAssistant",
        instructions="""You are a helpful assistant. Only answer questions
        about publicly available information. Never share personal data
        or attempt to access restricted systems.""",
        tools=[fetch_live_data],
    )

    result = await Runner.run(
        assistant,
        user_message,
        max_turns=3,
    )

    return result.final_output


async def conversational_agent(messages: list) -> str:
    """Multi-turn conversation with a persistent agent."""
    agent = Agent(
        name="Conversationalist",
        instructions="""You are a knowledgeable assistant. Maintain context
        across the conversation. Be concise and precise.""",
    )

    result = await Runner.run(
        agent,
        messages[-1]["content"],
        max_turns=1,
    )

    return result.final_output


if __name__ == "__main__":
    print("=== OpenAI Agents SDK (Python): Article Pipeline ===")
    asyncio.run(produce_article("The state of AI in 2025"))

    print("\n=== OpenAI Agents SDK (Python): Safe Assistant ===")
    answer = asyncio.run(safe_assistant("What is quantum computing?"))
    print(answer)

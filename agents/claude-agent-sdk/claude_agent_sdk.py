"""
Claude Agent SDK Pattern Implementation

This file demonstrates the agentic pattern using the Claude Agent SDK (Python).
It showcases how to build tool-using agents with streaming, built-in
tools, and model-agnostic design for complex workflows.
"""

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions


async def review_code(file_path: str) -> str:
    """Code review agent that analyzes a file and suggests improvements."""
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Glob", "Grep"],
        max_turns=5,
    )

    output = ""
    async for msg in query(
        prompt=f"Review the code in {file_path}. Check for bugs, performance "
        "issues, and style problems. Provide specific line-level suggestions.",
        options=options,
    ):
        if msg.type == "assistant":
            output += msg.content

    return output


async def analyze_and_report(directory: str) -> str:
    """File operations agent that reads, analyzes, and writes files."""
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Glob", "Grep", "Write"],
        max_turns=8,
    )

    messages = []
    async for msg in query(
        prompt=f"Scan {directory} for TODO and FIXME comments. Write a "
        f"summary report to {directory}/todo-report.md with file paths, "
        "line numbers, and the comment text.",
        options=options,
    ):
        messages.append(msg)

    return "".join(m.content for m in messages if m.type == "assistant")


async def research_topic(topic: str) -> str:
    """Web research agent that searches and synthesizes findings."""
    options = ClaudeAgentOptions(
        allowed_tools=["WebSearch", "Read", "Write"],
        max_turns=6,
    )

    output = ""
    async for msg in query(
        prompt=f'Research "{topic}". Search for recent developments, find '
        "authoritative sources, and write a 300-word summary with citations.",
        options=options,
    ):
        if msg.type == "assistant":
            output += msg.content

    return output


async def data_pipeline(source_url: str) -> list:
    """
    Multi-step pipeline: gather -> transform -> validate.

    Each step uses different tools, and the agent decides
    which tools to invoke based on the task description.
    """
    options = ClaudeAgentOptions(
        allowed_tools=["Bash", "Read", "Write", "WebSearch"],
        max_turns=10,
    )

    steps = []
    async for msg in query(
        prompt=f"Fetch data from {source_url}, validate its structure, "
        "transform it into clean JSON, and save the result to output.json.",
        options=options,
    ):
        if msg.type == "assistant":
            steps.append(msg.content)

    return steps


async def stream_assistant(user_message: str):
    """Streaming agent with real-time output."""
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Glob"],
        max_turns=3,
    )

    async for msg in query(prompt=user_message, options=options):
        if msg.type == "assistant":
            print(msg.content, end="", flush=True)


if __name__ == "__main__":
    print("=== Claude Agent SDK (Python): Code Review ===")
    asyncio.run(review_code("./src/index.py"))

    print("\n=== Claude Agent SDK (Python): Research ===")
    summary = asyncio.run(research_topic("AI agent frameworks 2025"))
    print(summary)

"""
Routing Agent Pattern Implementation

This file demonstrates the Routing Agent pattern using the OpenAI Agents SDK.
It showcases how to route customer support queries to different specialized agents
based on query classification using handoffs.
"""

import asyncio
from agents import Agent, Runner, function_tool


@function_tool
def classify_query(query: str) -> str:
    """Classify a customer query into technical, billing, general, or complaint."""
    # In production, call an LLM or classifier here.
    # This is a simplified example.
    keywords = {
        "technical": ["error", "bug", "broken", "login", "password", "crash"],
        "billing": ["charge", "refund", "invoice", "payment", "subscription"],
        "complaint": ["terrible", "worst", "frustrated", "unacceptable", "angry"],
    }
    query_lower = query.lower()
    for category, words in keywords.items():
        if any(w in query_lower for w in words):
            return category
    return "general"


async def handle_customer_query(query: str) -> str:
    """
    Route a customer query to the right specialist via handoffs.

    The classifier agent determines the query type, then hands off
    to the matching specialist agent for a tailored response.
    """
    classifier = Agent(
        name="Classifier",
        instructions="""You are a query classifier. Given a customer message,
        determine its type: technical, billing, complaint, or general.
        Reply with ONLY the category name.""",
        tools=[classify_query],
    )

    technical = Agent(
        name="TechnicalSupport",
        instructions="""You are a technical support specialist. Provide clear,
        step-by-step troubleshooting instructions. Be concise and helpful.""",
    )

    billing = Agent(
        name="BillingSupport",
        instructions="""You are a billing specialist. Handle payment and
        subscription inquiries with precision. Explain charges clearly.""",
    )

    complaint = Agent(
        name="ComplaintHandler",
        instructions="""You are a customer relations specialist. Express empathy,
        acknowledge the issue, and focus on actionable resolution steps.""",
    )

    general = Agent(
        name="GeneralSupport",
        instructions="""You are a friendly customer service agent. Answer general
        questions about products, services, and policies. Be concise.""",
    )

    result = await Runner.run(
        classifier,
        f"Classify and route this query: {query}",
        max_turns=3,
        handoffs=[technical, billing, complaint, general],
    )

    return result.final_output


if __name__ == "__main__":
    queries = [
        "I can't log into my account. I've tried resetting my password twice.",
        "I was charged twice for my subscription. I need a refund!",
        "This is the third time I've contacted you. Your service is terrible!",
        "What are your store hours for this weekend?",
    ]

    for q in queries:
        print(f"\n{'='*50}")
        print(f"QUERY: {q}")
        print(f"{'='*50}")
        answer = asyncio.run(handle_customer_query(q))
        print(answer)

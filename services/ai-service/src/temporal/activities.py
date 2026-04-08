import os
from temporalio import activity
from langchain_openai import ChatOpenAI

@activity.defn
async def evaluate_candidate_message(message: str) -> str:
    """Uses LLM to evaluate if a message needs human recruitment escalation."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if api_key and api_key != "":
        try:
            llm = ChatOpenAI(model="gpt-4o", temperature=0)
            result = await llm.ainvoke(f"Does this message require a human recruiter to intervene (such as offer details, explicit salary figures, etc)? Answer YES or NO. Message: {message}")
            if "YES" in result.content.upper():
                return "ESCALATE_TO_RECRUITER"
            return "SAFE_TO_AUTO_REPLY"
        except Exception:
            pass # fallback

    if "salary" in message.lower() or "offer" in message.lower():
        return "ESCALATE_TO_RECRUITER"
    return "SAFE_TO_AUTO_REPLY"

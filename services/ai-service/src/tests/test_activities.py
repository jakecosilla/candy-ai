import pytest
from src.temporal.activities import evaluate_candidate_message
import os

@pytest.mark.asyncio
async def test_evaluate_candidate_message_unsafe():
    os.environ["OPENAI_API_KEY"] = ""
    result = await evaluate_candidate_message("What is the salary for this position?")
    assert result == "ESCALATE_TO_RECRUITER"

@pytest.mark.asyncio
async def test_evaluate_candidate_message_safe():
    os.environ["OPENAI_API_KEY"] = ""
    result = await evaluate_candidate_message("Do you work remotely?")
    assert result == "SAFE_TO_AUTO_REPLY"

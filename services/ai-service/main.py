import os
import uuid
import asyncio
from datetime import timedelta
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

# Langchain
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# Temporal
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker

# --- AI Workflows ---

def get_temporal_host() -> str:
    return os.environ.get("TEMPORAL_HOST", "localhost:7233")

@activity.defn
async def evaluate_candidate_message(message: str) -> str:
    """Uses LLM to evaluate if a message needs human recruitment escalation."""
    if os.environ.get("OPENAI_API_KEY"):
        llm = ChatOpenAI(model="gpt-4o", temperature=0)
        result = await llm.ainvoke(f"Does this message require a human recruiter to intervene (such as offer details, explicit salary figures, etc)? Answer YES or NO. Message: {message}")
        if "YES" in result.content.upper():
            return "ESCALATE_TO_RECRUITER"
        return "SAFE_TO_AUTO_REPLY"

    if "salary" in message.lower() or "offer" in message.lower():
        return "ESCALATE_TO_RECRUITER"
    return "SAFE_TO_AUTO_REPLY"

@workflow.defn
class AIReviewWorkflow:
    @workflow.run
    async def run(self, message: str) -> str:
        # A simple Temporal workflow that routes candidate messages
        decision = await workflow.execute_activity(
            evaluate_candidate_message,
            message,
            start_to_close_timeout=timedelta(seconds=20),
        )
        return decision

# --- FastAPI App ---

app = FastAPI(title="Candy AI - AI Service")

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "candy-ai-service"}

@app.post("/chat")
async def chat(request: ChatRequest):
    # Connect to Temporal client to decide escalation
    try:
        client = await Client.connect(get_temporal_host())
        decision = await client.execute_workflow(
            AIReviewWorkflow.run,
            request.message,
            id=f"ai-review-{uuid.uuid4()}",
            task_queue="ai-task-queue",
        )
    except Exception as e:
        decision = "SAFE_TO_AUTO_REPLY"
        print(f"Failed to connect to temporal or execute workflow: {e}")
    
    user_input = request.message.lower()
    if decision == "ESCALATE_TO_RECRUITER":
        reply = "I see you have questions about specific offers. I am escalating this to our Talent team, and a human recruiter will follow up with you momentarily."
    else:
        if os.environ.get("OPENAI_API_KEY"):
            llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are the Candy AI Assistant, a helpful recruiting assistant. Answer candidate questions helpfully."),
                ("user", "{message}")
            ])
            chain = prompt | llm
            response = await chain.ainvoke({"message": request.message})
            reply = response.content
        else:
            if "remote" in user_input:
                reply = "Yes, the company supports remote work across many roles! Filter by 'Remote' on the careers page."
            else:
                reply = f"Thank you for your interest! As the Candy AI Assistant, I am here to help you navigate our process. (Mock Response to '{request.message}')"
        
    return {"reply": reply}

# --- Startup script for running the server OR the Worker ---

async def run_worker():
    client = await Client.connect(get_temporal_host())
    worker = Worker(
        client,
        task_queue="ai-task-queue",
        workflows=[AIReviewWorkflow],
        activities=[evaluate_candidate_message],
    )
    print("Starting AI Temporal Worker...")
    await worker.run()

if __name__ == "__main__":
    import sys
    import uvicorn
    # Usage: python main.py worker OR python main.py api
    if len(sys.argv) > 1 and sys.argv[1] == "worker":
        asyncio.run(run_worker())
    else:
        port = int(os.environ.get("PORT", 8000))
        uvicorn.run(app, host="0.0.0.0", port=port)

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

@activity.defn
async def evaluate_candidate_message(message: str) -> str:
    """Uses LLM to evaluate if a message needs human recruitment escalation."""
    # In production, uses ChatOpenAI
    # llm = ChatOpenAI(model="gpt-4o", temperature=0)
    # result = await llm.ainvoke(f"Does this message require a human recruiter to intervene? Message: {message}")
    
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
    # This is where we would normally connect to Temporal client
    # client = await Client.connect("localhost:7233")
    # decision = await client.execute_workflow(
    #     AIReviewWorkflow.run,
    #     request.message,
    #     id=f"ai-review-{uuid.uuid4()}",
    #     task_queue="ai-task-queue",
    # )
    
    # We mock it for the demo
    user_input = request.message.lower()
    if "salary" in user_input or "offer" in user_input:
        reply = "I see you have questions about specific offers. I am escalating this to our Talent team, and a human recruiter will follow up with you momentarily."
    elif "remote" in user_input:
        reply = "Yes, AntiGravity supports remote work across many roles! Filter by 'Remote' on the careers page."
    else:
        reply = f"Thank you for your interest! As the Candy AI Assistant, I am here to help you navigate our process. (Mock Response to '{request.message}')"
        
    return {"reply": reply}

# --- Startup script for running the server OR the Worker ---

async def run_worker():
    client = await Client.connect("localhost:7233")
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
        uvicorn.run(app, host="0.0.0.0", port=8000)

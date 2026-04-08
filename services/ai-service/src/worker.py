import asyncio
import os
from temporalio.client import Client
from temporalio.worker import Worker
from src.temporal.workflows import AIReviewWorkflow
from src.temporal.activities import evaluate_candidate_message

def get_temporal_host() -> str:
    return os.environ.get("TEMPORAL_HOST", "localhost:7233")

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
    asyncio.run(run_worker())

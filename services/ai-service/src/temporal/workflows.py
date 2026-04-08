from datetime import timedelta
from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    from .activities import evaluate_candidate_message

@workflow.defn
class AIReviewWorkflow:
    @workflow.run
    async def run(self, message: str) -> str:
        decision = await workflow.execute_activity(
            evaluate_candidate_message,
            message,
            start_to_close_timeout=timedelta(seconds=20),
        )
        return decision

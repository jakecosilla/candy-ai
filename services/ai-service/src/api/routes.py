import os
import uuid
from typing import Annotated, TypedDict, Optional
from fastapi import APIRouter
from pydantic import BaseModel
from temporalio.client import Client
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

from src.temporal.workflows import AIReviewWorkflow
from src.utils.logger import logger

router = APIRouter()

# --- LangGraph Setup ---

class AgentState(TypedDict):
    messages: list[BaseMessage]
    decision: str
    reply: str

def get_temporal_host() -> str:
    return os.environ.get("TEMPORAL_HOST", "localhost:7233")

async def analyze_message_node(state: AgentState):
    """Analyze the message via Temporal escalation workflow."""
    last_message = state["messages"][-1].content
    try:
        client = await Client.connect(get_temporal_host())
        decision = await client.execute_workflow(
            AIReviewWorkflow.run,
            last_message,
            id=f"ai-review-{uuid.uuid4()}",
            task_queue="ai-task-queue",
        )
    except Exception as e:
        logger.error(f"Temporal execution error: {e}")
        decision = "SAFE_TO_AUTO_REPLY"
    
    return {"decision": decision}

async def chat_node(state: AgentState):
    """Standard chat response."""
    last_message = state["messages"][-1].content
    api_key = os.environ.get("OPENAI_API_KEY")
    
    if api_key and api_key != "":
        try:
            llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
            system_msg = SystemMessage(content="You are the Candy AI Assistant, a helpful recruiting assistant.")
            response = await llm.ainvoke([system_msg] + state["messages"])
            reply = response.content
        except Exception as e:
            logger.error(f"LLM Reasoning failure: {e}")
            reply = _mock_reply(last_message)
    else:
        reply = _mock_reply(last_message)
    
    return {"reply": reply}

async def escalate_node(state: AgentState):
    """Escalation response."""
    return {"reply": "I see you have questions about specific offers. I am escalating this to our Talent team, and a human recruiter will follow up with you momentarily."}

def router_edge(state: AgentState):
    """Route to chat or escalate based on decision."""
    if state["decision"] == "ESCALATE_TO_RECRUITER":
        return "escalate"
    return "chat"

# Build the Graph
workflow = StateGraph(AgentState)
workflow.add_node("analyze", analyze_message_node)
workflow.add_node("chat", chat_node)
workflow.add_node("escalate", escalate_node)

workflow.set_entry_point("analyze")
workflow.add_conditional_edges("analyze", router_edge, {
    "chat": "chat",
    "escalate": "escalate"
})
workflow.add_edge("chat", END)
workflow.add_edge("escalate", END)

app_graph = workflow.compile()

# --- API Endpoints ---

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "candy-ai-service"}

@router.post("/chat")
async def chat(request: ChatRequest):
    # Execute the LangGraph
    inputs = {"messages": [HumanMessage(content=request.message)]}
    result = await app_graph.ainvoke(inputs)
    
    return {"reply": result["reply"]}

def _mock_reply(user_input: str) -> str:
    user_input = user_input.lower()
    if "remote" in user_input:
        return "Yes, the company supports remote work across many roles! Filter by 'Remote' on the careers page."
    return "Thank you for your interest! As the Candy AI Assistant, I am here to help you navigate our process. (Mock Response)"

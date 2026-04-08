# Candy AI Service (Python)

Intelligent agentic orchestration service for candidate interaction and automated escalation logic.

## Key Features
- **LangGraph State Machine**: Manages conversation flow and priority routing.
- **Temporal Integration**: Decouples heavy AI processing and decision-making into durable activities.
- **LLM/LangChain**: Native OpenAI integration with keyword fallbacks for localized resilience.

## Local Setup
1. **Prepare Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. **Run API**:
   ```bash
   python src/main.py
   ```
3. **Run Worker**:
   ```bash
   python src/worker.py
   ```

## Development
- **Testing**: `PYTHONPATH=. ./venv/bin/pytest src/tests`
- **Linting**: Standard PEP8 compliance.

# Candy AI Platform

Candy AI is an AI-powered careers platform designed to map candidate experiences, power practical Recruiter and HR operations, and intelligently serve knowledge safely.

## Architecture & Layout

This monorepo utilizes a clean, production-ready structure dividing infrastructural components and standalone business services:

- **`infra/`**
  - Contains database schemas (`schema.sql`) and other deployment configurations.
- **`services/`**
  - **`frontend/`** (Candidate Experience): React + TypeScript + Vite UI.
  - **`api/`** (Node.js API BFF Layer): Express backend bridging frontend and backend services.
  - **`ai-service/`** (Python Capabilities): LangChain FastAPI workflows for processing candidate LLM queries securely using PGVector retrieval. Split dynamically into `ai-api` and `ai-worker`.
  - **`sync-service/`** (Golang Temporal Worker): Structurally separated Go service synchronizing external ATS data (Greenhouse) directly into Postgres.

## Requirements

- Docker and Docker Compose (highly recommended for unified local execution)
- Node.js (v18+) (if modifying frontend/api)
- Python (v3.9+) (if modifying ai-service)
- Go (v1.21+) (if compiling sync-service manually)

### 1. The Production-Ready Way (All-In-One Docker Compose)

Navigate to the project root and start all services (alongside Temporal and PostgreSQL infrastructure):

```bash
# 1. Prepare env
cp .env.example .env

# 2. Start stack
docker-compose up --build -d

# 3. Verify Health
./infra/scripts/smoke-test.sh
```

This launches:
- **Frontend** mapped to [http://localhost](http://localhost) (Nginx production build)
- **Node API** mapped to [http://localhost:4000](http://localhost:4000)
- **AI API** mapped to [http://localhost:8000](http://localhost:8000)
- **Temporal UI** mapped to [http://localhost:8233](http://localhost:8233)
- Background workers (`sync-service` and `ai-service-worker`) running autonomously.

### 2. Manual Development Execution
If you prefer running services independently for active debugging:

**API Service:**
```bash
cd services/api
npm install
npm run dev
```

**AI Service:**
```bash
cd services/ai-service
source venv/bin/activate
pip install -r requirements.txt
python main.py api      # Run the API
# python main.py worker # Run the Temporal Worker
```

**Frontend:**
```bash
cd services/frontend
npm install
npm run dev
```

**Sync Service:**
```bash
cd services/sync-service
go run main.go
```

## Testing

Testing is mandatory across all active service layers.
- **Backend Services:** Unit tests must isolate logic without live connections (mocking HTTP pipelines and databases safely using mock suites like `DATA-DOG/go-sqlmock` directly).
- Use local testing tools (e.g., `go test ./...`) within respective service directories to validate builds entirely before merging iterations.

## Responsible AI & Governance
This platform adheres to strict data compliance. All LLM endpoints are guarded against releasing candidate PII, company salaries, or internal policy documents improperly.

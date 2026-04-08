# Candy AI Platform

Candy AI is an AI-powered careers platform designed to map candidate experiences, power practical Recruiter and HR operations, and intelligently serve knowledge safely.

## Architecture & Layout

This monorepo utilizes a clean, production-ready structure dividing infrastructural components and standalone business services:

- **`docs/`**
  - Centralized documentation for all platform components.
- **`infra/`**
  - Database migrations, schemas, and verification scripts.
- **`services/`**
  - **`frontend/`**: React + TypeScript UI. [Docs here](docs/services/frontend.md)
  - **`api/`**: Node.js BFF Layer. [Docs here](docs/services/api.md)
  - **`ai-service/`**: Python AI orchestration. [Docs here](docs/services/ai-service.md)
  - **`sync-service/`**: Go ATS synchronization. [Docs here](docs/services/sync-service.md)

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

### 2. Manual Development Execution (Native Hot-Reload)
For active development with hot-reloading across all layers:

```bash
# 1. Ensure Docker is running (for Postgres/Temporal infra)
# 2. Run the orchestrator script
./run-all.sh
```

This script handles starting the Node API, Python AI Service, Go Sync Service, and Vite Frontend simultaneously with consolidated logging.

### 3. Individual Service Manual Start
If you prefer running a single service for targeted debugging:
- **API**: `cd services/api && npm run dev`
- **Frontend**: `cd services/frontend && npm run dev`
- **AI Service**: `cd services/ai-service && ./venv/bin/python src/main.py`
- **Sync Service**: `cd services/sync-service && go run main.go`

## Testing

Testing is mandatory across all active service layers.
- **Backend Services:** Unit tests must isolate logic without live connections (mocking HTTP pipelines and databases safely using mock suites like `DATA-DOG/go-sqlmock` directly).
- Use local testing tools (e.g., `go test ./...`) within respective service directories to validate builds entirely before merging iterations.

## Responsible AI & Governance
This platform adheres to strict data compliance. All LLM endpoints are guarded against releasing candidate PII, company salaries, or internal policy documents improperly.

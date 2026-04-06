# Candy AI Platform

Candy AI is an AI-powered careers platform designed to map candidate experiences, power practical Recruiter and HR operations, and intelligently serve knowledge safely.

## Architecture & Repositories

This platform is divided into four main services managed separately in this monorepo structure:

1. **`frontend/`** (Candidate Experience) 
   - A React + TypeScript + Vite application.
   - Provides a premium, glassmorphic UI integrated with AI chat features and job boards.
2. **`api/`** (Node.js API BFF Layer)
   - Express backend that supplies structured job data, serving as the connective API pipeline between our services.
3. **`sync-service/`** (Golang Synchronization Service)
   - Go application structured to handle syncing long-running Greenhouse tasks using standard operational workflows (e.g., Temporal).
4. **`ai-service/`** (Python Capabilities)
   - FastAPI integration layering LangChain workflows that process candidate LLM queries securely using PGVector retrieval processes (RAG).

## Requirements
- Node.js (v18+)
- Python (v3.9+)
- Docker (for infra services)
- Go (if compiling the sync-service manually)

## Running Locally

### 1. Start Infrastructure (Temporal, PostgreSQL, Redis)
Navigate to the root directory and start the Docker containers:
```bash
docker-compose up -d
```

### 2. Start the API Service
```bash
cd api
npm install
npm run dev
# Note: Since it's a dev baseline, you can also use `npx ts-node src/index.ts`
```
*(Runs on port 4000)*

### 3. Start the AI Service
```bash
cd ai-service
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*(Runs on port 8000)*

### 4. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*(Runs on Vite's default port, e.g., 5173)*

### 5. (Optional) Run the Golang Sync Service
```bash
cd sync-service
go run main.go
```

## Responsible AI & Governance
This platform adheres to AntiGravity's strict data compliance. All LLM endpoints are guarded against releasing candidate PII, company salaries, or internal policy documents improperly.

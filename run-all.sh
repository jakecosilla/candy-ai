#!/bin/bash

# Candy AI Platform - Local Development Orchestrator
# This script starts all microservices and the frontend in development mode.

set -e

# Colors for log clarity
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}          CANDY AI - TALENT OPS HUB         ${NC}"
echo -e "${BLUE}==============================================${NC}"

# 1. Load Environment Variables (Robustly)
if [ -f .env ]; then
    echo -e "${CYAN}Loading environment variables from .env...${NC}"
    set -a
    source .env
    set +a
fi

# 2. Local Endpoint Mapping (Native Override)
# Force 127.0.0.1 to avoid IPv6/localhost resolution delays or issues.
if [[ "$DATABASE_URL" == *"@postgres:"* ]]; then
    DATABASE_URL=${DATABASE_URL//@postgres:/@127.0.0.1:}
    echo -e "${YELLOW}Mapped DATABASE_URL internal hostname to 127.0.0.1${NC}"
fi

if [[ "$TEMPORAL_HOST" == "temporal:"* ]]; then
    TEMPORAL_HOST=${TEMPORAL_HOST//temporal:/127.0.0.1:}
    echo -e "${YELLOW}Mapped TEMPORAL_HOST internal hostname to 127.0.0.1${NC}"
fi

export DATABASE_URL
export TEMPORAL_HOST

# 3. Infrastructure Check
SKIP_INFRA=false
if [[ "$1" == "--skip-infra" ]]; then
    SKIP_INFRA=true
fi

# Detect container engine
DOCKER_CMD="docker"
COMPOSE_CMD="docker-compose"

if command -v podman &> /dev/null && ! command -v docker &> /dev/null; then
    DOCKER_CMD="podman"
    if podman compose version &> /dev/null; then
        COMPOSE_CMD="podman compose"
    else
        COMPOSE_CMD="podman-compose"
    fi
fi

if [ "$SKIP_INFRA" = false ]; then
    echo -e "${CYAN}Checking infrastructure using ${DOCKER_CMD}...${NC}"
    if ! $DOCKER_CMD info > /dev/null 2>&1; then
        echo -e "${RED}Error: ${DOCKER_CMD} is not running. Please start your container engine or use --skip-infra.${NC}"
        exit 1
    fi

    echo -e "${CYAN}Starting infrastructure via ${COMPOSE_CMD}...${NC}"
    $COMPOSE_CMD up -d postgres temporal db-migrator
    
    echo -e "${CYAN}Waiting for Temporal port 7233 to be reachable...${NC}"
    timeout=30
    while ! nc -z 127.0.0.1 7233 > /dev/null 2>&1; do
      sleep 1
      timeout=$((timeout - 1))
      if [ $timeout -le 0 ]; then
        echo -e "${RED}Error: Temporal port 7233 timed out. Check logs: ${DOCKER_CMD} logs candy-ai-temporal-1${NC}"
        exit 1
      fi
    done
    
    echo -e "${CYAN}Temporal port is open. Waiting for 'default' namespace registration (12s)...${NC}"
    sleep 12
    echo -e "${GREEN}Infrastructure appears healthy and ready.${NC}"
else
    echo -e "${YELLOW}Skipping container checks. Ensure Postgres and Temporal are running natively.${NC}"
fi

# 4. Port Cleanup
echo -e "${CYAN}Cleaning up existing app processes...${NC}"
for port in 4000 8000 5173; do
    PID=$(lsof -t -i :$port || true)
    if [ ! -z "$PID" ]; then
        kill -9 $PID 2>/dev/null || true
    fi
done

# 5. Start Services
PIDS=()

cleanup() {
    echo -e "\n${RED}Shutting down all services...${NC}"
    for pid in "${PIDS[@]}"; do
        kill -9 "$pid" 2>/dev/null || true
    done
    exit
}

trap cleanup SIGINT SIGTERM

# API (Node.js)
echo -e "${GREEN}Starting API Hub (Port 4000)...${NC}"
(cd services/api && DATABASE_URL=$DATABASE_URL TEMPORAL_HOST=$TEMPORAL_HOST npm run dev) &
PIDS+=($!)

# AI Service API (Python)
echo -e "${PURPLE}Starting AI Service API (Port 8000)...${NC}"
(
    cd services/ai-service
    [ -d "venv" ] && source venv/bin/activate
    export PYTHONPATH=.
    export PORT=8000
    export TEMPORAL_HOST=$TEMPORAL_HOST
    python3 src/main.py
) &
PIDS+=($!)

# AI Service Worker (Python)
echo -e "${PURPLE}Starting AI Service Worker...${NC}"
(
    cd services/ai-service
    [ -d "venv" ] && source venv/bin/activate
    export PYTHONPATH=.
    export TEMPORAL_HOST=$TEMPORAL_HOST
    python3 src/worker.py
) &
PIDS+=($!)

# Sync Service (Go)
echo -e "${CYAN}Starting Sync Service (Temporal Worker)...${NC}"
(
    cd services/sync-service
    DATABASE_URL=$DATABASE_URL TEMPORAL_HOST=$TEMPORAL_HOST go run main.go
) &
PIDS+=($!)

# Frontend (Vite)
echo -e "${GREEN}Starting Talent Ops Hub Frontend (Port 5173)...${NC}"
(cd services/frontend && npm run dev) &
PIDS+=($!)

echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}   ALL SERVICES ARE RUNNING NATIVELY (DEV)    ${NC}"
echo -e "${GREEN}==============================================${NC}"
echo -e "Frontend:   http://localhost:5173"
echo -e "API Hub:    http://127.0.0.1:4000"
echo -e "AI Service: http://127.0.0.1:8000"
echo -e "Temporal:   http://127.0.0.1:8233 (Web UI)"
echo -e "${BLUE}Press Ctrl+C to stop all services.${NC}"

# Wait for all background processes
wait

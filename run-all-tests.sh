#!/bin/bash

# Candy AI Platform - Unified Test Orchestrator
# Executes full test suites across all microservices

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Starting Full Monorepo Test Suite...${NC}\n"

# 1. API (Node.js)
echo "Running API Tests..."
(cd services/api && bash -l -c "npm test")

# 2. Sync Service (Go)
echo -e "\nRunning Sync Service Tests..."
(cd services/sync-service && /usr/local/go/bin/go test ./... -v)

# 3. AI Service (Python)
echo -e "\nRunning AI Service Tests..."
(cd services/ai-service && ./venv/bin/python3 -m pytest src/tests)

# 4. Frontend (React/Vitest)
echo -e "\nRunning Frontend Tests..."
(cd services/frontend && bash -l -c "npm test")

# 5. Database (Migrations)
echo -e "\nRunning Database Migration Tests..."
if command -v docker &> /dev/null; then
    ./infra/db/test_migrations.sh
else
    echo -e "${RED}⚠️  Skipping migration tests: Docker not found in current environment.${NC}"
fi

echo -e "\n${GREEN}✅ All platform tests passed successfully!${NC}"

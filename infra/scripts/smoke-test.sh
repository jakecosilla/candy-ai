#!/bin/bash

# Candy AI System Smoke Test Script
# Verifies all microservices are responding to health checks

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🚀 Starting Candy AI Stack Check..."

check_service() {
    local name=$1
    local url=$2
    echo -n "Checking $name... "
    if curl -s --head --request GET "$url" | grep "200" > /dev/null; then
        echo -e "${GREEN}PASS${NC}"
    else
        echo -e "${RED}FAIL${NC} (URL: $url)"
        return 1
    fi
}

# 1. Check API Health
check_service "API (Node.js)" "http://localhost:4000/health" || exit 1

# 2. Check AI Service Health
check_service "AI Service (Python)" "http://localhost:8000/health" || exit 1

# 3. Check Frontend Accessibility
check_service "Frontend (App)" "http://localhost:80" || exit 1

# 4. Check Temporal UI (Optional but recommended)
check_service "Temporal UI" "http://localhost:8233" || exit 1

echo -e "\n${GREEN}✨ All core services are healthy!${NC}"

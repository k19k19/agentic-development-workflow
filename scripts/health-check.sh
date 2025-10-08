#!/bin/bash

# Health Check Script
# Run after deployment to verify all services are running correctly

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏥 Post-Deployment Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

FAILURES=0
WARNINGS=0

# Configuration (customize for your application)
BASE_URL="${BASE_URL:-http://localhost:3000}"
TIMEOUT=5

# Function to check HTTP endpoint
check_http() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}

    echo -n "Checking $name... "

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m $TIMEOUT "$url" || echo "000")

    if [ "$HTTP_CODE" = "$expected_code" ]; then
        echo "✅ OK (HTTP $HTTP_CODE)"
    else
        echo "❌ FAILED (Expected HTTP $expected_code, got HTTP $HTTP_CODE)"
        ((FAILURES++))
    fi
}

# Function to check JSON response
check_json() {
    local name=$1
    local url=$2
    local expected_field=$3

    echo -n "Checking $name... "

    RESPONSE=$(curl -s -m $TIMEOUT "$url" 2>/dev/null || echo "{}")

    if echo "$RESPONSE" | grep -q "\"$expected_field\""; then
        echo "✅ OK (contains '$expected_field')"
    else
        echo "❌ FAILED (missing '$expected_field')"
        echo "   Response: $RESPONSE"
        ((FAILURES++))
    fi
}

# Function to check port
check_port() {
    local name=$1
    local port=$2

    echo -n "Checking $name on port $port... "

    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "✅ Listening"
    else
        echo "❌ NOT listening"
        ((FAILURES++))
    fi
}

# Function to check process
check_process() {
    local name=$1
    local pattern=$2

    echo -n "Checking $name process... "

    if pgrep -f "$pattern" > /dev/null; then
        echo "✅ Running (PID: $(pgrep -f "$pattern"))"
    else
        echo "❌ NOT running"
        ((FAILURES++))
    fi
}

# Function to check docker container
check_container() {
    local name=$1

    echo -n "Checking Docker container $name... "

    if [ $(docker ps -q -f name=$name | wc -l) -gt 0 ]; then
        STATUS=$(docker inspect --format='{{.State.Status}}' $name)
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' $name 2>/dev/null || echo "no-healthcheck")

        if [ "$STATUS" = "running" ]; then
            if [ "$HEALTH" = "healthy" ] || [ "$HEALTH" = "no-healthcheck" ]; then
                echo "✅ Running ($HEALTH)"
            else
                echo "⚠️  Running but unhealthy ($HEALTH)"
                ((WARNINGS++))
            fi
        else
            echo "❌ NOT running (status: $STATUS)"
            ((FAILURES++))
        fi
    else
        echo "❌ Container not found"
        ((FAILURES++))
    fi
}

# ============================================================================
# 1. Service Ports
# ============================================================================

echo "1️⃣  Checking service ports..."
echo ""

# Customize these ports for your application
check_port "Web Server" 3000
check_port "API Server" 3001
check_port "WebSocket" 3002

echo ""

# ============================================================================
# 2. HTTP Endpoints
# ============================================================================

echo "2️⃣  Checking HTTP endpoints..."
echo ""

# Health check endpoint (customize URL)
check_http "Health Check" "${BASE_URL}/health" 200

# API endpoints (examples - customize for your app)
check_http "API Root" "${BASE_URL}/api" 200
check_http "API Version" "${BASE_URL}/api/version" 200

echo ""

# ============================================================================
# 3. API Responses
# ============================================================================

echo "3️⃣  Checking API responses..."
echo ""

# Check JSON responses (customize)
check_json "Health Endpoint" "${BASE_URL}/health" "status"
check_json "Version Endpoint" "${BASE_URL}/api/version" "version"

echo ""

# ============================================================================
# 4. Docker Containers (if applicable)
# ============================================================================

echo "4️⃣  Checking Docker containers..."
echo ""

if command -v docker > /dev/null 2>&1; then
    # Customize container names for your app
    if docker ps > /dev/null 2>&1; then
        check_container "app"
        check_container "nginx"
        check_container "database"
    else
        echo "⚠️  Docker not available or no containers running"
    fi
else
    echo "   Docker not installed (skipping)"
fi

echo ""

# ============================================================================
# 5. Process Check (for non-Docker deployments)
# ============================================================================

echo "5️⃣  Checking processes..."
echo ""

# Customize process patterns for your app
check_process "Node.js App" "node.*app.js"

echo ""

# ============================================================================
# 6. Database Connectivity
# ============================================================================

echo "6️⃣  Checking database connectivity..."
echo ""

# Example for checking database connection via API
check_http "Database Health" "${BASE_URL}/api/db/health" 200

echo ""

# ============================================================================
# 7. External Service Integrations
# ============================================================================

echo "7️⃣  Checking external integrations..."
echo ""

# Check external services if your app depends on them
# check_http "External API" "https://api.example.com/status" 200

echo "   (Configure external service checks in this script)"

echo ""

# ============================================================================
# 8. Log Files
# ============================================================================

echo "8️⃣  Checking log files..."
echo ""

# Check for recent errors in logs (customize paths)
if [ -d logs ]; then
    echo -n "Checking for recent errors... "

    # Look for errors in last 100 lines of latest log
    ERROR_COUNT=$(find logs -name "*.log" -type f -exec tail -100 {} \; | grep -i "error" | wc -l)

    if [ $ERROR_COUNT -eq 0 ]; then
        echo "✅ No errors in recent logs"
    else
        echo "⚠️  Found $ERROR_COUNT error(s) in recent logs"
        ((WARNINGS++))
    fi
else
    echo "   No logs directory found (skipping)"
fi

echo ""

# ============================================================================
# 9. Memory and CPU Usage
# ============================================================================

echo "9️⃣  Checking resource usage..."
echo ""

# Memory check
if command -v free > /dev/null 2>&1; then
    MEMORY_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    echo -n "Memory usage: $MEMORY_USAGE%... "

    if [ $MEMORY_USAGE -lt 80 ]; then
        echo "✅ OK"
    elif [ $MEMORY_USAGE -lt 90 ]; then
        echo "⚠️  HIGH"
        ((WARNINGS++))
    else
        echo "❌ CRITICAL"
        ((FAILURES++))
    fi
fi

# CPU load check
if command -v uptime > /dev/null 2>&1; then
    LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | tr -d ',')
    CPU_COUNT=$(nproc 2>/dev/null || echo "1")

    echo "Load average: $LOAD_AVG (CPUs: $CPU_COUNT)"
fi

echo ""

# ============================================================================
# 10. SSL/TLS Certificate (if HTTPS)
# ============================================================================

echo "🔟 Checking SSL certificate..."
echo ""

if [[ "$BASE_URL" == https://* ]]; then
    DOMAIN=$(echo "$BASE_URL" | sed 's|https://||' | sed 's|/.*||')

    echo -n "Checking SSL certificate for $DOMAIN... "

    # Check certificate expiry
    EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | \
             openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

    if [ -n "$EXPIRY" ]; then
        EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || echo "0")
        NOW_EPOCH=$(date +%s)
        DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

        if [ $DAYS_LEFT -gt 30 ]; then
            echo "✅ Valid ($DAYS_LEFT days remaining)"
        elif [ $DAYS_LEFT -gt 0 ]; then
            echo "⚠️  Expires soon ($DAYS_LEFT days remaining)"
            ((WARNINGS++))
        else
            echo "❌ EXPIRED"
            ((FAILURES++))
        fi
    else
        echo "⚠️  Could not verify"
        ((WARNINGS++))
    fi
else
    echo "   Not using HTTPS (skipping)"
fi

echo ""

# ============================================================================
# Summary
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Health Check Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $FAILURES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED"
    echo ""
    echo "🎉 Application is healthy!"
    exit 0
elif [ $FAILURES -eq 0 ]; then
    echo "✅ No critical failures"
    echo "⚠️  $WARNINGS warning(s) - review recommended"
    echo ""
    echo "⚡ Application is running but has warnings"
    exit 0
else
    echo "❌ $FAILURES failure(s)"
    echo "⚠️  $WARNINGS warning(s)"
    echo ""
    echo "🚨 CRITICAL ISSUES DETECTED"
    echo ""
    echo "Check logs and service status:"
    echo "  - docker-compose logs (if using Docker)"
    echo "  - tail -f logs/*.log (application logs)"
    echo "  - systemctl status <service> (if using systemd)"
    exit 1
fi

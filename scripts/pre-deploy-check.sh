#!/bin/bash

# Pre-Deployment Validation Script
# Run this before ANY deployment to catch common issues

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Pre-Deployment Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ERRORS=0
WARNINGS=0

# Function to report error
error() {
    echo "❌ ERROR: $1"
    ((ERRORS++))
}

# Function to report warning
warning() {
    echo "⚠️  WARNING: $1"
    ((WARNINGS++))
}

# Function to report success
success() {
    echo "✅ $1"
}

# ============================================================================
# 1. Git Status Check
# ============================================================================

echo "1️⃣  Checking git status..."

if ! git diff-index --quiet HEAD --; then
    warning "Uncommitted changes detected"
    git status --short
    echo ""
fi

# Check branch
CURRENT_BRANCH=$(git branch --show-current)
echo "   Current branch: $CURRENT_BRANCH"

if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "master" ]]; then
    warning "Deploying from main/master branch (consider using a release branch)"
fi

success "Git status checked"
echo ""


# ============================================================================
# 2. Dependencies Check
# ============================================================================

echo "2️⃣  Checking dependencies..."

# Check if package.json exists
if [ -f package.json ]; then
    success "package.json found"

    # Check if node_modules exists
    if [ ! -d node_modules ]; then
        warning "node_modules not found - run 'npm install'"
    else
        # Check for outdated packages
        echo "   Checking for outdated packages..."
        npm outdated || true
    fi

    # Check for security vulnerabilities
    echo "   Checking for security vulnerabilities..."
    npm audit --production || warning "Security vulnerabilities found"

elif [ -f requirements.txt ]; then
    success "requirements.txt found (Python project)"
    # Add Python-specific checks here
else
    warning "No dependency manifest found (package.json or requirements.txt)"
fi

echo ""

# ============================================================================
# 3. Build Check
# ============================================================================

echo "3️⃣  Checking build..."

if [ -f package.json ]; then
    if grep -q '"build":' package.json; then
        echo "   Running build..."
        if npm run build > /dev/null 2>&1; then
            success "Build successful"
        else
            error "Build failed - run 'npm run build' to see errors"
        fi
    else
        echo "   No build script defined (skipping)"
    fi
fi

echo ""

# ============================================================================
# 4. Test Suite
# ============================================================================

echo "4️⃣  Running tests..."

if [ -f package.json ]; then
    if grep -q '"test":' package.json; then
        echo "   Running test suite..."
        if npm test > /dev/null 2>&1; then
            success "All tests passing"
        else
            error "Tests failing - run 'npm test' to see failures"
        fi
    else
        warning "No test script defined"
    fi
fi

echo ""

# ============================================================================
# 5. Linting
# ============================================================================

echo "5️⃣  Running linter..."

if [ -f package.json ]; then
    if grep -q '"lint":' package.json; then
        echo "   Running linter..."
        if npm run lint > /dev/null 2>&1; then
            success "Linting passed"
        else
            error "Linting errors found - run 'npm run lint' to fix"
        fi
    else
        echo "   No lint script defined (skipping)"
    fi
fi

echo ""

# ============================================================================
# 6. Port Availability (for services)
# ============================================================================

echo "6️⃣  Checking port availability..."

# Common ports to check (customize for your app)
PORTS_TO_CHECK=(80 443 3000 3001 3002 3003 4000 5000 8080)

for PORT in "${PORTS_TO_CHECK[@]}"; do
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        warning "Port $PORT is already in use"
        lsof -Pi :$PORT -sTCP:LISTEN
    fi
done

success "Port check complete"
echo ""

# ============================================================================
# 7. Docker Configuration (if applicable)
# ============================================================================

echo "7️⃣  Checking Docker configuration..."

if [ -f docker-compose.yml ]; then
    success "docker-compose.yml found"

    # Validate docker-compose syntax
    if docker-compose config > /dev/null 2>&1; then
        success "docker-compose.yml is valid"
    else
        error "docker-compose.yml syntax errors"
    fi

    # Check if Docker is running
    if docker info > /dev/null 2>&1; then
        success "Docker daemon is running"
    else
        error "Docker daemon is not running"
    fi
elif [ -f Dockerfile ]; then
    success "Dockerfile found"

    # Validate Dockerfile syntax
    if docker build -t validation-check . --dry-run > /dev/null 2>&1; then
        success "Dockerfile is valid"
    else
        warning "Could not validate Dockerfile"
    fi
else
    echo "   No Docker configuration found (skipping)"
fi

echo ""

# ============================================================================
# 8. Database Migrations (if applicable)
# ============================================================================

echo "8️⃣  Checking database migrations..."

# Check for migration files
if [ -d migrations ] || [ -d db/migrations ]; then
    success "Migration directory found"

    # Check for pending migrations (customize based on your migration tool)
    # Example for Node.js migration tools:
    if [ -f package.json ]; then
        if grep -q '"migrate":' package.json; then
            echo "   Checking migration status..."
            # Add your migration check command here
            # npm run migrate:status || warning "Pending migrations detected"
        fi
    fi
else
    echo "   No migration directory found (skipping)"
fi

echo ""

# ============================================================================
# 9. Documentation Check
# ============================================================================

echo "9️⃣  Checking documentation..."

# Check README
if [ -f README.md ]; then
    success "README.md exists"

    # Check if README has minimum content
    if [ $(wc -l < README.md) -lt 10 ]; then
        warning "README.md seems too short (< 10 lines)"
    fi
else
    warning "README.md not found"
fi

# Check for CLAUDE.md (project memory)
if [ -f CLAUDE.md ]; then
    success "CLAUDE.md exists (project memory configured)"
else
    warning "CLAUDE.md not found (no project memory for Claude Code)"
fi

echo ""

# ============================================================================
# Summary
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Validation Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED"
    echo ""
    echo "🚀 Ready to deploy!"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "✅ No errors found"
    echo "⚠️  $WARNINGS warning(s) - review before deploying"
    echo ""
    echo "⚡ Deployment allowed but review warnings"
    exit 0
else
    echo "❌ $ERRORS error(s) found"
    echo "⚠️  $WARNINGS warning(s)"
    echo ""
    echo "🛑 FIX ERRORS BEFORE DEPLOYING"
    exit 1
fi

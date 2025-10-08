#!/bin/bash

# init-agentic-workflow.sh
# This script automates the integration of the Agentic Development Workflow Template
# into an existing project.

set -e # Exit immediately if a command exits with a non-zero status.

# --- Configuration ---
TEMPLATE_ROOT="$(dirname "$(realpath "$0")")"/.. # Assumes script is in scripts/ and template root is one level up
PROJECT_ROOT="$(pwd)"

# --- Utility Functions ---
log_info() { echo "\033[0;34m[INFO]\033[0m $1"; }
log_success() { echo "\033[0;32m[SUCCESS]\033[0m $1"; }
log_warn() { echo "\033[0;33m[WARN]\033[0m $1"; }
log_error() { echo "\033[0;31m[ERROR]\033[0m $1"; exit 1; }

# --- Welcome Message ---
log_info "🚀 Starting Agentic Development Workflow Template integration..."
log_info "This script will copy necessary files, merge configurations, and install dependencies."
log_info "Please ensure you are running this script from your existing project's root directory."

# --- 1. Copy Core Template Files ---
log_info "1. Copying core template files..."

# Directories
cp -r "$TEMPLATE_ROOT/ai-docs" "$PROJECT_ROOT/ai-docs" || log_warn "ai-docs already exists or could not be copied."
cp -r "$TEMPLATE_ROOT/app-docs" "$PROJECT_ROOT/app-docs" || log_warn "app-docs already exists or could not be copied."
cp -r "$TEMPLATE_ROOT/.claude" "$PROJECT_ROOT/.claude" || log_warn ".claude already exists or could not be copied."

# Scripts directory (excluding this script itself)
mkdir -p "$PROJECT_ROOT/scripts"
find "$TEMPLATE_ROOT/scripts" -maxdepth 1 -type f ! -name "init-agentic-workflow.sh" -exec cp {} "$PROJECT_ROOT/scripts/" \; || log_warn "Scripts already exist or could not be copied."

# Root-level Markdown files
cp "$TEMPLATE_ROOT/AGENTS.md" "$PROJECT_ROOT/AGENTS.md" || log_warn "AGENTS.md already exists or could not be copied."
cp "$TEMPLATE_ROOT/CLAUDE-TEMPLATE.md" "$PROJECT_ROOT/CLAUDE-TEMPLATE.md" || log_warn "CLAUDE-TEMPLATE.md already exists or could not be copied."
cp "$TEMPLATE_ROOT/GEMINI.md" "$PROJECT_ROOT/GEMINI.md" || log_warn "GEMINI.md already exists or could not be copied."
cp "$TEMPLATE_ROOT/GETTING-STARTED.md" "$PROJECT_ROOT/GETTING-STARTED.md" || log_warn "GETTING-STARTED.md already exists or could not be copied."
cp "$TEMPLATE_ROOT/MIGRATION-GUIDE.md" "$PROJECT_ROOT/MIGRATION-GUIDE.md" || log_warn "MIGRATION-GUIDE.md already exists or could not be copied."
cp "$TEMPLATE_ROOT/QUICK-START.md" "$PROJECT_ROOT/QUICK-START.md" || log_warn "QUICK-START.md already exists or could not be copied."
cp "$TEMPLATE_ROOT/USER-MEMORY-CLAUDE.md" "$PROJECT_ROOT/USER-MEMORY-CLAUDE.md" || log_warn "USER-MEMORY-CLAUDE.md already exists or could not be copied."

# Configuration files
cp "$TEMPLATE_ROOT/.eslintrc.js" "$PROJECT_ROOT/.eslintrc.js" || log_warn ".eslintrc.js already exists or could not be copied."
cp "$TEMPLATE_ROOT/.prettierrc.js" "$PROJECT_ROOT/.prettierrc.js" || log_warn ".prettierrc.js already exists or could not be copied."

# Vector store (empty or initial)
cp "$TEMPLATE_ROOT/vector-store.json" "$PROJECT_ROOT/vector-store.json" || log_warn "vector-store.json already exists or could not be copied."

log_success "Core template files copied."

# --- 2. Merge package.json ---
log_info "2. Merging package.json..."
PACKAGE_JSON="$PROJECT_ROOT/package.json"

if [ ! -f "$PACKAGE_JSON" ]; then
    log_warn "package.json not found. Creating a basic one."
    echo '{ "name": "my-agentic-project", "version": "1.0.0", "description": "", "main": "index.js", "scripts": {}, "keywords": [], "author": "", "license": "ISC", "dependencies": {}, "devDependencies": {} }' > "$PACKAGE_JSON"
fi

# Add/update scripts
node -e "
  const fs = require('fs');
  const path = require('path');
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.vectorize = pkg.scripts.vectorize || 'node scripts/vectorize-docs.js';
  pkg.scripts.search = pkg.scripts.search || 'node scripts/search-docs.js';
  pkg.scripts.lint = pkg.scripts.lint || 'eslint .';
  pkg.scripts['lint:fix'] = pkg.scripts['lint:fix'] || 'eslint . --fix';
  pkg.scripts.format = pkg.scripts.format || 'prettier --write .';
  pkg.devDependencies = pkg.devDependencies || {};
  pkg.devDependencies.eslint = pkg.devDependencies.eslint || '^8.0.0';
  pkg.devDependencies.prettier = pkg.devDependencies.prettier || '^3.0.0';
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies['@xenova/transformers'] = pkg.dependencies['@xenova/transformers'] || '^2.17.2';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
" || log_error "Failed to merge package.json. Please check for syntax errors."

log_success "package.json merged."

# --- 3. Merge .gitignore ---
log_info "3. Merging .gitignore..."
GITIGNORE="$PROJECT_ROOT/.gitignore"

if [ ! -f "$GITIGNORE" ]; then
    log_warn ".gitignore not found. Creating one."
    touch "$GITIGNORE"
fi

# Patterns to add if not already present
GIT_IGNORE_PATTERNS=(
    "node_modules/"
    "vector-store/"
    "ai-docs/"
    "app-docs/"
    ".env"
    "CLAUDE.md" # CLAUDE.md is project-specific memory, often not committed
)

for pattern in "${GIT_IGNORE_PATTERNS[@]}"; do
    if ! grep -qF "$pattern" "$GITIGNORE"; then
        echo "$pattern" >> "$GITIGNORE"
        log_info "Added '$pattern' to .gitignore."
    else
        log_info "'$pattern' already in .gitignore."
    fi
done

log_success ".gitignore merged."

# --- 4. Install Dependencies ---
log_info "4. Installing Node.js dependencies..."
if command -v npm &> /dev/null; then
    npm install || log_error "npm install failed. Please check your network connection or package.json."
    log_success "Node.js dependencies installed."
else
    log_warn "npm not found. Please install Node.js and npm to install dependencies."
fi

# --- 5. Initialize CLAUDE.md ---
log_info "5. Initializing CLAUDE.md..."
cp "$TEMPLATE_ROOT/CLAUDE-TEMPLATE.md" "$PROJECT_ROOT/CLAUDE.md" || log_error "Failed to copy CLAUDE-TEMPLATE.md."
log_success "CLAUDE.md created from template."

# --- Final Instructions ---
log_info "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "🎉 Agentic Workflow Template integration complete!"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "\nNext Steps:"
log_info "1. **Customize CLAUDE.md:** Open CLAUDE.md in your project root."
log_info "   - Update [Project Name] with your project's actual name."
log_info "   - Fill in your project's architecture, key file locations, and custom commands."
log_info "   - This is crucial for the AI agents to understand your project's context."
log_info "2. **Organize Existing Documentation:** Review your existing project documentation."
log_info "   - Move or adapt relevant parts into the 'app-docs/' directory for AI consumption."
log_info "   - Refer to 'app-docs/guides/MEMORY-MANAGEMENT-DOCUMENT-TYPES.md' for guidance."
log_info "3. **Set up User Memory (if not already done):** Refer to 'GETTING-STARTED.md' for instructions."
log_info "4. **Detect Project Scale:** Run 'node scripts/detect-project-scale.js' to get workflow recommendations."
log_info "5. **Start Developing!** Try a slash command, e.g., '/scout_plan_build "Add a health check endpoint" ""'."
log_info "\nThank you for using the Agentic Development Workflow Template!"
